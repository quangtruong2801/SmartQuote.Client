import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, Tooltip, Dialog, DialogContent, DialogActions, Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import { useSnackbar } from 'notistack';
import type { QuotationDetailDto, QuotationListDto } from '../types';
import { quotationService } from '../services/quotationService';
import { QuotationPrintTemplate } from './QuotationPrintTemplate';
import { formatCurrency } from '../../../utils/formatters';
import { QuotationDetailDialog } from './QuotationDetailDialog';
import { useTranslation } from 'react-i18next';

interface Props {
  quotations: QuotationListDto[];
  onRefresh: () => void;
}

// Map trạng thái → label + color
const STATUS_MAP: Record<string, { label: string; color: 'default' | 'info' | 'success' | 'error' }> = {
  Draft: { label: 'Nháp', color: 'default' },
  Sent: { label: 'Đã gửi', color: 'info' },
  Approved: { label: 'Đã chốt', color: 'success' },
  Rejected: { label: 'Từ chối', color: 'error' },
};

export const QuotationList = ({ quotations, onRefresh }: Props) => {
  const { t } = useTranslation();
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationDetailDto | null>(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailData, setDetailData] = useState<QuotationDetailDto | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: selectedQuotation ? `BaoGia_BG${selectedQuotation.id}` : 'BaoGia',
  });

  const onPrintClick = async (id: number) => {
    try {
      const data = await quotationService.getById(id);
      setSelectedQuotation(data);
      setOpenPrintDialog(true);
    } catch (err) {
      console.error(err);
      alert(t('quotations:errorLoadingQuotationDetail'));
    }
  };

  const onViewClick = async (id: number) => {
    try {
        // Gọi API lấy full items
        const data = await quotationService.getById(id);
        setDetailData(data);
        setOpenDetailDialog(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('quotations:errorLoadingQuotationDetail'), { variant: 'error' });
    }
  };

  const QuotationRow = ({ q }: { q: QuotationListDto }) => {
    const status = STATUS_MAP[q.status] ?? { label: q.status, color: 'default' };
    return (
      <TableRow hover>
        <TableCell><b>#{q.id}</b></TableCell>
        <TableCell>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</TableCell>
        <TableCell>{q.customerName || t('quotations:retailCustomer')}</TableCell>
        <TableCell>
          <Chip label={status.label} color={status.color} size="small" />
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(q.totalAmount)}
        </TableCell>
        <TableCell align="center">
          <Tooltip title={t('quotations:viewDetail')}>
            <IconButton color="primary" onClick={() => onViewClick(q.id)}><VisibilityIcon /></IconButton>
          </Tooltip>
          <Tooltip title={t('quotations:printQuotation')}>
            <IconButton color="secondary" onClick={() => onPrintClick(q.id)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:quotationCode')}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:createdAt')}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:customer')}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:status')}</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:totalAmount')}</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>{t('quotations:actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">{t('quotations:noQuotations')}</TableCell>
              </TableRow>
            ) : quotations.map(q => <QuotationRow key={q.id} q={q} />)}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: '#f5f5f5', p: 4 }}>
          {selectedQuotation && <QuotationPrintTemplate ref={componentRef} data={selectedQuotation} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrintDialog(false)} color="inherit">{t('quotations:close')}</Button>
          <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />}>{t('quotations:confirmPrint')}</Button>
        </DialogActions>
      </Dialog>
      <QuotationDetailDialog open={openDetailDialog} data={detailData} onClose={() => setOpenDetailDialog(false)} onStatusChange={onRefresh} />
    </>
  );
};

import { useState, useRef, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Chip, IconButton, Tooltip, Dialog, DialogContent, 
  DialogActions, Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import type { QuotationDetailDto, QuotationListDto } from '../types';
import { quotationService } from '../services/quotationService';
import { formatCurrency } from '../../../utils/formatters';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { QuotationPrintTemplate } from './QuotationPrintTemplate';
import { QuotationDetailDialog } from './QuotationDetailDialog';

interface Props {
  quotations: QuotationListDto[];
  onRefresh: () => void;
}

const STATUS_MAP: Record<string, { label: string; color: 'default' | 'info' | 'success' | 'error' }> = {
  Draft: { label: 'Nháp', color: 'default' },
  Sent: { label: 'Chờ duyệt', color: 'info' },
  Approved: { label: 'Đã duyệt', color: 'success' },
  Rejected: { label: 'Từ chối', color: 'error' },
};

export const QuotationList = ({ quotations, onRefresh }: Props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  //State
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationDetailDto | null>(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailData, setDetailData] = useState<QuotationDetailDto | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: selectedQuotation ? `BaoGia_BG${selectedQuotation.id}` : 'BaoGia',
  });

  const onPrintClick = useCallback(async (id: number) => {
    try {
      const data = await quotationService.getById(id);
      setSelectedQuotation(data);
      setOpenPrintDialog(true);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t('quotations:errorLoadingQuotationDetail'), { variant: 'error' });
    }
  }, [t, enqueueSnackbar]);

  const onViewClick = useCallback(async (id: number) => {
    try {
      const data = await quotationService.getById(id);
      setDetailData(data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('quotations:errorLoadingQuotationDetail'), { variant: 'error' });
    }
  }, [t, enqueueSnackbar]);

  const columns = useMemo<ColumnDef<QuotationListDto>[]>(() => [
    { 
        id: 'id', 
        label: t('quotations:quotationCode'), 
        align: 'left',
        render: (row) => <b>#{row.id}</b>
    },
    { 
        id: 'createdAt', 
        label: t('quotations:createdAt'), 
        align: 'left',
        render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN')
    },
    { 
        id: 'customerName', 
        label: t('quotations:customer'), 
        align: 'left',
        render: (row) => row.customerName || <span style={{ fontStyle: 'italic', color: 'gray' }}>{t('quotations:retailCustomer')}</span>
    },
    { 
        id: 'status', 
        label: t('quotations:status'), 
        align: 'left',
        render: (row) => {
            const status = STATUS_MAP[row.status] ?? { label: row.status, color: 'default' };
            return <Chip label={status.label} color={status.color} size="small" />;
        }
    },
    { 
        id: 'totalAmount', 
        label: t('quotations:totalAmount'), 
        align: 'right',
        render: (row) => <b>{formatCurrency(row.totalAmount)}</b>
    },
    { 
        id: 'actions', 
        label: t('quotations:actions'), 
        align: 'center',
        render: (row) => (
            <>
                <Tooltip title={t('quotations:viewDetail')}>
                    <IconButton color="primary" onClick={() => onViewClick(row.id)}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('quotations:printQuotation')}>
                    <IconButton color="secondary" onClick={() => onPrintClick(row.id)}>
                        <PrintIcon />
                    </IconButton>
                </Tooltip>
            </>
        )
    }
  ], [t, onViewClick, onPrintClick]);

  return (
    <>
      <CommonTable 
        data={quotations}
        columns={columns}
        emptyMessage={t('quotations:noQuotations')}
      />

      <Dialog open={openPrintDialog} onClose={() => setOpenPrintDialog(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: '#f5f5f5', p: 4 }}>
          {selectedQuotation && <QuotationPrintTemplate ref={componentRef} data={selectedQuotation} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrintDialog(false)} color="inherit">{t('quotations:close')}</Button>
          <Button onClick={() => handlePrint()} variant="contained" startIcon={<PrintIcon />}>
            {t('quotations:confirmPrint')}
          </Button>
        </DialogActions>
      </Dialog>

      <QuotationDetailDialog 
        open={openDetailDialog} 
        data={detailData} 
        onClose={() => setOpenDetailDialog(false)} 
        onStatusChange={onRefresh} 
      />
    </>
  );
};
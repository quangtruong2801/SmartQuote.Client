import React from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Divider 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { QuotationDetailDto } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { useTranslation } from 'react-i18next';
interface Props {
    data: QuotationDetailDto | null; // Dữ liệu báo giá cần in
}

// Sử dụng React.forwardRef để thư viện in có thể "chụp" được component này
export const QuotationPrintTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const { t } = useTranslation();
    if (!data) return null;

    return (
        <div ref={ref} style={{ padding: '40px', color: '#000', backgroundColor: '#fff' }}>
            {/* HEADER CÔNG TY */}
            <Box sx={{ mb: 4 }}>
                <Grid container alignItems="center">
                    <Grid size={{ xs: 2 }}>
                        {/* Logo giả định (Bạn có thể thay bằng thẻ img src="/logo.png") */}
                        <Box sx={{ 
                            width: 80, height: 80, bgcolor: '#1976d2', 
                            borderRadius: '50%', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', 
                            color: 'white', fontWeight: 'bold' 
                        }}>
                            {t('quotations:logo')}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 10 }}>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2">
                            {t('quotations:companyName')}
                        </Typography>
                        <Typography>{t('quotations:address')}: {t('quotations:addressValue')}</Typography>
                        <Typography>{t('quotations:hotline')}: {t('quotations:hotlineValue')}</Typography>
                        <Typography>{t('quotations:website')}: {t('quotations:websiteValue')}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, borderBottomWidth: 2, borderColor: '#1976d2' }} />
            </Box>

            {/* TIÊU ĐỀ BÁO GIÁ */}
            <Box textAlign="center" sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                    {t('quotations:quotationTable')}
                </Typography>
                <Typography variant="subtitle1" fontStyle="italic">
                    {t('quotations:quotationNumber')}: BG-{data.id} / {t('quotations:quotationDate')}: {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
            </Box>

            {/* THÔNG TIN KHÁCH HÀNG */}
            <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{t('quotations:customerInformation')}</Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography><b>{t('quotations:customerName')}:</b> {data.customerName}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography><b>{t('quotations:customerPhone')}:</b> {data.customerPhone}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>{t('quotations:customerAddress')}:</b> {data.customerAddress}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>{t('quotations:customerEmail')}:</b> {data.customerEmail}</Typography></Grid>
                </Grid>
            </Box>

            {/* BẢNG CHI TIẾT */}
            <TableContainer sx={{ mb: 4, border: '1px solid #000' }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>{t('quotations:productName')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="center">{t('quotations:unit')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="right">{t('quotations:unitPrice')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="center">{t('quotations:quantity')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('quotations:totalPrice')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>{index + 1}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                    <b>{item.productName}</b><br/>
                                    <small>{t('quotations:size')}: {item.width} x {item.height} x {item.depth} (mm)</small>
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>{t('quotations:unit')}</TableCell>
                                <TableCell align="right" sx={{ borderRight: '1px solid #ddd' }}>
                                    {formatCurrency(item.unitPriceSnapshot)}
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>
                                    {item.quantity}
                                </TableCell>
                                <TableCell align="right">
                                    {formatCurrency(item.totalPrice)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* TỔNG TIỀN */}
            <Box textAlign="right" sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold">
                    {t('quotations:total')}: {formatCurrency(data.totalAmount)}
                </Typography>
                <Typography fontStyle="italic">({t('quotations:totalInWords')}: ...{t('quotations:currency')})</Typography>
            </Box>

            {/* CHỮ KÝ */}
            <Grid container sx={{ mt: 5 }}>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">{t('quotations:customerRepresentative')}</Typography>
                    <Typography fontStyle="italic">({t('quotations:customerRepresentativeSignature')})</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">{t('quotations:companyRepresentative')}</Typography>
                    <Typography fontStyle="italic">({t('quotations:companyRepresentativeSignature')})</Typography>
                    <Box height={100}></Box>
                    <Typography fontWeight="bold">{t('quotations:companyRepresentativeName')}</Typography>
                </Grid>
            </Grid>
        </div>
    );
});
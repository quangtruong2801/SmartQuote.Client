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
    data: QuotationDetailDto | null;
}

export const QuotationPrintTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    const { t } = useTranslation();
    
    if (!data) return null;

    // --- TÍNH TOÁN LẠI CÁC CON SỐ ĐỂ HIỂN THỊ ---
    const subTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = subTotal * (data.discountPercent / 100);
    const afterDiscount = subTotal - discountAmount;
    const taxAmount = afterDiscount * (data.taxPercent / 100);

    return (
        <div ref={ref} style={{ padding: '40px', color: '#000', backgroundColor: '#fff', fontSize: '14px' }}>
            
            {/* 1. HEADER CÔNG TY */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 3 }}>
                        <Box sx={{ 
                            width: 100, height: 100, bgcolor: '#1976d2', 
                            borderRadius: '8px', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', 
                            color: 'white', fontWeight: 'bold', fontSize: '24px' 
                        }}>
                            LOGO
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 9 }}>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2" textTransform="uppercase">
                            {t('quotations:companyName')}
                        </Typography>
                        <Typography><b>{t('quotations:address')}:</b> {t('quotations:addressValue')}</Typography>
                        <Typography><b>{t('quotations:hotline')}:</b> {t('quotations:hotlineValue')}</Typography>
                        <Typography><b>{t('quotations:email')}:</b> {t('quotations:emailValue')}</Typography>
                        <Typography><b>{t('quotations:website')}:</b> {t('quotations:websiteValue')}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, borderBottomWidth: 3, borderColor: '#1976d2' }} />
            </Box>

            {/* 2. TIÊU ĐỀ BÁO GIÁ */}
            <Box textAlign="center" sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ textTransform: 'uppercase', mb: 1 }}>
                    {t('quotations:quotationTable')}
                </Typography>
                <Typography variant="subtitle1" fontStyle="italic">
                    {t('quotations:quotationNumber')}: <b>#{data.id}</b> &nbsp;|&nbsp; 
                    {t('quotations:quotationDate')}: {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
            </Box>

            {/* 3. THÔNG TIN KHÁCH HÀNG */}
            <Box sx={{ mb: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', color: '#555' }}>
                    {t('quotations:customerInformation')}
                </Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography><b>{t('quotations:customerName')}:</b> {data.customerName}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography><b>{t('quotations:customerPhone')}:</b> {data.customerPhone}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>{t('quotations:customerAddress')}:</b> {data.customerAddress}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>{t('quotations:customerEmail')}:</b> {data.customerEmail}</Typography></Grid>
                </Grid>
            </Box>

            {/* 4. BẢNG CHI TIẾT SẢN PHẨM */}
            <TableContainer sx={{ mb: 2 }}>
                <Table size="small" sx={{ border: '1px solid #000' }}>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="center" width="5%">STT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }}>{t('quotations:productName')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="center">{t('quotations:size')} (mm)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="center">{t('quotations:unit')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="right">{t('quotations:unitPrice')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="center">{t('quotations:quantity')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', border: '1px solid #000' }} align="right">{t('quotations:totalPrice')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" sx={{ border: '1px solid #000' }}>{index + 1}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>
                                    <b>{item.productName}</b>
                                </TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000' }}>
                                    {item.width} x {item.height} x {item.depth}
                                </TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000' }}>Cái</TableCell>
                                <TableCell align="right" sx={{ border: '1px solid #000' }}>
                                    {formatCurrency(item.unitPriceSnapshot)}
                                </TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #000' }}>
                                    {item.quantity}
                                </TableCell>
                                <TableCell align="right" sx={{ border: '1px solid #000' }}>
                                    {formatCurrency(item.totalPrice)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 5. TỔNG KẾT TÀI CHÍNH (NEW) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
                <Box sx={{ width: '50%' }}>
                    {/* Tạm tính */}
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>{t('quotations:subTotal')}:</Typography>
                        <Typography fontWeight="bold">{formatCurrency(subTotal)}</Typography>
                    </Box>

                    {/* Chiết khấu (Chỉ hiện nếu > 0) */}
                    {data.discountPercent > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'red' }}>
                            <Typography>{t('quotations:discount')} ({data.discountPercent}%):</Typography>
                            <Typography>- {formatCurrency(discountAmount)}</Typography>
                        </Box>
                    )}

                    {/* VAT (Chỉ hiện nếu > 0) */}
                    {data.taxPercent > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>{t('quotations:vat')} ({data.taxPercent}%):</Typography>
                            <Typography>{formatCurrency(taxAmount)}</Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 1, borderColor: '#000' }} />

                    {/* TỔNG CỘNG */}
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">{t('quotations:totalAmount')}:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="#1976d2">
                            {formatCurrency(data.totalAmount)}
                        </Typography>
                    </Box>
                    
                    <Box textAlign="right" mt={1}>
                        <Typography fontStyle="italic" variant="caption">
                            ({t('quotations:totalInWords')}: ...........................................................)
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* 6. CHỮ KÝ */}
            <Grid container sx={{ mt: 5 }}>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">{t('quotations:customerRepresentative')}</Typography>
                    <Typography fontStyle="italic" variant="caption">({t('quotations:signAndFullName')})</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">{t('quotations:companyRepresentative')}</Typography>
                    <Typography fontStyle="italic" variant="caption">({t('quotations:signAndStamp')})</Typography>
                    <Box height={100}></Box>
                    <Typography fontWeight="bold">{t('quotations:directorName')}</Typography>
                </Grid>
            </Grid>
        </div>
    );
});
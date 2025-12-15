import React from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Divider 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { QuotationDetailDto } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface Props {
    data: QuotationDetailDto | null; // Dữ liệu báo giá cần in
}

// Sử dụng React.forwardRef để thư viện in có thể "chụp" được component này
export const QuotationPrintTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
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
                            LOGO
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 10 }}>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2">
                            CÔNG TY NỘI THẤT SMART QUOTE
                        </Typography>
                        <Typography>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</Typography>
                        <Typography>Hotline: 0909.123.456 - Email: sale@smartquote.vn</Typography>
                        <Typography>Website: www.smartquote.vn</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2, borderBottomWidth: 2, borderColor: '#1976d2' }} />
            </Box>

            {/* TIÊU ĐỀ BÁO GIÁ */}
            <Box textAlign="center" sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                    BẢNG BÁO GIÁ
                </Typography>
                <Typography variant="subtitle1" fontStyle="italic">
                    Số: BG-{data.id} / Ngày: {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
            </Box>

            {/* THÔNG TIN KHÁCH HÀNG */}
            <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>THÔNG TIN KHÁCH HÀNG</Typography>
                <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}><Typography><b>Người nhận:</b> {data.customerName}</Typography></Grid>
                    <Grid size={{ xs: 6 }}><Typography><b>Điện thoại:</b> {data.customerPhone}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>Địa chỉ:</b> {data.customerAddress}</Typography></Grid>
                    <Grid size={{ xs: 12 }}><Typography><b>Email:</b> {data.customerEmail}</Typography></Grid>
                </Grid>
            </Box>

            {/* BẢNG CHI TIẾT */}
            <TableContainer sx={{ mb: 4, border: '1px solid #000' }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Tên sản phẩm / Quy cách</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="center">ĐVT</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="right">Đơn giá</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }} align="center">SL</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>{index + 1}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                    <b>{item.productName}</b><br/>
                                    <small>Kích thước: {item.width} x {item.height} x {item.depth} (mm)</small>
                                </TableCell>
                                <TableCell align="center" sx={{ borderRight: '1px solid #ddd' }}>Bộ</TableCell>
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
                    TỔNG CỘNG: {formatCurrency(data.totalAmount)}
                </Typography>
                <Typography fontStyle="italic">(Bằng chữ: ...Việt Nam Đồng)</Typography>
            </Box>

            {/* CHỮ KÝ */}
            <Grid container sx={{ mt: 5 }}>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">ĐẠI DIỆN KHÁCH HÀNG</Typography>
                    <Typography fontStyle="italic">(Ký, ghi rõ họ tên)</Typography>
                </Grid>
                <Grid size={{ xs: 6 }} textAlign="center">
                    <Typography fontWeight="bold">ĐẠI DIỆN CÔNG TY</Typography>
                    <Typography fontStyle="italic">(Ký, đóng dấu)</Typography>
                    <Box height={100}></Box>
                    <Typography fontWeight="bold">Nguyễn Văn Giám Đốc</Typography>
                </Grid>
            </Grid>
        </div>
    );
});
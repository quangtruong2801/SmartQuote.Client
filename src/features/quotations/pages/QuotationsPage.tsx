import { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from '@tanstack/react-router';
import { QuotationList } from '../components/QuotationList';
import { quotationService } from '../services/quotationService';
import type { QuotationListDto } from '../types';

export const QuotationsPage = () => {
    const [quotations, setQuotations] = useState<QuotationListDto[]>([]);

    useEffect(() => {
        quotationService.getAll().then(setQuotations);
    }, []);

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    QUẢN LÝ BÁO GIÁ
                </Typography>
                
                {/* Nút chuyển sang trang Tạo mới */}
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    component={Link} 
                    to="/quotations/create"
                >
                    Lập Báo Giá Mới
                </Button>
            </Stack>

            {/* Hiển thị bảng danh sách */}
            <QuotationList quotations={quotations} onRefresh={() => quotationService.getAll().then(setQuotations)} />
        </Box>
    );
};
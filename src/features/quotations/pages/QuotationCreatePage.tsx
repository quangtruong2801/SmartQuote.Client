import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';

import { QuotationBuilder } from '../components/QuotationBuilder';
import { ProductSelectorDialog } from '../components/ProductSelectorDialog';

import { quotationService } from '../services/quotationService';
import { productService } from '../../products/services/productService';
import type { QuotationCreateDto } from '../types';
import type { ProductTemplate } from '../../products/types';
import { useTranslation } from 'react-i18next';

export const QuotationCreatePage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const [openSelector, setOpenSelector] = useState(false);
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null);

    // 1. Load danh sách sản phẩm mẫu ngay khi vào trang
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await productService.getAll();
                setProducts(data);
            } catch (error) {
                console.error(t('quotations:errorLoadingProducts'), error);
                enqueueSnackbar(t('quotations:errorLoadingProducts'), { variant: 'warning' });
            }
        };
        loadProducts();
    }, [enqueueSnackbar, t]);

    // 2. Xử lý khi Submit báo giá
    const handleSubmit = async (data: QuotationCreateDto) => {
        try {
            await quotationService.create(data);
            enqueueSnackbar(t('quotations:createQuotationSuccess'), { variant: 'success' });
            navigate({ to: '/quotations' }); 
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('quotations:errorCreatingQuotation'), { variant: 'error' });
        }
    };

    // 3. Xử lý khi chọn sản phẩm từ Dialog hình ảnh
    const handleProductSelect = (product: ProductTemplate) => {
        setSelectedProduct(product);
        setOpenSelector(false);
    };

    return (
        <Box>
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
                {t('quotations:createQuotation')}
            </Typography>

            <QuotationBuilder 
                onSubmit={handleSubmit} 
                onOpenSelector={() => setOpenSelector(true)}
                selectedProductFromDialog={selectedProduct}
            />

            {/* DIALOG CHỌN SẢN PHẨM BẰNG HÌNH ẢNH */}
            <ProductSelectorDialog 
                open={openSelector}
                products={products}
                onClose={() => setOpenSelector(false)}
                onSelect={handleProductSelect}
            />
        </Box>
    );
};
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';

// Import các thành phần
import { QuotationBuilder } from '../components/QuotationBuilder';
import { ProductSelectorDialog } from '../components/ProductSelectorDialog';

// Import Services & Types
import { quotationService } from '../services/quotationService';
import { productService } from '../../products/services/productService';
import type { QuotationCreateDto } from '../types';
import type { ProductTemplate } from '../../products/types';

export const QuotationCreatePage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // State quản lý Dialog chọn ảnh
    const [openSelector, setOpenSelector] = useState(false);
    
    // State chứa danh sách sản phẩm mẫu (để hiện trong Dialog)
    const [products, setProducts] = useState<ProductTemplate[]>([]);

    // State chứa sản phẩm vừa chọn từ Dialog (để truyền xuống Builder điền vào form)
    const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null);

    // 1. Load danh sách sản phẩm mẫu ngay khi vào trang
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await productService.getAll();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
                enqueueSnackbar('Không tải được danh sách sản phẩm mẫu', { variant: 'warning' });
            }
        };
        loadProducts();
    }, [enqueueSnackbar]);

    // 2. Xử lý khi Submit báo giá
    const handleSubmit = async (data: QuotationCreateDto) => {
        try {
            await quotationService.create(data);
            enqueueSnackbar('Tạo báo giá thành công!', { variant: 'success' });
            // Quay về trang danh sách
            navigate({ to: '/quotations' }); 
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra khi tạo báo giá!', { variant: 'error' });
        }
    };

    // 3. Xử lý khi chọn sản phẩm từ Dialog hình ảnh
    const handleProductSelect = (product: ProductTemplate) => {
        setSelectedProduct(product); // Lưu vào state để truyền xuống QuotationBuilder
        setOpenSelector(false);      // Đóng Dialog
    };

    return (
        <Box>
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3, textAlign: 'center' }}>
                LẬP BÁO GIÁ MỚI
            </Typography>

            {/* QUOTATION BUILDER (Form chính)
               - onOpenSelector: Hàm để Builder gọi khi bấm nút "Chọn Ảnh"
               - selectedProductFromDialog: Dữ liệu ảnh vừa chọn để Builder tự điền vào form
            */}
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
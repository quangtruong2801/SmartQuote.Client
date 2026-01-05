import { useEffect, useState } from 'react';
import { 
    Box, 
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import type { ProductTemplate, ProductCreateDto } from '../types';
import { productService } from '../services/productService';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { ProductUpdateDialog } from '../components/ProductUpdateDialog';
import { useSnackbar } from 'notistack';
import type { Material } from '../../materials/types';
import { materialService } from '../../materials/services/materialService';

export const ProductsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // State cho Dialog Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            productService.getAll(),
            materialService.getAll()
        ]).then(([productsData, materialsData]) => {
            setProducts(productsData);
            setMaterials(materialsData);
        });
    }, []);

    const handleAdd = async (newItem: ProductCreateDto) => {
        try {
            await productService.create(newItem);
            // Reload lại list
            productService.getAll().then(setProducts);
            enqueueSnackbar('Sản phẩm đã được thêm thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Lỗi thêm mới!", { variant: 'error' });
        }
    };

    // --- XỬ LÝ SỬA ---
    const handleEditClick = (product: ProductTemplate) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (updatedData: ProductTemplate) => {
        try {
            await productService.update(updatedData.id, updatedData);
            
            const materialName = materials.find(m => m.id === updatedData.defaultMaterialId)?.name;
            const uiData = { 
                ...updatedData, 
                defaultMaterial: { ...updatedData.defaultMaterial, name: materialName || '' } 
            } as ProductTemplate;

            setProducts(products.map(p => p.id === updatedData.id ? uiData : p));
            
            enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi cập nhật!', { variant: 'error' });
        }
    };

    // --- XỬ LÝ XÓA ---
    
    // 1. Mở popup khi bấm nút xóa ở bảng
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    // 2. Đóng popup
    const handleCloseDelete = () => {
        setDeleteId(null);
    };

    // 3. Thực hiện xóa khi bấm Xác nhận
    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try {
            await productService.delete(deleteId);
            setProducts(products.filter(p => p.id !== deleteId));
            enqueueSnackbar('Sản phẩm đã được xóa thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Lỗi xóa!", { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    THƯ VIỆN SẢN PHẨM MẪU
                </Typography>
            </Box>
            
            <ProductForm materials={materials} onAdd={handleAdd} />
            
            <ProductTable 
                products={products} 
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
            />

            {/* Dialog Sửa */}
            <ProductUpdateDialog 
                open={isDialogOpen}
                initialData={editingProduct}
                materials={materials}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* --- DIALOG XÁC NHẬN XÓA --- */}
            <Dialog
                open={deleteId !== null}
                onClose={handleCloseDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Xác nhận xóa sản phẩm mẫu?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bạn có chắc chắn muốn xóa sản phẩm này khỏi thư viện mẫu không? 
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
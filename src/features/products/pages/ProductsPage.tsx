import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { ProductTemplate, ProductCreateDto } from '../types';
import { productService } from '../services/productService';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import { ProductUpdateDialog } from '../components/ProductUpdateDialog';
import { useSnackbar } from 'notistack';
// Import Material để lấy danh sách cho dropdown
import type { Material } from '../../materials/types';
import { materialService } from '../../materials/services/materialService';

export const ProductsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // State cho Dialog Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(null);

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
            // API trả về created chưa chắc có defaultMaterial object đầy đủ ngay
            // Nên ta reload lại list cho chắc ăn
            productService.getAll().then(setProducts);
            enqueueSnackbar('Sản phẩm đã được thêm thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Lỗi thêm mới!", { variant: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if(!window.confirm("Xóa mẫu này?")) return;
        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
            enqueueSnackbar('Sản phẩm đã được xóa thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Lỗi xóa!", { variant: 'error' });
        }
    };

    const handleEditClick = (product: ProductTemplate) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (updatedData: ProductTemplate) => {
        try {
            await productService.update(updatedData.id, updatedData);
            
            // Cập nhật UI ngay lập tức
            // Cần cập nhật lại tên vật tư trong object (vì API update thường không trả về object kèm Relation)
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

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    THƯ VIỆN SẢN PHẨM MẪU
                </Typography>
            </Box>
            
            {/* Truyền list vật tư vào form */}
            <ProductForm materials={materials} onAdd={handleAdd} />
            
            <ProductTable 
                products={products} 
                onDelete={handleDelete}
                onEdit={handleEditClick} // Truyền hàm edit
            />

            {/* Dialog Sửa */}
            <ProductUpdateDialog 
                open={isDialogOpen}
                initialData={editingProduct}
                materials={materials} // Truyền list vật tư để chọn
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />
        </Box>
    );
};
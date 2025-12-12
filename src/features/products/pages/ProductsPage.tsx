import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { ProductTemplate, ProductCreateDto } from '../types';
import { productService } from '../services/productService';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
// Import Material để lấy danh sách cho dropdown
import type { Material } from '../../materials/types';
import { materialService } from '../../materials/services/materialService';

export const ProductsPage = () => {
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Chạy song song 2 API cho nhanh
            const [productsData, materialsData] = await Promise.all([
                productService.getAll(),
                materialService.getAll()
            ]);
            setProducts(productsData);
            setMaterials(materialsData);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
        }
    };

    const handleAdd = async (newItem: ProductCreateDto) => {
        try {
            const created = await productService.create(newItem);
            // API trả về created chưa chắc có defaultMaterial object đầy đủ ngay
            // Nên ta reload lại list cho chắc ăn (hoặc ghép thủ công client-side)
            loadData(); 
        } catch (error) {
            console.error(error);
            alert("Lỗi thêm mới!");
        }
    };

    const handleDelete = async (id: number) => {
        if(!window.confirm("Xóa mẫu này?")) return;
        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            alert("Lỗi xóa!");
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
            
            <ProductTable products={products} onDelete={handleDelete} />
        </Box>
    );
};
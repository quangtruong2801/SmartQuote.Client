import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { materialService } from '../services/materialService';
import type { Material, MaterialCreateDto } from '../types';
import { MaterialForm } from '../components/MaterialForm';
import { MaterialTable } from '../components/MaterialTable';
import { MaterialUpdateDialog } from '../components/MaterialUpdateDialog';

export const MaterialsPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    
    // State cho việc sửa
    const [editItem, setEditItem] = useState<Material | null>(null); // Lưu item đang được chọn sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await materialService.getAll();
                setMaterials(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMaterials();
    }, []);

    const handleAdd = async (newItem: MaterialCreateDto) => {
        try {
            const createdItem = await materialService.create(newItem);
            setMaterials([...materials, createdItem]);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi thêm mới');
        }
    };

    // --- XỬ LÝ XÓA ---
    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa vật tư này không?')) return;

        try {
            await materialService.delete(id);
            // Xóa xong thì lọc bỏ item đó khỏi state (UI cập nhật ngay ko cần reload)
            setMaterials(materials.filter(m => m.id !== id));
        } catch (error) {
            console.error(error);
            alert('Lỗi khi xóa!');
        }
    };

    // --- XỬ LÝ SỬA ---
    const openEditDialog = (item: Material) => {
        setEditItem(item);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (updatedData: Material) => {
        try {
            await materialService.update(updatedData.id, updatedData);
            
            // Cập nhật lại list materials với dữ liệu mới
            const newMaterials = materials.map(m => 
                m.id === updatedData.id ? updatedData : m
            );
            setMaterials(newMaterials);
        } catch (error) {
            alert('Lỗi cập nhật!');
            console.error(error);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    QUẢN LÝ VẬT TƯ
                </Typography>
            </Box>

            <MaterialForm onAdd={handleAdd} />
            
            <MaterialTable 
                materials={materials} 
                onEdit={openEditDialog} 
                onDelete={handleDelete} 
            />

            {/* Popup sửa */}
            <MaterialUpdateDialog 
                open={isDialogOpen}
                initialData={editItem}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />
        </Box>
    );
};
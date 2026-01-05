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
import { materialService } from '../services/materialService';
import type { Material, MaterialCreateDto } from '../types';
import { useSnackbar } from 'notistack';
import { MaterialForm } from '../components/MaterialForm';
import { MaterialTable } from '../components/MaterialTable';
import { MaterialUpdateDialog } from '../components/MaterialUpdateDialog';

export const MaterialsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [materials, setMaterials] = useState<Material[]>([]);
    
    const [editItem, setEditItem] = useState<Material | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [deleteId, setDeleteId] = useState<number | null>(null);

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
            enqueueSnackbar('Thêm mới thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi khi thêm mới', { variant: 'error' });
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
            const newMaterials = materials.map(m => 
                m.id === updatedData.id ? updatedData : m
            );
            setMaterials(newMaterials);
            enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Lỗi cập nhật!', { variant: 'error' });
            console.error(error);
        }
    };

    // --- XỬ LÝ XÓA ---
    const handleClickDelete = (id: number) => {
        setDeleteId(id);
    };

    const handleCloseConfirm = () => {
        setDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try {
            await materialService.delete(deleteId);
            setMaterials(materials.filter(m => m.id !== deleteId));
            enqueueSnackbar('Đã xóa vật tư thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi khi xóa!', { variant: 'error' });
        } finally {
            setDeleteId(null); 
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
                onDelete={handleClickDelete}  // Truyền hàm mở popup vào đây
            />

            {/* Popup sửa */}
            <MaterialUpdateDialog 
                open={isDialogOpen}
                initialData={editItem}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* --- POPUP XÁC NHẬN XÓA --- */}
            <Dialog
                open={deleteId !== null}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xác nhận xóa vật tư?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa vật tư này không? 
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
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
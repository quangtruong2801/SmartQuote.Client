import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { materialService } from '../services/materialService';
import type { Material, MaterialCreateDto } from '../types';

// Utils
import { formatCurrency } from '../../../utils/formatters';

// Components
import { MaterialAddDialog } from '../components/MaterialAddDialog';
import { MaterialUpdateDialog } from '../components/MaterialUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable'; 
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const MaterialsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [materials, setMaterials] = useState<Material[]>([]);
    
    // State Thêm mới
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    // State Sửa
    const [editItem, setEditItem] = useState<Material | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // State Xóa
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- DATA LOADING ---
    const fetchMaterials = async () => {
        try {
            const data = await materialService.getAll();
            setMaterials(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    // --- HANDLERS ---

    // 1. Thêm mới
    const handleAdd = async (newItem: MaterialCreateDto) => {
        try {
            const createdItem = await materialService.create(newItem);
            setMaterials([...materials, createdItem]);
            enqueueSnackbar(t('materials:addMaterialSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('materials:addMaterialError'), { variant: 'error' });
            throw error;
        }
    };

    // 2. Sửa
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
            enqueueSnackbar(t('materials:updateMaterialSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('materials:updateMaterialError'), { variant: 'error' });
            console.error(error);
        }
    };

    // 3. Xóa
    const handleClickDelete = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try {
            await materialService.delete(deleteId);
            setMaterials(materials.filter(m => m.id !== deleteId));
            enqueueSnackbar(t('materials:deleteMaterialSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('materials:deleteMaterialError'), { variant: 'error' });
        } finally {
            setDeleteId(null); 
        }
    };

    // --- COLUMNS ---
    const columns = useMemo<ColumnDef<Material>[]>(() => [
        { id: 'id', label: 'ID', align: 'center' },
        { 
            id: 'name', 
            label: t('materials:materialName'), 
            align: 'center',
            render: (row) => <b>{row.name}</b>
        },
        { id: 'unit', label: t('materials:unit'), align: 'center' },
        { 
            id: 'unitPrice', 
            label: t('materials:unitPrice'), 
            align: 'center',
            render: (row) => formatCurrency(row.unitPrice)
        },
        { 
            id: 'actions', 
            label: '', 
            align: 'center',
            render: (row) => (
                <TableActionMenu 
                    onEdit={() => openEditDialog(row)}
                    onDelete={() => handleClickDelete(row.id)}
                />
            )
        }
    ], [t]);

    return (
        <Box>
            {/* HEADER & BUTTON ADD */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    {t('materials:materialManagement')}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenCreateDialog(true)}
                >
                    {t('materials:addMaterial')}
                </Button>
            </Box>

            {/* TABLE */}
            <CommonTable 
                data={materials}
                columns={columns}
                emptyMessage={t('materials:noData')}
            />

            {/* --- DIALOG THÊM MỚI --- */}
            <MaterialAddDialog 
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onAdd={handleAdd}
            />

            {/* Dialog Sửa */}
            <MaterialUpdateDialog 
                open={isDialogOpen}
                initialData={editItem}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* Dialog Xóa */}
            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>{t('materials:confirmDeleteMaterial')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('materials:confirmDeleteMaterialDescription')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">
                        {t('materials:cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        {t('materials:delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
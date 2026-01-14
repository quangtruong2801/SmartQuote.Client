import { useEffect, useState, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Tooltip,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { materialService } from '../services/materialService';
import type { Material, MaterialCreateDto } from '../types';

// Utils
import { formatCurrency } from '../../../utils/formatters';

// Components
import { MaterialForm } from '../components/MaterialForm';
import { MaterialUpdateDialog } from '../components/MaterialUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable'; // Import CommonTable

export const MaterialsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [materials, setMaterials] = useState<Material[]>([]);
    
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

    // --- ĐỊNH NGHĨA CỘT CHO COMMON TABLE ---
    const columns = useMemo<ColumnDef<Material>[]>(() => [
        { 
            id: 'id', 
            label: 'ID', 
            align: 'left' 
        },
        { 
            id: 'name', 
            label: t('materials:materialName'), 
            align: 'left',
            render: (row) => <b>{row.name}</b>
        },
        { 
            id: 'unit', 
            label: t('materials:unit'), 
            align: 'left' 
        },
        { 
            id: 'unitPrice', 
            label: t('materials:unitPrice'), 
            align: 'right',
            render: (row) => formatCurrency(row.unitPrice)
        },
        { 
            id: 'actions', 
            label: t('materials:actions'), 
            align: 'center',
            render: (row) => (
                <>
                    <Tooltip title={t('materials:editInformation')}>
                        <IconButton color="primary" onClick={() => openEditDialog(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('materials:deleteMaterial')}>
                        <IconButton color="error" onClick={() => handleClickDelete(row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        }
    ], [t]); // Dependency t: để khi đổi ngôn ngữ thì tên cột đổi theo

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    {t('materials:materialManagement')}
                </Typography>
            </Box>

            {/* Form thêm mới */}
            <MaterialForm onAdd={handleAdd} />
            
            {/* BẢNG DÙNG CHUNG (COMMON TABLE) */}
            <CommonTable 
                data={materials}
                columns={columns}
                emptyMessage={t('materials:noData')}
            />

            {/* Popup sửa */}
            <MaterialUpdateDialog 
                open={isDialogOpen}
                initialData={editItem}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* Popup Xác nhận xóa */}
            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
            >
                <DialogTitle>{t('materials:confirmDeleteMaterial')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('materials:confirmDeleteMaterialDescription')}
                    </DialogContentText>
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
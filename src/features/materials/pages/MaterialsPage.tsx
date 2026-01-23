import { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { materialService } from '../services/materialService';
import type { Material, MaterialCreateDto } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { useTable } from '../../../hooks/useTable';

import { MaterialAddDialog } from '../components/MaterialAddDialog';
import { MaterialUpdateDialog } from '../components/MaterialUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const MaterialsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    // --- STATE DỮ LIỆU ---
    const [materials, setMaterials] = useState<Material[]>([]);

    // --- STATE DIALOGS ---
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editItem, setEditItem] = useState<Material | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const {
        commonTableProps,
        selectedIds,
        setSelectedIds
    } = useTable({
        data: materials,
        defaultOrderBy: 'id',
        defaultOrder: 'asc',
        defaultRowsPerPage: 5
    });

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

    const handleAdd = async (newItem: MaterialCreateDto) => {
        try {
            const createdItem = await materialService.create(newItem);
            setMaterials(prev => [...prev, createdItem]);
            enqueueSnackbar(t('materials:addMaterialSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('materials:addMaterialError'), { variant: 'error' });
            throw error;
        }
    };

    const openEditDialog = (item: Material) => {
        setEditItem(item);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (updatedData: Material) => {
        try {
            await materialService.update(updatedData.id, updatedData);
            setMaterials(prev => prev.map(m =>
                m.id === updatedData.id ? updatedData : m
            ));
            enqueueSnackbar(t('materials:updateMaterialSuccess'), { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(t('materials:updateMaterialError'), { variant: 'error' });
            console.error(error);
        }
    };

    const handleClickDelete = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;

        try {
            await materialService.delete(deleteId);
            setMaterials(prev => prev.filter(m => m.id !== deleteId));
            enqueueSnackbar(t('materials:deleteMaterialSuccess'), { variant: 'success' });

            if (selectedIds.includes(deleteId)) {
                setSelectedIds(prev => prev.filter(id => id !== deleteId));
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('materials:deleteMaterialError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const columns = useMemo<ColumnDef<Material>[]>(() => [
        {
            id: 'id',
            label: 'ID',
            align: 'left',
            sortable: true
        },
        {
            id: 'name',
            label: t('materials:materialName'),
            align: 'left',
            sortable: true,
            render: (row) => <b>{row.name}</b>
        },
        {
            id: 'unit',
            label: t('materials:unit'),
            align: 'left',
            sortable: true
        },
        {
            id: 'unitPrice',
            label: t('materials:unitPrice'),
            align: 'right',
            sortable: true,
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('materials:materialManagement')}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        {t('materials:addMaterial')}
                    </Button>
                </Box>
            </Box>

            <CommonTable
                columns={columns}
                selectionMode="multiple"
                emptyMessage={t('materials:noData')}

                {...commonTableProps}
            />

            {/* --- DIALOGS --- */}
            <MaterialAddDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onAdd={handleAdd}
            />

            <MaterialUpdateDialog
                open={isDialogOpen}
                initialData={editItem}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>{t('materials:confirmDeleteMaterial')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('materials:confirmDeleteMaterialDescription')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">
                        {t('common:cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        {t('common:delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
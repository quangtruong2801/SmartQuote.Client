import { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Avatar,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { productService } from '../services/productService';
import { materialService } from '../../materials/services/materialService';
import type { ProductTemplate, ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';

import { useTable } from '../../../hooks/useTable';
import { ProductAddDialog } from '../components/ProductAddDialog';
import { ProductUpdateDialog } from '../components/ProductUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const ProductsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    // --- STATE DỮ LIỆU ---
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // --- STATE DIALOGS ---
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const {
        commonTableProps,
        selectedIds,
        setSelectedIds
    } = useTable({
        data: products,
        defaultOrderBy: 'id',
        defaultOrder: 'asc',
        defaultRowsPerPage: 5
    });

    // --- DATA LOADING ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, materialsData] = await Promise.all([
                    productService.getAll(),
                    materialService.getAll()
                ]);
                setProducts(productsData);
                setMaterials(materialsData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleAdd = async (newItem: ProductCreateDto) => {
        try {
            await productService.create(newItem);

            const updatedProducts = await productService.getAll();
            setProducts(updatedProducts);

            enqueueSnackbar(t('products:productAddedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productAddedError'), { variant: 'error' });
            throw error;
        }
    };

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

            setProducts(prev => prev.map(p => p.id === updatedData.id ? uiData : p));
            enqueueSnackbar(t('products:productUpdatedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productUpdatedError'), { variant: 'error' });
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await productService.delete(deleteId);
            setProducts(prev => prev.filter(p => p.id !== deleteId));
            enqueueSnackbar(t('products:productDeletedSuccess'), { variant: 'success' });

            if (selectedIds.includes(deleteId)) {
                setSelectedIds(prev => prev.filter(id => id !== deleteId));
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productDeletedError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const columns = useMemo<ColumnDef<ProductTemplate>[]>(() => [
        {
            id: 'id',
            label: 'ID',
            align: 'left',
            sortable: true
        },
        {
            id: 'imageUrl',
            label: t('products:image'),
            align: 'center',
            render: (row) => (
                <Box display="flex" justifyContent="center">
                    <Avatar
                        variant="rounded"
                        src={row.imageUrl}
                        alt={row.name}
                        sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}
                    >
                        {row.name ? row.name.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                </Box>
            )
        },
        {
            id: 'name',
            label: t('products:productName'),
            align: 'left',
            sortable: true,
            render: (row) => (
                <Box>
                    <b>{row.name}</b>
                    <Typography variant="caption" display="block" color="text.secondary">
                        {row.pricingFormula}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'size',
            label: t('products:standardSize'),
            align: 'left',
            render: (row) => `${row.defaultWidth} x ${row.defaultHeight} x ${row.defaultDepth}`
        },
        {
            id: 'material',
            label: t('products:defaultMaterial'),
            align: 'left',
            render: (row) => row.defaultMaterial?.name || "N/A"
        },
        {
            id: 'actions',
            label: '',
            align: 'center',
            render: (row) => (
                <TableActionMenu
                    onEdit={() => handleEditClick(row)}
                    onDelete={() => handleDeleteClick(row.id)}
                />
            )
        }
    ], [t]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('products:productManagement')}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        {t('products:addProduct')}
                    </Button>
                </Box>
            </Box>

            <CommonTable
                columns={columns}
                selectionMode="multiple"
                emptyMessage={t('products:noProducts')}

                {...commonTableProps}
            />

            {/* --- DIALOGS --- */}
            <ProductAddDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                materials={materials}
                onAdd={handleAdd}
            />

            <ProductUpdateDialog
                open={isDialogOpen}
                initialData={editingProduct}
                materials={materials}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>{t('products:confirmDeleteProduct')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('products:confirmDeleteProductDescription')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">{t('products:cancel')}</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>{t('products:delete')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
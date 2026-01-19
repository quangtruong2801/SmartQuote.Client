import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { productService } from '../services/productService';
import { materialService } from '../../materials/services/materialService';
import type { ProductTemplate, ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';

// Components
import { ProductAddDialog } from '../components/ProductAddDialog';
import { ProductUpdateDialog } from '../components/ProductUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const ProductsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // State Thêm mới
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    // State Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(null);

    // State Xóa
    const [deleteId, setDeleteId] = useState<number | null>(null);

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

    // --- HANDLERS ---

    // 1. Thêm mới
    const handleAdd = async (newItem: ProductCreateDto) => {
        try {
            await productService.create(newItem);
            
            // Reload lại list
            const updatedProducts = await productService.getAll();
            setProducts(updatedProducts);
            
            enqueueSnackbar(t('products:productAddedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productAddedError'), { variant: 'error' });
            throw error;
        }
    };

    // 2. Sửa
    const handleEditClick = (product: ProductTemplate) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleUpdate = async (updatedData: ProductTemplate) => {
        try {
            await productService.update(updatedData.id, updatedData);
            
            // Cập nhật tên vật tư local
            const materialName = materials.find(m => m.id === updatedData.defaultMaterialId)?.name;
            const uiData = { 
                ...updatedData, 
                defaultMaterial: { ...updatedData.defaultMaterial, name: materialName || '' } 
            } as ProductTemplate;

            setProducts(products.map(p => p.id === updatedData.id ? uiData : p));
            enqueueSnackbar(t('products:productUpdatedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productUpdatedError'), { variant: 'error' });
        }
    };

    // 3. Xóa
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await productService.delete(deleteId);
            setProducts(products.filter(p => p.id !== deleteId));
            enqueueSnackbar(t('products:productDeletedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productDeletedError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    // --- COLUMNS ---
    const columns = useMemo<ColumnDef<ProductTemplate>[]>(() => [
        { id: 'id', label: 'ID', align: 'center' },
        { 
            id: 'imageUrl', 
            label: t('products:image'), 
            align: 'center',
            render: (row) => (
                <Box display="flex" justifyContent="center" gap={1}>
                <Avatar 
                    variant="rounded"
                    src={row.imageUrl} 
                    alt={row.name}
                    sx={{ width: 60, height: 60}}
                >
                    {row.name ? row.name.charAt(0).toUpperCase() : '?'}
                </Avatar>
                </Box>
            )
        },
        { 
            id: 'name', 
            label: t('products:productName'), 
            align: 'center',
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
            align: 'center',
            render: (row) => `${row.defaultWidth} x ${row.defaultHeight} x ${row.defaultDepth}`
        },
        { 
            id: 'material', 
            label: t('products:defaultMaterial'), 
            align: 'center',
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
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('products:productManagement')}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenCreateDialog(true)}
                >
                    {t('products:addProduct')}
                </Button>
            </Box>
            
            {/* Table */}
            <CommonTable 
                data={products} 
                columns={columns}
                emptyMessage={t('products:noData')}
            />

            {/* --- DIALOG THÊM MỚI --- */}
            <ProductAddDialog 
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                materials={materials}
                onAdd={handleAdd}
            />

            {/* Dialog Sửa */}
            <ProductUpdateDialog 
                open={isDialogOpen}
                initialData={editingProduct}
                materials={materials}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* Dialog Xóa */}
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
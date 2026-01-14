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
    IconButton,
    Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { productService } from '../services/productService';
import { materialService } from '../../materials/services/materialService';
import type { ProductTemplate, ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';

// Components
import { ProductForm } from '../components/ProductForm';
import { ProductUpdateDialog } from '../components/ProductUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable'; // Import CommonTable

export const ProductsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [products, setProducts] = useState<ProductTemplate[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    // State Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(null);

    // State Xóa
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- DATA LOADING ---
    useEffect(() => {
        Promise.all([
            productService.getAll(),
            materialService.getAll()
        ]).then(([productsData, materialsData]) => {
            setProducts(productsData);
            setMaterials(materialsData);
        }).catch(err => console.error(err));
    }, []);

    // --- HANDLERS ---

    // 1. Thêm mới
    const handleAdd = async (newItem: ProductCreateDto) => {
        try {
            await productService.create(newItem);
            // Reload lại list để có dữ liệu mới nhất (bao gồm cả ảnh vừa upload)
            const updatedProducts = await productService.getAll();
            setProducts(updatedProducts);
            enqueueSnackbar(t('products:productAddedSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('products:productAddedError'), { variant: 'error' });
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
            
            // Cập nhật lại tên vật tư trong state để hiển thị ngay mà không cần reload
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

    // --- ĐỊNH NGHĨA CỘT CHO COMMON TABLE ---
    const columns = useMemo<ColumnDef<ProductTemplate>[]>(() => [
        { 
            id: 'id', 
            label: 'ID', 
            align: 'left' 
        },
        { 
            id: 'imageUrl', 
            label: t('products:image'), 
            align: 'left',
            render: (row) => (
                <Avatar 
                    variant="rounded" 
                    src={row.imageUrl} 
                    alt={row.name}
                    sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}
                >
                    {row.name ? row.name.charAt(0).toUpperCase() : '?'}
                </Avatar>
            )
        },
        { 
            id: 'name', 
            label: t('products:productName'), 
            align: 'left',
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
            label: t('products:actions'), 
            align: 'center',
            render: (row) => (
                <>
                    <Tooltip title={t('products:editInformation')}>
                        <IconButton color="primary" onClick={() => handleEditClick(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('products:deleteProduct')}>
                        <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        }
    ], [t]);

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('products:productManagement')}
                </Typography>
            </Box>
            
            {/* Form thêm mới */}
            <ProductForm materials={materials} onAdd={handleAdd} />
            
            {/* BẢNG DÙNG CHUNG (COMMON TABLE) */}
            <CommonTable 
                data={products} 
                columns={columns}
                emptyMessage={t('products:noData')}
            />

            {/* Dialog Sửa */}
            <ProductUpdateDialog 
                open={isDialogOpen}
                initialData={editingProduct}
                materials={materials}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdate}
            />

            {/* Dialog Xác nhận Xóa */}
            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
            >
                <DialogTitle>{t('products:confirmDeleteProduct')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('products:confirmDeleteProductDescription')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">
                        {t('products:cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        {t('products:delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
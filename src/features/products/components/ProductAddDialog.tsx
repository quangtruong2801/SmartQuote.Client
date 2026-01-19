import { useState, type ChangeEvent } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, Typography,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { uploadService } from '../../../api/uploadService';
import type { ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';

interface Props {
    open: boolean;
    onClose: () => void;
    materials: Material[];
    onAdd: (data: ProductCreateDto) => Promise<void>;
}

export const ProductAddDialog = ({ open, onClose, materials, onAdd }: Props) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    // ===== State Data =====
    const [newItem, setNewItem] = useState<ProductCreateDto>({
        name: '',
        imageUrl: '',
        imagePublicId: '',
        defaultWidth: 0,
        defaultHeight: 0,
        defaultDepth: 0,
        pricingFormula: 'W*H*Material',
        baseLaborCost: 0,
        defaultMaterialId: 0
    });

    // ===== State Image =====
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Xử lý chọn ảnh
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Xử lý Submit
    const handleSubmit = async () => {
        // Validation
        if (!newItem.name || newItem.defaultMaterialId === 0) {
            enqueueSnackbar(t('products:pleaseEnterProductNameAndMaterial'), { variant: 'warning' });
            return;
        }

        try {
            setIsUploading(true);

            let imageUrl = '';
            let imagePublicId = '';

            // 1. Upload ảnh trước (nếu có)
            if (selectedFile) {
                const result = await uploadService.uploadImage(selectedFile);
                imageUrl = result.url;
                imagePublicId = result.publicId;
            }

            // 2. Gọi hàm onAdd từ Page với dữ liệu đã có link ảnh
            await onAdd({
                ...newItem,
                imageUrl,
                imagePublicId
            });

            // 3. Reset form và đóng dialog
            setNewItem({
                name: '',
                imageUrl: '',
                imagePublicId: '',
                defaultWidth: 0,
                defaultHeight: 0,
                defaultDepth: 0,
                pricingFormula: 'W*H*Material',
                baseLaborCost: 0,
                defaultMaterialId: 0
            });
            setSelectedFile(null);
            setPreviewImage('');
            onClose();

        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('products:addProduct')}
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* ===== CỘT TRÁI: ẢNH ===== */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Box
                            sx={{
                                border: '1px dashed grey',
                                borderRadius: 2,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 200,
                                bgcolor: 'background.default'
                            }}
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: 150,
                                        objectFit: 'contain',
                                        borderRadius: 4
                                    }}
                                />
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    {t('products:noImage')}
                                </Typography>
                            )}

                            <Button
                                component="label"
                                variant="outlined"
                                size="small"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 2 }}
                                disabled={isUploading}
                            >
                                {t('products:selectImage')}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Box>
                    </Grid>

                    {/* ===== CỘT PHẢI: FORM DATA ===== */}
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label={t('products:productName')}
                                    size="small"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label={t('products:defaultMaterial')}
                                    size="small"
                                    value={newItem.defaultMaterialId}
                                    onChange={(e) => setNewItem({ ...newItem, defaultMaterialId: Number(e.target.value) })}
                                >
                                    <MenuItem value={0} disabled>
                                        -- {t('products:selectMaterial')} --
                                    </MenuItem>
                                    {materials.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>
                                            {m.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 4 }}>
                                <TextField
                                    fullWidth
                                    label={t('products:length')}
                                    type="number"
                                    size="small"
                                    value={newItem.defaultWidth}
                                    onChange={(e) => setNewItem({ ...newItem, defaultWidth: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField
                                    fullWidth
                                    label={t('products:height')}
                                    type="number"
                                    size="small"
                                    value={newItem.defaultHeight}
                                    onChange={(e) => setNewItem({ ...newItem, defaultHeight: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField
                                    fullWidth
                                    label={t('products:depth')}
                                    type="number"
                                    size="small"
                                    value={newItem.defaultDepth}
                                    onChange={(e) => setNewItem({ ...newItem, defaultDepth: Number(e.target.value) })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit" disabled={isUploading}>
                    {t('common:cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />}
                >
                    {isUploading ? t('products:uploading') : t('products:addProduct')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
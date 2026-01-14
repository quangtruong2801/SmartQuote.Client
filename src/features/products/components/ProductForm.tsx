import { useState, type ChangeEvent } from 'react';
import {
    Paper, Typography, TextField, Button, MenuItem, Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';
import { uploadService } from '../../../api/uploadService';
import { useTranslation } from 'react-i18next';

interface Props {
    materials: Material[];
    onAdd: (data: ProductCreateDto) => void;
}

export const ProductForm = ({ materials, onAdd }: Props) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    // ===== State chính =====
    const [newItem, setNewItem] = useState<ProductCreateDto>({
        name: '',
        imageUrl: '',
        defaultWidth: 0,
        defaultHeight: 0,
        defaultDepth: 0,
        pricingFormula: 'W*H*Material',
        baseLaborCost: 0,
        defaultMaterialId: 0
    });

    // ===== State xử lý ảnh =====
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // file chưa upload
    const [previewImage, setPreviewImage] = useState<string>('');       // preview
    const [isUploading, setIsUploading] = useState(false);

    // ===== Chọn ảnh: CHỈ preview – KHÔNG upload =====
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // ===== Submit: upload ảnh TẠI ĐÂY =====
    const handleSubmit = async () => {
        if (!newItem.name || newItem.defaultMaterialId === 0) {
            enqueueSnackbar(
                t('products:pleaseEnterProductNameAndMaterial'),
                { variant: 'warning' }
            );
            return;
        }

        try {
            setIsUploading(true);

            let imageUrl = '';

            // chỉ upload khi có chọn ảnh
            if (selectedFile) {
                imageUrl = await uploadService.uploadImage(selectedFile);
            }

            onAdd({
                ...newItem,
                imageUrl
            });

            enqueueSnackbar(
                t('products:productAddedSuccess'),
                { variant: 'success' }
            );

            // ===== Reset form =====
            setNewItem({
                name: '',
                imageUrl: '',
                defaultWidth: 0,
                defaultHeight: 0,
                defaultDepth: 0,
                pricingFormula: 'W*H*Material',
                baseLaborCost: 0,
                defaultMaterialId: 0
            });
            setSelectedFile(null);
            setPreviewImage('');

        } catch (error) {
            console.error(error);
            enqueueSnackbar(
                t('products:imageUploadError'),
                { variant: 'error' }
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('products:addProduct')}
            </Typography>

            <Grid container spacing={2}>
                {/* ===== CỘT TRÁI: ẢNH ===== */}
                <Grid size={{ xs: 12, sm: 3 }} sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            border: '1px dashed grey',
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            minHeight: 150
                        }}
                    >
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 120,
                                    objectFit: 'contain'
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
                            sx={{ mt: 1 }}
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

                {/* ===== CỘT PHẢI: FORM ===== */}
                <Grid size={{ xs: 12, sm: 9 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label={t('products:productName')}
                                size="small"
                                value={newItem.name}
                                onChange={(e) =>
                                    setNewItem({ ...newItem, name: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                fullWidth
                                label={t('products:defaultMaterial')}
                                size="small"
                                value={newItem.defaultMaterialId}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        defaultMaterialId: Number(e.target.value)
                                    })
                                }
                            >
                                <MenuItem value={0}>
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
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        defaultWidth: Number(e.target.value)
                                    })
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 4 }}>
                            <TextField
                                fullWidth
                                label={t('products:height')}
                                type="number"
                                size="small"
                                value={newItem.defaultHeight}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        defaultHeight: Number(e.target.value)
                                    })
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 4 }}>
                            <TextField
                                fullWidth
                                label={t('products:depth')}
                                type="number"
                                size="small"
                                value={newItem.defaultDepth}
                                onChange={(e) =>
                                    setNewItem({
                                        ...newItem,
                                        defaultDepth: Number(e.target.value)
                                    })
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                startIcon={<AddCircleIcon />}
                                onClick={handleSubmit}
                                disabled={isUploading}
                            >
                                {isUploading
                                    ? t('products:uploading')
                                    : t('products:saveProduct')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

import { useEffect, useState, type ChangeEvent } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Box, Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';
import type { ProductTemplate } from '../types';
import type { Material } from '../../materials/types';
import { uploadService } from '../../../api/uploadService';
import { useTranslation } from 'react-i18next';
interface Props {
    open: boolean;
    initialData: ProductTemplate | null;
    materials: Material[]; // Cần list vật tư để hiện dropdown
    onClose: () => void;
    onSave: (data: ProductTemplate) => void;
}

export const ProductUpdateDialog = ({ open, initialData, materials, onClose, onSave }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    // State lưu dữ liệu đang sửa
    const [formData, setFormData] = useState<ProductTemplate>({
        id: 0, name: '', imageUrl: '', 
        defaultWidth: 0, defaultHeight: 0, defaultDepth: 0,
        pricingFormula: '', baseLaborCost: 0, defaultMaterialId: 0
    });

    const [isUploading, setIsUploading] = useState(false);

    // Mỗi khi mở popup, nạp dữ liệu cũ vào
    useEffect(() => {
        const fetchData = async () => {
            if (initialData) {
                setFormData(initialData);
            }
        };
        fetchData();
    }, [initialData]);

    // Xử lý upload ảnh mới (nếu người dùng muốn đổi ảnh)
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                setIsUploading(true);
                const url = await uploadService.uploadImage(file);
                // Cập nhật link ảnh mới
                setFormData({ ...formData, imageUrl: url });
                setIsUploading(false);
                enqueueSnackbar(t('products:imageUploadSuccess'), { variant: 'success' });
            } catch (error) {
                console.error(error);
                setIsUploading(false);
                enqueueSnackbar(t('products:imageUploadError'), { variant: 'error' });
            }
        }
    };

    const handleSave = () => {
        if (!formData.name || formData.defaultMaterialId === 0) {
            enqueueSnackbar(t('products:pleaseEnterProductNameAndMaterial'), { variant: 'warning' });
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{t('products:updateProduct')} #{formData.id}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* CỘT TRÁI: ẢNH */}
                    <Grid size={{ xs: 12, sm: 4 }} textAlign="center">
                        <Box sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, mb: 2 }}>
                            <Avatar 
                                variant="rounded"
                                src={formData.imageUrl} 
                                sx={{ width: '100%', height: 150, objectFit: 'contain', mb: 2 }} 
                            />
                            <Button
                                component="label"
                                variant="outlined" size="small"
                                startIcon={<CloudUploadIcon />}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Đang tải...' : 'Đổi ảnh'}
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Grid>

                    {/* CỘT PHẢI: THÔNG TIN */}
                    <Grid size={{ xs: 12, sm: 8 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label={t('products:productName')} size="small"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField select fullWidth label={t('products:defaultMaterial')} size="small"
                                    value={formData.defaultMaterialId}
                                    onChange={(e) => setFormData({...formData, defaultMaterialId: Number(e.target.value)})}
                                >
                                    {materials.map((m) => (
                                        <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField fullWidth label={t('products:length')} type="number" size="small"
                                    value={formData.defaultWidth}
                                    onChange={(e) => setFormData({...formData, defaultWidth: Number(e.target.value)})}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField fullWidth label={t('products:height')} type="number" size="small"
                                    value={formData.defaultHeight}
                                    onChange={(e) => setFormData({...formData, defaultHeight: Number(e.target.value)})}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField fullWidth label={t('products:depth')} type="number" size="small"
                                    value={formData.defaultDepth}
                                    onChange={(e) => setFormData({...formData, defaultDepth: Number(e.target.value)})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField fullWidth label={t('products:pricingFormula')} size="small"
                                    value={formData.pricingFormula}
                                    helperText={t('products:pricingFormulaHelperText')}
                                    onChange={(e) => setFormData({...formData, pricingFormula: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">{t('products:cancel')}</Button>
                <Button onClick={handleSave} variant="contained" disabled={isUploading}>
                    {t('products:saveChanges')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
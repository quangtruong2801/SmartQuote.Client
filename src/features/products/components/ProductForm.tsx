import { useState, type ChangeEvent } from 'react';
import { 
    Paper, Typography, TextField, Button, MenuItem, Box 
} from '@mui/material'; 
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icon mới
import type { ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';
import { uploadService } from '../../../api/uploadService'; // Import service

interface Props {
    materials: Material[];
    onAdd: (data: ProductCreateDto) => void;
}

export const ProductForm = ({ materials, onAdd }: Props) => {
    const [newItem, setNewItem] = useState<ProductCreateDto>({
        name: '',
        imageUrl: '', 
        defaultWidth: 0, defaultHeight: 0, defaultDepth: 0,
        pricingFormula: 'W*H*Material',
        baseLaborCost: 0,
        defaultMaterialId: 0
    });
    const { enqueueSnackbar } = useSnackbar();
    // State lưu file đang chọn (chưa upload)
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    // Xử lý khi chọn file từ máy tính
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // 1. Hiện ảnh xem trước ngay lập tức
            setPreviewImage(URL.createObjectURL(file));
            // 2. Tự động upload lên server luôn
            try {
                setIsUploading(true);
                const url = await uploadService.uploadImage(file);
                // 3. Upload xong -> Lưu link ảnh vào state chính
                setNewItem({ ...newItem, imageUrl: url });
                setIsUploading(false);
                enqueueSnackbar('Ảnh đã được upload thành công', { variant: 'success' });
            } catch (error) {
                console.error(error);
                setIsUploading(false);
                enqueueSnackbar('Lỗi upload ảnh!', { variant: 'error' });
            }
        }
    };

    const handleSubmit = () => {
        if (!newItem.name || newItem.defaultMaterialId === 0) {
            enqueueSnackbar('Vui lòng nhập tên và chọn vật tư!', { variant: 'warning' });
            return;
        }
        
        // Gửi dữ liệu đi (bao gồm cả link ảnh trong imageUrl)
        onAdd(newItem);
        enqueueSnackbar('Sản phẩm đã được thêm thành công', { variant: 'success' });
        // Reset form
        setNewItem({ 
            name: '', imageUrl: '', 
            defaultWidth: 0, defaultHeight: 0, defaultDepth: 0, 
            pricingFormula: 'W*H*Material', baseLaborCost: 0, 
            defaultMaterialId: 0 
        });
        setPreviewImage(''); // Xóa ảnh preview
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Thêm Sản phẩm mẫu</Typography>
            <Grid container spacing={2}>
                {/* CỘT TRÁI: ẢNH ĐẠI DIỆN */}
                <Grid size={{ xs: 12, sm: 3 }} sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                        border: '1px dashed grey', borderRadius: 2, p: 2, 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        height: '100%', minHeight: 150, bgcolor: 'white'
                    }}>
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }} />
                        ) : (
                            <Typography variant="caption" color="text.secondary">Chưa có ảnh</Typography>
                        )}
                        
                        <Button
                            component="label"
                            variant="outlined" size="small"
                            startIcon={<CloudUploadIcon />}
                            sx={{ mt: 1 }}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Đang tải...' : 'Chọn ảnh'}
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>
                </Grid>

                {/* CỘT PHẢI: FORM NHẬP LIỆU */}
                <Grid size={{ xs: 12, sm: 9 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Tên sản phẩm" size="small"
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                             <TextField select fullWidth label="Vật tư mặc định" size="small"
                                value={newItem.defaultMaterialId}
                                onChange={(e) => setNewItem({...newItem, defaultMaterialId: Number(e.target.value)})}
                            >
                                <MenuItem value={0}>-- Chọn vật tư --</MenuItem>
                                {materials.map((m) => (
                                    <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField fullWidth label="Dài (mm)" type="number" size="small"
                                value={newItem.defaultWidth}
                                onChange={(e) => setNewItem({...newItem, defaultWidth: Number(e.target.value)})}
                            />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField fullWidth label="Cao (mm)" type="number" size="small"
                                value={newItem.defaultHeight}
                                onChange={(e) => setNewItem({...newItem, defaultHeight: Number(e.target.value)})}
                            />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <TextField fullWidth label="Sâu (mm)" type="number" size="small"
                                value={newItem.defaultDepth}
                                onChange={(e) => setNewItem({...newItem, defaultDepth: Number(e.target.value)})}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button fullWidth variant="contained" color="success"
                                startIcon={<AddCircleIcon />} onClick={handleSubmit}
                                disabled={isUploading} // Không cho bấm nút nếu ảnh đang upload chưa xong
                            >
                                Lưu Sản Phẩm
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
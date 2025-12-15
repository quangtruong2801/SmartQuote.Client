import { useEffect, useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { Material } from '../types';

interface Props {
    open: boolean;
    initialData: Material | null;
    onClose: () => void;
    onSave: (data: Material) => void;
}

export const MaterialUpdateDialog = ({ open, initialData, onClose, onSave }: Props) => {
    // State lưu dữ liệu đang sửa
    const [formData, setFormData] = useState<Material>({
        id: 0, name: '', unit: '', unitPrice: 0
    });

    // Mỗi khi mở popup lên, copy dữ liệu cũ vào form
    useEffect(() => {
        const fetchData = async () => {
            if (initialData) {
                setFormData(initialData);
            }
        };
        fetchData();
    }, [initialData]);

    const handleChange = (field: keyof Material, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Cập nhật Vật tư #{formData.id}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label="Tên vật tư" 
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            fullWidth label="Đơn vị" 
                            value={formData.unit}
                            onChange={(e) => handleChange('unit', e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField 
                            fullWidth label="Đơn giá" type="number"
                            value={formData.unitPrice}
                            onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Lưu thay đổi</Button>
            </DialogActions>
        </Dialog>
    );
};
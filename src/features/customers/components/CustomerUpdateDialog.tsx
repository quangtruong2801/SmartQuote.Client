import { useEffect, useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField
} from '@mui/material';
import { useSnackbar } from 'notistack';
import type { Customer } from '../types';
import Grid from '@mui/material/Grid';
interface Props {
    open: boolean;
    initialData: Customer | null;
    onClose: () => void;
    onSave: (data: Customer) => void;
}

export const CustomerUpdateDialog = ({ open, initialData, onClose, onSave }: Props) => {
    const { enqueueSnackbar } = useSnackbar();

    // State form
    const [formData, setFormData] = useState<Customer>({
        id: 0, name: '', phone: '', email: '', address: ''
    });

    // Khi mở dialog, nạp dữ liệu cũ vào form
    useEffect(() => {
        const fetchData = async () => {
            if (initialData) {
                setFormData(initialData);
            }
        };
        fetchData();
    }, [initialData]);

    const handleSave = () => {
        if (!formData.name || !formData.phone) {
            enqueueSnackbar('Vui lòng nhập tên và số điện thoại!', { variant: 'warning' });
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Cập nhật Khách hàng</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label="Tên khách hàng" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth label="Số điện thoại" required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth label="Email" type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label="Địa chỉ" multiline rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Lưu Thay Đổi
                </Button>
            </DialogActions>
        </Dialog>
    );
};
import { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import type { CustomerCreateDto } from '../types';

interface Props {
    onAdd: (data: CustomerCreateDto) => void;
}

export const CustomerForm = ({ onAdd }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    
    // State lưu dữ liệu nhập vào
    const [newItem, setNewItem] = useState<CustomerCreateDto>({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleSubmit = () => {
        // Validate dữ liệu cơ bản
        if (!newItem.name || !newItem.phone) {
            enqueueSnackbar('Vui lòng nhập tên và số điện thoại khách hàng!', { variant: 'warning' });
            return;
        }

        // Gửi dữ liệu ra component cha (Page) để xử lý API
        onAdd(newItem);

        // Reset form về rỗng để nhập người tiếp theo
        setNewItem({
            name: '',
            phone: '',
            email: '',
            address: ''
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
                Thêm Khách Hàng Mới
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField 
                        fullWidth label="Tên khách hàng (*)" size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField 
                        fullWidth label="Số điện thoại (*)" size="small"
                        value={newItem.phone}
                        onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField 
                        fullWidth label="Email" size="small"
                        value={newItem.email}
                        onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button 
                        fullWidth variant="contained" color="success" size="large"
                        startIcon={<AddCircleIcon />} 
                        onClick={handleSubmit}
                        sx={{ height: '100%' }} // Để nút cao bằng ô input
                    >
                        Thêm
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        fullWidth label="Địa chỉ" size="small"
                        value={newItem.address}
                        onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
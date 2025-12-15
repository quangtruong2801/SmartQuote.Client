import { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import type { CustomerCreateDto } from '../types';

interface Props {
    onAdd: (data: CustomerCreateDto) => void;
}

export const CustomerForm = ({ onAdd }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    
    const [newItem, setNewItem] = useState<CustomerCreateDto>({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleSubmit = () => {
        if (!newItem.name || !newItem.phone) {
            enqueueSnackbar('Vui lòng nhập tên và số điện thoại khách hàng!', { variant: 'warning' });
            return;
        }
        onAdd(newItem);
        setNewItem({ name: '', phone: '', email: '', address: '' });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
                Thêm Khách Hàng Mới
            </Typography>

            {/* Grid container */}
            <Grid container spacing={2}>
            
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField 
                        fullWidth label="Tên khách hàng (*)" size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        fullWidth label="Số điện thoại (*)" size="small"
                        value={newItem.phone}
                        onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        fullWidth label="Email" size="small"
                        value={newItem.email}
                        onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <Button 
                        fullWidth variant="contained" color="success" size="large"
                        startIcon={<AddCircleIcon />} 
                        onClick={handleSubmit}
                        sx={{ height: '100%' }}
                    >
                        Thêm
                    </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
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
import { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { MaterialCreateDto } from '../types';

interface Props {
    onAdd: (data: MaterialCreateDto) => void; // Callback bắn dữ liệu ra ngoài
}

export const MaterialForm = ({ onAdd }: Props) => {
    const [newItem, setNewItem] = useState<MaterialCreateDto>({
        name: '', unit: '', unitPrice: 0
    });

    const handleSubmit = () => {
        if (!newItem.name || !newItem.unit) return;
        onAdd(newItem);
        setNewItem({ name: '', unit: '', unitPrice: 0 }); // Reset form
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Thêm Vật tư mới</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Tên vật tư" size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField fullWidth label="Đơn vị" size="small"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField fullWidth label="Đơn giá" type="number" size="small"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button fullWidth variant="contained" color="success" 
                        startIcon={<AddCircleIcon />} onClick={handleSubmit}>
                        Thêm
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
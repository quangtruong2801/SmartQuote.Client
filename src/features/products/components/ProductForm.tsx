import { useState } from 'react';
import { 
    Paper, Typography, Grid, TextField, Button, MenuItem 
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { ProductCreateDto } from '../types';
import type { Material } from '../../materials/types';

interface Props {
    materials: Material[]; // Nhận danh sách vật tư để chọn
    onAdd: (data: ProductCreateDto) => void;
}

export const ProductForm = ({ materials, onAdd }: Props) => {
    const [newItem, setNewItem] = useState<ProductCreateDto>({
        name: '',
        defaultWidth: 0, defaultHeight: 0, defaultDepth: 0,
        pricingFormula: 'W*H*Material',
        baseLaborCost: 0,
        defaultMaterialId: 0
    });

    const handleSubmit = () => {
        if (!newItem.name || newItem.defaultMaterialId === 0) {
            alert("Vui lòng nhập tên và chọn vật tư!");
            return;
        }
        onAdd(newItem);
        // Reset (giữ nguyên công thức mặc định cho tiện)
        setNewItem({ 
            ...newItem, name: '', defaultWidth: 0, defaultHeight: 0, 
            defaultDepth: 0, baseLaborCost: 0 
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Thêm Sản phẩm mẫu</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Tên sản phẩm" size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    />
                </Grid>
                
                {/* DROPDOWN CHỌN VẬT TƯ */}
                <Grid item xs={12} sm={6}>
                    <TextField 
                        select fullWidth label="Vật tư mặc định" size="small"
                        value={newItem.defaultMaterialId}
                        onChange={(e) => setNewItem({...newItem, defaultMaterialId: Number(e.target.value)})}
                    >
                        <MenuItem value={0}>-- Chọn vật tư --</MenuItem>
                        {materials.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                                {m.name} ({m.unit})
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={4} sm={3}>
                    <TextField fullWidth label="Dài (mm)" type="number" size="small"
                        value={newItem.defaultWidth}
                        onChange={(e) => setNewItem({...newItem, defaultWidth: Number(e.target.value)})}
                    />
                </Grid>
                <Grid item xs={4} sm={3}>
                    <TextField fullWidth label="Cao (mm)" type="number" size="small"
                         value={newItem.defaultHeight}
                         onChange={(e) => setNewItem({...newItem, defaultHeight: Number(e.target.value)})}
                    />
                </Grid>
                <Grid item xs={4} sm={3}>
                    <TextField fullWidth label="Sâu (mm)" type="number" size="small"
                         value={newItem.defaultDepth}
                         onChange={(e) => setNewItem({...newItem, defaultDepth: Number(e.target.value)})}
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <Button fullWidth variant="contained" color="success" sx={{ height: '100%' }}
                        startIcon={<AddCircleIcon />} onClick={handleSubmit}>
                        Tạo Mẫu
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
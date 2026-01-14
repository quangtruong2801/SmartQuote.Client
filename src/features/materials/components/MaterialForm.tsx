import { useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { MaterialCreateDto } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
    onAdd: (data: MaterialCreateDto) => void;
}

export const MaterialForm = ({ onAdd }: Props) => {
    const { t } = useTranslation();
    const [newItem, setNewItem] = useState<MaterialCreateDto>({
        name: '', unit: '', unitPrice: 0
    });

    const handleSubmit = () => {
        if (!newItem.name || !newItem.unit) return;
        onAdd(newItem);
        setNewItem({ name: '', unit: '', unitPrice: 0 }); // Reset form
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('materials:addMaterial')}</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField fullWidth label={t('materials:materialName')} size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('materials:unit')} size="small"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField fullWidth label={t('materials:unitPrice')} type="number" size="small"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                    <Button fullWidth variant="contained" color="success" 
                        startIcon={<AddCircleIcon />} onClick={handleSubmit}>
                        {t('materials:add')}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
import { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import type { CustomerCreateDto } from '../types';
import { useTranslation } from 'react-i18next';

interface Props {
    onAdd: (data: CustomerCreateDto) => void;
}

export const CustomerForm = ({ onAdd }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [newItem, setNewItem] = useState<CustomerCreateDto>({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleSubmit = () => {
        if (!newItem.name || !newItem.phone) {
            enqueueSnackbar(t('customers:pleaseEnterCustomerNameAndPhone'), { variant: 'warning' });
            return;
        }
        onAdd(newItem);
        setNewItem({ name: '', phone: '', email: '', address: '' });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4}}>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
                {t('customers:addNewCustomer')}
            </Typography>

            {/* Grid container */}
            <Grid container spacing={2}>
            
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField 
                        fullWidth label={t('customers:customerName')} size="small"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        fullWidth label={t('customers:customerPhone')} size="small"
                        value={newItem.phone}
                        onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField 
                        fullWidth label={t('customers:customerEmail')} size="small"
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
                        {t('customers:add')}
                    </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField 
                        fullWidth label={t('customers:customerAddress')} size="small"
                        value={newItem.address}
                        onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};
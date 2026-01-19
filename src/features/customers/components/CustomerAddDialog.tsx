import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import type { CustomerCreateDto } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (data: CustomerCreateDto) => Promise<void>;
}

export const CustomerAddDialog = ({ open, onClose, onAdd }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // State form
    const [newItem, setNewItem] = useState<CustomerCreateDto>({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Xử lý Submit
    const handleSubmit = async () => {
        // Validate
        if (!newItem.name || !newItem.phone) {
            enqueueSnackbar(t('customers:pleaseEnterCustomerNameAndPhone'), { variant: 'warning' });
            return;
        }

        try {
            setIsSubmitting(true);
            await onAdd(newItem);
            
            // Reset form và đóng dialog
            setNewItem({ name: '', phone: '', email: '', address: '' });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('customers:addNewCustomer')}
            </DialogTitle>
            
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                            autoFocus
                            fullWidth label={t('customers:customerName')} 
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                            fullWidth label={t('customers:customerPhone')} 
                            value={newItem.phone}
                            onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label={t('customers:customerEmail')} type="email"
                            value={newItem.email}
                            onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            fullWidth label={t('customers:customerAddress')} 
                            value={newItem.address}
                            onChange={(e) => setNewItem({ ...newItem, address: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                    {t('common:cancel')}
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<AddCircleIcon />} 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('common:processing') : t('customers:add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
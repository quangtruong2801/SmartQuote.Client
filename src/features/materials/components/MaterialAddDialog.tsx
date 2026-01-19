import { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import type { MaterialCreateDto } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
    onAdd: (data: MaterialCreateDto) => Promise<void>;
}

export const MaterialAddDialog = ({ open, onClose, onAdd }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    const [newItem, setNewItem] = useState<MaterialCreateDto>({
        name: '', 
        unit: '', 
        unitPrice: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        // Validate
        if (!newItem.name || !newItem.unit) {
            enqueueSnackbar(t('materials:pleaseEnterNameAndUnit'), { variant: 'warning' });
            return;
        }

        try {
            setIsSubmitting(true);
            await onAdd(newItem);
            
            // Reset form và đóng
            setNewItem({ name: '', unit: '', unitPrice: 0 });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {t('materials:addMaterial')}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={{ xs: 12 }}>
                        <TextField 
                            autoFocus
                            fullWidth 
                            label={t('materials:materialName')} 
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label={t('materials:unit')} 
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField 
                            fullWidth 
                            label={t('materials:unitPrice')} 
                            type="number" 
                            value={newItem.unitPrice}
                            onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
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
                    color="primary"
                    startIcon={<AddCircleIcon />} 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t('common:processing') : t('materials:add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
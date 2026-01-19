import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { customerService } from '../services/customerService';
import type { Customer, CustomerCreateDto } from '../types';

// Components
import { CustomerAddDialog } from '../components/CustomerAddDialog';
import { CustomerUpdateDialog } from '../components/CustomerUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const CustomersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    
    // State Thêm mới
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    // State Sửa
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    // State Xóa
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // --- DATA LOADING ---
    const loadData = async () => {
        try {
            const data = await customerService.getAll();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- HANDLERS ---

    // 1. Thêm mới
    const handleAdd = async (newCustomer: CustomerCreateDto) => {
        try {
            await customerService.create(newCustomer);
            enqueueSnackbar(t('customers:addCustomerSuccess'), { variant: 'success' });
            loadData();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:addCustomerError'), { variant: 'error' });
            throw error;
        }
    };

    // 2. Sửa
    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsEditDialogOpen(true);
    };

    const handleUpdateSave = async (updatedData: Customer) => {
        try {
            await customerService.update(updatedData.id, updatedData);
            setCustomers(customers.map(c => c.id === updatedData.id ? updatedData : c));
            enqueueSnackbar(t('customers:updateCustomerSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:updateCustomerError'), { variant: 'error' });
        }
    };

    // 3. Xóa
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await customerService.delete(deleteId);
            setCustomers(customers.filter(c => c.id !== deleteId));
            enqueueSnackbar(t('customers:deleteCustomerSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:deleteCustomerError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    // --- COLUMNS ---
    const columns = useMemo<ColumnDef<Customer>[]>(() => [
        { id: 'id', label: 'ID', align: 'center' },
        { 
            id: 'name', 
            label: t('customers:customerName'), 
            align: 'center',
            render: (row) => <b>{row.name}</b>
        },
        { id: 'phone', label: t('customers:customerPhone'), align: 'center' },
        { 
            id: 'email', 
            label: t('customers:customerEmail'), 
            align: 'center',
            render: (row) => row.email || '---'
        },
        { 
            id: 'address', 
            label: t('customers:customerAddress'), 
            align: 'center',
            render: (row) => row.address || '---'
        },
        { 
            id: 'actions', 
            label: '', 
            align: 'center',
            render: (row) => (
                <TableActionMenu 
                    onEdit={() => handleEditClick(row)}
                    onDelete={() => handleDeleteClick(row.id)}
                />
            )
        }
    ], [t]);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('customers:customerManagement')}
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenCreateDialog(true)}
                >
                    {t('customers:addNewCustomer')}
                </Button>
            </Box>

            {/* Table */}
            <CommonTable 
                data={customers}
                columns={columns}
                emptyMessage={t('customers:noCustomers')}
            />

            {/* --- DIALOG THÊM MỚI --- */}
            <CustomerAddDialog 
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onAdd={handleAdd}
            />

            {/* Dialog Sửa */}
            <CustomerUpdateDialog 
                open={isEditDialogOpen}
                initialData={editingCustomer}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateSave}
            />

            {/* Dialog Xóa */}
            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogTitle>{t('customers:confirmDeleteCustomer')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('customers:confirmDeleteCustomerDescription')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">{t('common:cancel')}</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>{t('common:delete')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
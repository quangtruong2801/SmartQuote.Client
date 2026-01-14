import { useEffect, useState, useMemo } from 'react';
import { 
    Box, 
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Tooltip,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Services & Types
import { customerService } from '../services/customerService';
import type { Customer, CustomerCreateDto } from '../types';

// Components
import { CustomerForm } from '../components/CustomerForm';
import { CustomerUpdateDialog } from '../components/CustomerUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable'; // Import CommonTable

export const CustomersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    
    // State Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    // --- HANDLERS (LOGIC) ---

    // 1. Thêm mới
    const handleAdd = async (newCustomer: CustomerCreateDto) => {
        try {
            await customerService.create(newCustomer);
            enqueueSnackbar(t('customers:addCustomerSuccess'), { variant: 'success' });
            loadData(); 
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:addCustomerError'), { variant: 'error' });
        }
    };

    // 2. Sửa
    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
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

    // --- ĐỊNH NGHĨA CỘT CHO COMMON TABLE ---
    const columns = useMemo<ColumnDef<Customer>[]>(() => [
        { 
            id: 'id', 
            label: 'ID', 
            align: 'left' 
        },
        { 
            id: 'name', 
            label: t('customers:customerName'), 
            align: 'left',
            render: (row) => <b>{row.name}</b>
        },
        { 
            id: 'phone', 
            label: t('customers:customerPhone'), 
            align: 'left' 
        },
        { 
            id: 'email', 
            label: t('customers:customerEmail'), 
            align: 'left',
            render: (row) => row.email || '---'
        },
        { 
            id: 'address', 
            label: t('customers:customerAddress'), 
            align: 'left',
            render: (row) => row.address || '---'
        },
        { 
            id: 'actions', 
            label: t('customers:actions'), 
            align: 'center',
            render: (row) => (
                <>
                    <Tooltip title={t('customers:editInformation')}>
                        <IconButton color="primary" onClick={() => handleEditClick(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('customers:deleteCustomer')}>
                        <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        }
    ], [t]);

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('customers:customerManagement')}
                </Typography>
            </Box>

            {/* Form thêm mới */}
            <CustomerForm onAdd={handleAdd} />

            {/* BẢNG DÙNG CHUNG (COMMON TABLE) */}
            <CommonTable 
                data={customers}
                columns={columns}
                emptyMessage={t('customers:noCustomers')}
            />

            {/* Dialog Sửa */}
            <CustomerUpdateDialog 
                open={isDialogOpen}
                initialData={editingCustomer}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdateSave}
            />

            {/* Dialog Xác nhận Xóa */}
            <Dialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
            >
                <DialogTitle>{t('customers:confirmDeleteCustomer')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('customers:confirmDeleteCustomerDescription')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)} color="primary">
                        {t('customers:cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                        {t('customers:delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
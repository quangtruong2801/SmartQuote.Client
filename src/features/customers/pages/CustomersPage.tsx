import { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { customerService } from '../services/customerService';
import type { Customer, CustomerCreateDto } from '../types';
import { useTable } from '../../../hooks/useTable';

import { CustomerAddDialog } from '../components/CustomerAddDialog';
import { CustomerUpdateDialog } from '../components/CustomerUpdateDialog';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';
import { TableActionMenu } from '../../../components/Common/TableActionMenu';

export const CustomersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    // --- STATE DỮ LIỆU ---
    const [customers, setCustomers] = useState<Customer[]>([]);

    // --- STATE DIALOGS ---
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const {
        commonTableProps,
        selectedIds,
        setSelectedIds
    } = useTable({
        data: customers,
        defaultOrderBy: 'id',
        defaultOrder: 'asc',
        defaultRowsPerPage: 5
    });

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

            if (selectedIds.includes(deleteId)) {
                setSelectedIds(prev => prev.filter(id => id !== deleteId));
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:deleteCustomerError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    const columns = useMemo<ColumnDef<Customer>[]>(() => [
        {
            id: 'id',
            label: 'ID',
            align: 'left',
            sortable: true
        },
        {
            id: 'name',
            label: t('customers:customerName'),
            align: 'left',
            sortable: true,
            render: (row) => <b>{row.name}</b>
        },
        {
            id: 'phone',
            label: t('customers:customerPhone'),
            align: 'left',
            sortable: true
        },
        {
            id: 'email',
            label: t('customers:customerEmail'),
            align: 'left',
            sortable: true,
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('customers:customerManagement')}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        {t('customers:addNewCustomer')}
                    </Button>
                </Box>
            </Box>

            <CommonTable
                columns={columns}
                selectionMode="multiple"
                emptyMessage={t('customers:noCustomers')}
                {...commonTableProps}
            />

            {/* --- DIALOGS --- */}
            <CustomerAddDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                onAdd={handleAdd}
            />

            <CustomerUpdateDialog
                open={isEditDialogOpen}
                initialData={editingCustomer}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleUpdateSave}
            />

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
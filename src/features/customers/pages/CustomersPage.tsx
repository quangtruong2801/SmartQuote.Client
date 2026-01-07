import { useEffect, useState } from 'react';
import { 
    Box, 
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { customerService } from '../services/customerService';
import { CustomerForm } from '../components/CustomerForm';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerUpdateDialog } from '../components/CustomerUpdateDialog';
import type { Customer, CustomerCreateDto } from '../types';
import { useTranslation } from 'react-i18next';
export const CustomersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const { t } = useTranslation();
    // State cho việc Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Load dữ liệu
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
            loadData(); // Reload lại bảng
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:addCustomerError'), { variant: 'error' });
        }
    };

    // --- XỬ LÝ SỬA ---
    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
    };

    const handleUpdateSave = async (updatedData: Customer) => {
        try {
            await customerService.update(updatedData.id, updatedData);
            
            // Cập nhật UI trực tiếp
            setCustomers(customers.map(c => c.id === updatedData.id ? updatedData : c));
            
            enqueueSnackbar(t('customers:updateCustomerSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:updateCustomerError'), { variant: 'error' });
        }
    };

    // --- XỬ LÝ XÓA ---

    // 1. Mở popup khi bấm nút xóa ở bảng
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    // 2. Đóng popup
    const handleCloseDelete = () => {
        setDeleteId(null);
    };

    // 3. Thực hiện xóa khi bấm Xác nhận
    const handleConfirmDelete = async () => {
        if (deleteId === null) return;
        
        try {
            await customerService.delete(deleteId);
            // Cập nhật UI (xóa khỏi mảng state) để ko cần gọi lại API getAll
            setCustomers(customers.filter(c => c.id !== deleteId));
            enqueueSnackbar(t('customers:deleteCustomerSuccess'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('customers:deleteCustomerError'), { variant: 'error' });
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('customers:customerManagement')}
                </Typography>
            </Box>

            {/* Form thêm mới */}
            <CustomerForm onAdd={handleAdd} />

            {/* Bảng danh sách */}
            <CustomerTable 
                customers={customers} 
                onDelete={handleDeleteClick}
                onEdit={handleEditClick} 
            />

            {/* Dialog Sửa (Ẩn/Hiện) */}
            <CustomerUpdateDialog 
                open={isDialogOpen}
                initialData={editingCustomer}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdateSave}
            />

            {/* --- DIALOG XÁC NHẬN XÓA --- */}
            <Dialog
                open={deleteId !== null}
                onClose={handleCloseDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {t('customers:confirmDeleteCustomer')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        {t('customers:confirmDeleteCustomerDescription')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
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
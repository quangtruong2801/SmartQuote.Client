import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack'; // Import Notistack
import { customerService } from '../services/customerService';
import { CustomerForm } from '../components/CustomerForm';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerUpdateDialog } from '../components/CustomerUpdateDialog'; // Import Dialog Sửa
import type { Customer, CustomerCreateDto } from '../types';

export const CustomersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [customers, setCustomers] = useState<Customer[]>([]);
    
    // State cho việc Sửa
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

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
        const fetchData = async () => {
            const data = await customerService.getAll();
            setCustomers(data);
        };
        fetchData();
    }, []);

    // 1. Thêm mới
    const handleAdd = async (newCustomer: CustomerCreateDto) => {
        try {
            await customerService.create(newCustomer);
            enqueueSnackbar('Thêm khách hàng thành công!', { variant: 'success' });
            loadData(); // Reload lại bảng
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi thêm khách hàng!', { variant: 'error' });
        }
    };

    // 2. Xóa
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
        
        try {
            await customerService.delete(id);
            // Cập nhật UI (xóa khỏi mảng state) để ko cần gọi lại API getAll
            setCustomers(customers.filter(c => c.id !== id));
            enqueueSnackbar('Đã xóa khách hàng!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi không thể xóa (Có thể khách đã có đơn hàng)!', { variant: 'error' });
        }
    };

    // 3. Chuẩn bị Sửa (Mở Dialog)
    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsDialogOpen(true);
    };

    // 4. Lưu Sửa
    const handleUpdateSave = async (updatedData: Customer) => {
        try {
            await customerService.update(updatedData.id, updatedData);
            
            // Cập nhật UI trực tiếp
            setCustomers(customers.map(c => c.id === updatedData.id ? updatedData : c));
            
            enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi cập nhật!', { variant: 'error' });
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    QUẢN LÝ KHÁCH HÀNG
                </Typography>
            </Box>

            {/* Form thêm mới */}
            <CustomerForm onAdd={handleAdd} />

            {/* Bảng danh sách */}
            <CustomerTable 
                customers={customers} 
                onDelete={handleDelete}
                onEdit={handleEditClick} 
            />

            {/* Dialog Sửa (Ẩn/Hiện) */}
            <CustomerUpdateDialog 
                open={isDialogOpen}
                initialData={editingCustomer}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleUpdateSave}
            />
        </Box>
    );
};
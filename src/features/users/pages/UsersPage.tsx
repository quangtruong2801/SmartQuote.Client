import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
    Box, Typography, Button, IconButton, Chip, 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, MenuItem, Tooltip 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { userService, type User, type CreateUserRequest } from '../services/userService';
import { CommonTable, type ColumnDef } from '../../../components/Common/CommonTable';

export const UsersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    
    // --- STATE ---
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState<CreateUserRequest>({
        username: '', password: '', role: 'Staff'
    });

    // --- FETCH DATA ---
    const fetchUsers = useCallback(async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    // --- USE EFFECT ---
    useEffect(() => {
        const initData = async () => {
            await fetchUsers();
        };
        initData();
    }, [fetchUsers]);

    // --- HANDLERS ---

    const handleCreate = async () => {
        if (!newUser.username || !newUser.password) {
            enqueueSnackbar(t('users:pleaseEnterAllInformation'), { variant: 'warning' });
            return;
        }
        try {
            await userService.create(newUser);
            enqueueSnackbar(t('users:createAccountSuccess'), { variant: 'success' });
            setOpenDialog(false);
            setNewUser({ username: '', password: '', role: 'Staff' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('users:errorCreatingAccount'), { variant: 'error' });
        }
    };

    // Dùng useCallback cho hàm xóa để dùng trong useMemo
    const handleDelete = useCallback(async (id: number) => {
        if (!confirm(t('users:confirmDeleteAccount'))) return;
        try {
            await userService.delete(id);
            // Cập nhật state trực tiếp để đỡ phải gọi API lại
            setUsers(prev => prev.filter(u => u.id !== id));
            enqueueSnackbar(t('users:employeeDeleted'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('users:errorDeleting'), { variant: 'error' });
        }
    }, [t, enqueueSnackbar]);

    // --- COLUMNS ---
    const columns = useMemo<ColumnDef<User>[]>(() => [
        { 
            id: 'id', 
            label: 'ID', 
            align: 'center',
            render: (row) => <b>#{row.id}</b>
        },
        { 
            id: 'username', 
            label: t('users:username'), 
            align: 'center',
            render: (row) => (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <PersonIcon color="action" fontSize="small" /> 
                    <b>{row.username}</b>
                </Box>
            )
        },
        { 
            id: 'role', 
            label: t('users:role'), 
            align: 'center',
            render: (row) => (
                row.role === 'Admin' ? (
                    <Chip icon={<SecurityIcon />} label={t('users:admin')} color="error" size="small" />
                ) : (
                    <Chip label={t('users:salesEmployee')} color="primary" variant="outlined" size="small" />
                )
            )
        },
        { 
            id: 'actions', 
            label: '', 
            align: 'center',
            render: (row) => (
                <Tooltip title={t('users:deleteAccount')}>
                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )
        }
    ], [t, handleDelete]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {t('users:employeeManagement')}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    {t('users:addEmployee')}
                </Button>
            </Box>

            {/* SỬ DỤNG COMMON TABLE */}
            <CommonTable 
                data={users}
                columns={columns}
                emptyMessage={t('users:noUsers')}
            />

            {/* DIALOG THÊM MỚI */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{t('users:createAccount')}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                fullWidth label={t('users:username')} 
                                value={newUser.username}
                                onChange={e => setNewUser({...newUser, username: e.target.value})}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                fullWidth label={t('users:password')} type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                select fullWidth label={t('users:role')}
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <MenuItem value="Staff">{t('users:salesEmployee')}</MenuItem>
                                <MenuItem value="Admin">{t('users:admin')}</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">{t('users:cancel')}</Button>
                    <Button variant="contained" onClick={handleCreate}>{t('users:createAccount')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
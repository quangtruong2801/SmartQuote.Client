import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
    IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    MenuItem 
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { useSnackbar } from 'notistack';

import { userService, type User, type CreateUserRequest } from '../services/userService';

export const UsersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    
    // State Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [newUser, setNewUser] = useState<CreateUserRequest>({
        username: '', password: '', role: 'Staff'
    });

    useEffect(() => {
        userService.getAll().then(setUsers);
    }, []);

    const handleCreate = async () => {
        if (!newUser.username || !newUser.password) {
            enqueueSnackbar('Vui lòng nhập đủ thông tin!', { variant: 'warning' });
            return;
        }
        try {
            await userService.create(newUser);
            enqueueSnackbar('Tạo tài khoản thành công!', { variant: 'success' });
            setOpenDialog(false);
            setNewUser({ username: '', password: '', role: 'Staff' }); // Reset form
            userService.getAll().then(setUsers);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi tạo tài khoản (Có thể trùng tên)!', { variant: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Xóa tài khoản này? Họ sẽ không thể đăng nhập nữa.')) return;
        try {
            await userService.delete(id);
            setUsers(users.filter(u => u.id !== id));
            enqueueSnackbar('Đã xóa nhân viên!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Lỗi xóa!', { variant: 'error' });
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    QUẢN LÝ NHÂN VIÊN
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                    Thêm nhân viên
                </Button>
            </Box>

            <Paper elevation={2}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tài khoản</TableCell>
                            <TableCell>Quyền hạn (Role)</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PersonIcon color="action" /> 
                                        <b>{user.username}</b>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {user.role === 'Admin' ? (
                                        <Chip icon={<SecurityIcon />} label="Quản trị viên" color="error" size="small" />
                                    ) : (
                                        <Chip label="Nhân viên Sales" color="primary" variant="outlined" size="small" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* DIALOG THÊM MỚI */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Cấp tài khoản mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth label="Tên đăng nhập" 
                                value={newUser.username}
                                onChange={e => setNewUser({...newUser, username: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth label="Mật khẩu" type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                select fullWidth label="Phân quyền"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <MenuItem value="Staff">Nhân viên (Sales)</MenuItem>
                                <MenuItem value="Admin">Quản trị viên (Admin)</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleCreate}>Tạo tài khoản</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
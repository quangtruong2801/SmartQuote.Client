import { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
    IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    MenuItem 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { userService, type User, type CreateUserRequest } from '../services/userService';

export const UsersPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    const { t } = useTranslation();
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
            enqueueSnackbar(t('users:pleaseEnterAllInformation'), { variant: 'warning' });
            return;
        }
        try {
            await userService.create(newUser);
            enqueueSnackbar(t('users:createAccountSuccess'), { variant: 'success' });
            setOpenDialog(false);
            setNewUser({ username: '', password: '', role: 'Staff' }); // Reset form
            userService.getAll().then(setUsers);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('users:errorCreatingAccount'), { variant: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('users:confirmDeleteAccount'))) return;
        try {
            await userService.delete(id);
            setUsers(users.filter(u => u.id !== id));
            enqueueSnackbar(t('users:employeeDeleted'), { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(t('users:errorDeleting'), { variant: 'error' });
        }
    };

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

            <Paper elevation={2}>
                <Table>
                    <TableHead sx={{ bgcolor: '#eee' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{t('users:username')}</TableCell>
                            <TableCell>{t('users:role')}</TableCell>
                            <TableCell align="center">{t('users:actions')}</TableCell>
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
                                        <Chip icon={<SecurityIcon />} label={t('users:admin')} color="error" size="small" />
                                    ) : (
                                        <Chip label={t('users:salesEmployee')} color="primary" variant="outlined" size="small" />
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
                    <Button onClick={() => setOpenDialog(false)}>{t('users:cancel')}</Button>
                    <Button variant="contained" onClick={handleCreate}>{t('users:createAccount')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
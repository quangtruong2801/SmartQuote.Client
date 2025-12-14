import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate } from '@tanstack/react-router';
import axiosClient from '../api/axiosClient';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async () => {
        try {
            // Gọi API Login của Backend
            const response = await axiosClient.post('/Auth/login', {
                username: username,
                password: password
            });
            // Backend trả về chuỗi Token (string)
            const token = response.data;
            // 1. Lưu Token vào LocalStorage
            localStorage.setItem('ACCESS_TOKEN', token);
            enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
            // 2. Chuyển hướng vào Dashboard
            navigate({ to: '/' });
            
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Sai tên đăng nhập hoặc mật khẩu!', { variant: 'error' });
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Typography component="h1" variant="h5" color="primary" fontWeight="bold">
                    SMART QUOTE
                </Typography>
                <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
                    Đăng Nhập
                </Typography>
                
                <Box component="form" sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal" required fullWidth label="Tài khoản" autoFocus
                        value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Mật khẩu" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <Typography color="error" variant="body2">{error}</Typography>}

                    <Button
                        fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        Đăng Nhập
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};
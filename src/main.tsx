import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CssBaseline />
      
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Hiện ở góc trên phải
        autoHideDuration={2000} // Tự tắt sau 2 giây
      >
        <RouterProvider router={router} />
      </SnackbarProvider>

    </ThemeProvider>
  </React.StrictMode>,
);
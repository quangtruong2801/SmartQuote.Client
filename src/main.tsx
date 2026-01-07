import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import './i18n';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Hiện ở góc trên phải
        autoHideDuration={3000} // Tự tắt sau 3 giây
      >
        <RouterProvider router={router} />
      </SnackbarProvider>

    </ThemeProvider>
  </React.StrictMode>,
);
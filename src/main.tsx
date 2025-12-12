import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Tạo theme mặc định cho MUI
const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS chuẩn MUI */}
      
      {/* Cung cấp Router cho toàn app */}
      <RouterProvider router={router} />
      
    </ThemeProvider>
  </React.StrictMode>,
);
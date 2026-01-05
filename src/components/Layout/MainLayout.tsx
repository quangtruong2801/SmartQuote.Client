import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Box, Toolbar } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Truyền hàm toggle xuống Header */}
      <Header toggleDrawer={toggleDrawer} />

      {/* Truyền trạng thái open xuống Sidebar */}
      <Sidebar open={open} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', overflow: 'hidden' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
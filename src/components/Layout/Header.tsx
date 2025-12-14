import { Link, useNavigate } from "@tanstack/react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider
} from "@mui/material";

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';

import { isAdmin } from "../../utils/auth";

export const Header = () => {
  const navigate = useNavigate();
  const userIsAdmin = isAdmin();

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    navigate({ to: "/login" });
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mr: 4 }}
        >
          SmartQuote Admin
        </Typography>

        {/* MENU CHÍNH */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} to="/" startIcon={<DashboardIcon />}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/materials" startIcon={<InventoryIcon />}>
            Vật tư
          </Button>
          <Button color="inherit" component={Link} to="/products" startIcon={<CategoryIcon />}>
            Sản phẩm
          </Button>
          <Button color="inherit" component={Link} to="/customers" startIcon={<PeopleIcon />}>
            Khách hàng
          </Button>
          <Button color="inherit" component={Link} to="/quotations" startIcon={<RequestQuoteIcon />}>
            Báo giá
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* MENU ADMIN */}
        {userIsAdmin && (
          <Button
            color="warning"
            variant="outlined"
            component={Link}
            to="/users"
            startIcon={<SecurityIcon />}
            sx={{
              mr: 2,
              borderColor: 'rgba(255,255,255,0.6)',
              color: 'white'
            }}
          >
            Quản lý nhân viên
          </Button>
        )}

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
        />

        {/* LOGOUT */}
        <Button color="inherit" onClick={handleLogout} endIcon={<LogoutIcon />}>
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
};

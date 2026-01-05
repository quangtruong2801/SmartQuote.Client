import { useNavigate } from "@tanstack/react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    navigate({ to: "/login" });
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          SmartQuote Admin
        </Typography>

        <Button color="inherit" onClick={handleLogout} endIcon={<LogoutIcon />}>
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
};
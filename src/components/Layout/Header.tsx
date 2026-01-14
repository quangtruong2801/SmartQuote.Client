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
import { LanguageSwitcher } from '../Common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '../Common/ThemeSwitcher';

interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          {t('header:smartquoteAdmin')}
        </Typography>

        <ThemeSwitcher />
        <LanguageSwitcher />

        <Button color="inherit" onClick={handleLogout} endIcon={<LogoutIcon />}>
          {t('header:logout')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
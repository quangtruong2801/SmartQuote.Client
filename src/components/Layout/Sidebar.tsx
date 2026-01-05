import { Link } from "@tanstack/react-router";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  type CSSObject,
  type Theme,
  styled,
  Tooltip
} from "@mui/material";

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SecurityIcon from '@mui/icons-material/Security';

import { isAdmin } from "../../utils/auth";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

interface SidebarProps {
  open: boolean;
}

export const Sidebar = ({ open }: SidebarProps) => {
  const userIsAdmin = isAdmin();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { text: "Vật tư", icon: <InventoryIcon />, to: "/materials" },
    { text: "Sản phẩm", icon: <CategoryIcon />, to: "/products" },
    { text: "Khách hàng", icon: <PeopleIcon />, to: "/customers" },
    { text: "Báo giá", icon: <RequestQuoteIcon />, to: "/quotations" },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar />
      

      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? item.text : ""} placement="right">
              <ListItemButton
                component={Link}
                to={item.to}
                activeProps={{ 
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRight: '4px solid #1976d2' } 
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {userIsAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
               <Tooltip title={!open ? "Quản lý nhân viên" : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to="/users"
                  activeProps={{ 
                      style: { backgroundColor: 'rgba(237, 108, 2, 0.1)', borderRight: '4px solid #ed6c02' } 
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <SecurityIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý nhân viên" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );
};
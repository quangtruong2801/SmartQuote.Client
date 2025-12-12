import { Outlet, Link } from '@tanstack/react-router';
import { AppBar, Toolbar, Typography, Container, Button} from '@mui/material';

export const MainLayout = () => {
  return (
    <>
      {/* Header/Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartQuote Admin
          </Typography>
          
          {/* Link của TanStack Router cực mạnh, nó sẽ báo lỗi đỏ nếu bạn gõ sai đường dẫn */}
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/materials">
            Vật tư
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Sản phẩm
          </Button>
        </Toolbar>
      </AppBar>

      {/* Nơi nội dung các trang con hiển thị */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet /> 
      </Container>
    </>
  );
};
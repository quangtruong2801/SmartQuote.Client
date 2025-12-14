import { Outlet } from "@tanstack/react-router";
import { Container, Box } from "@mui/material";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <Box minHeight="100vh" bgcolor="#f9fafb">
      <Header />

      {/* Content */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

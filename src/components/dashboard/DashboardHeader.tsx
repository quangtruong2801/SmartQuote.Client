import { Box, Typography } from '@mui/material';

export const DashboardHeader = () => (
  <Box mb={4}>
    <Typography variant="h4" fontWeight="bold">
      TỔNG QUAN KINH DOANH
    </Typography>
    <Typography color="text.secondary">
      Hệ thống quản lý báo giá thông minh.
    </Typography>
  </Box>
);

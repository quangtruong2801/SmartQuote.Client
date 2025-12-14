import { Box, Typography } from '@mui/material';

export const EmptyState = () => {
  return (
    <Box
      height={450}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color="text.secondary" align="center">
        Chưa có dữ liệu doanh thu trong 7 ngày qua.
        <br />
        Hãy tạo và duyệt báo giá để bắt đầu.
      </Typography>
    </Box>
  );
};

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  return (
  <Box mb={4}>
    <Typography variant="h4" fontWeight="bold">
      {t('dashboard:totalRevenue')}
    </Typography>
    <Typography color="text.secondary">
      {t('dashboard:smartquoteSystem')}
    </Typography>
  </Box>
);
};

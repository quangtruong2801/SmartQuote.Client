import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
export const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <Box
      height={450}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color="text.secondary" align="center">
        {t('dashboard:noRevenueData')}
        <br />
        {t('dashboard:createAndApproveQuotations')}
      </Typography>
    </Box>
  );
};

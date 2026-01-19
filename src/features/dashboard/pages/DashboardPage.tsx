import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { RevenueChart } from '../components/RevenueChart';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { useTranslation } from 'react-i18next';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) return null;

  return (
    <>
      <DashboardHeader />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalRevenue')}
            value={formatCurrency(data.totalRevenue)}
            icon={<AttachMoneyIcon />}
            color="#10b981"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalQuotations')}
            value={data.totalQuotations}
            icon={<ShoppingCartIcon />}
            color="#3b82f6"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalCustomers')}
            value={data.totalCustomers}
            icon={<PeopleIcon />}
            color="#f59e0b"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalProducts')}
            value={data.totalProducts}
            icon={<InventoryIcon />}
            color="#ec4899"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RevenueChart data={data.chartData} />
        </Grid>
      </Grid>
    </>
  );
};

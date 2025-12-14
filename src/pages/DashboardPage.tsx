import { useEffect, useState } from 'react';
import Grid from '@mui/material/GridLegacy';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';

import { dashboardService, type DashboardSummary } from '../features/dashboard/services/dashboardService';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage = () => {
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doanh thu"
            value={formatCurrency(data.totalRevenue)}
            icon={<AttachMoneyIcon />}
            color="#10b981"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Đơn hàng"
            value={data.totalQuotations}
            icon={<ShoppingCartIcon />}
            color="#3b82f6"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Khách hàng"
            value={data.totalCustomers}
            icon={<PeopleIcon />}
            color="#f59e0b"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sản phẩm mẫu"
            value={data.totalProducts}
            icon={<InventoryIcon />}
            color="#ec4899"
          />
        </Grid>

        <Grid item xs={12}>
          <RevenueChart data={data.chartData} />
        </Grid>
      </Grid>
    </>
  );
};

import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import {Box, Stack, ToggleButton, ToggleButtonGroup} from '@mui/material';

// Icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

// Date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { vi } from 'date-fns/locale';
import {subDays, startOfMonth, endOfMonth, parseISO, isValid} from 'date-fns';

import { useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { RevenueChart } from '../components/RevenueChart';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { useTranslation } from 'react-i18next';

type QuickFilter = '7d' | '30d' | 'month';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  /* -------------------- STATE -------------------- */
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter | null>(null);

  /* -------------------- DATE FROM URL (SAFE) -------------------- */
  const startDate = useMemo(() => {
    const from = searchParams.get('from');
    const parsed = from ? parseISO(from) : null;
    return parsed && isValid(parsed) ? parsed : subDays(new Date(), 30);
  }, [searchParams]);

  const endDate = useMemo(() => {
    const to = searchParams.get('to');
    const parsed = to ? parseISO(to) : null;
    return parsed && isValid(parsed) ? parsed : new Date();
  }, [searchParams]);

  /* -------------------- AUTO DETECT QUICK FILTER -------------------- */
  useEffect(() => {
    const now = new Date();

    const isSameRange = (from: Date, to: Date) =>
      Math.abs(to.getTime() - endDate.getTime()) < 1000 &&
      Math.abs(from.getTime() - startDate.getTime()) < 1000;

    if (isSameRange(subDays(now, 7), now)) setQuickFilter('7d');
    else if (isSameRange(subDays(now, 30), now)) setQuickFilter('30d');
    else if (
      isSameRange(startOfMonth(now), endOfMonth(now))
    )
      setQuickFilter('month');
    else setQuickFilter(null);
  }, [startDate, endDate]);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dashboardService.getSummary(
          startDate,
          endDate
        );
        if (!ignore) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [startDate, endDate]);

  /* -------------------- QUICK FILTER -------------------- */
  const applyQuickFilter = (type: QuickFilter) => {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    switch (type) {
      case '7d':
        from = subDays(now, 7);
        break;
      case '30d':
        from = subDays(now, 30);
        break;
      case 'month':
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
    }

    setSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });
  };

  /* -------------------- UI -------------------- */
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <DashboardHeader />

      {/* -------- FILTER BAR -------- */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Quick filter */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={quickFilter}
          onChange={(_, v) => v && applyQuickFilter(v)}
        >
          <ToggleButton value="7d">7 ngày</ToggleButton>
          <ToggleButton value="30d">30 ngày</ToggleButton>
          <ToggleButton value="month">Tháng này</ToggleButton>
        </ToggleButtonGroup>

        {/* Date picker */}
        <Stack direction="row" spacing={2}>
          <DatePicker
            label={t('dashboard:fromDate')}
            value={startDate}
            onChange={(date) => {
              if (!date) return;
              setSearchParams({
                from: date.toISOString(),
                to: endDate.toISOString(),
              });
            }}
            format="dd/MM/yyyy"
            slotProps={{
              textField: { size: 'small', sx: { width: 150 } },
            }}
          />

          <DatePicker
            label={t('dashboard:toDate')}
            value={endDate}
            onChange={(date) => {
              if (!date) return;
              setSearchParams({
                from: startDate.toISOString(),
                to: date.toISOString(),
              });
            }}
            format="dd/MM/yyyy"
            slotProps={{
              textField: { size: 'small', sx: { width: 150 } },
            }}
          />
        </Stack>
      </Box>

      {/* -------- STATS -------- */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalRevenue')}
            value={formatCurrency(data?.totalRevenue ?? 0)}
            icon={<AttachMoneyIcon />}
            color="#10b981"
          />

        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalQuotations')}
            value={data?.totalQuotations ?? 0}
            icon={<ShoppingCartIcon />}
            color="#3b82f6"
          />

        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalCustomers')}
            value={data?.totalCustomers ?? 0}
            icon={<PeopleIcon />}
            color="#f59e0b"
          />

        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t('dashboard:totalProducts')}
            value={data?.totalProducts ?? 0}
            icon={<InventoryIcon />}
            color="#ec4899"
          />

        </Grid>

        {/* -------- CHART -------- */}
        <Grid size={{ xs: 12 }}>
          <RevenueChart data={loading ? [] : data?.chartData ?? []} />
        </Grid>

      </Grid>
    </LocalizationProvider>
  );
};

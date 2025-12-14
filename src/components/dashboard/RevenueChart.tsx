import { Paper, Typography} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from './EmptyState';

interface RevenueItem {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueItem[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  if (!data.length) {
    return <EmptyState />;
  }

  const chartData = data.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'dd/MM')
  }));

  return (
    <Paper sx={{ p: 3, height: 450 }}>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        Biểu đồ doanh thu (7 ngày gần nhất)
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="displayDate" />
          <YAxis
            width={80}
            tickFormatter={(value) =>
              new Intl.NumberFormat('vi-VN', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Ngày: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            fill="url(#colorRevenue)"
            name="Doanh thu"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

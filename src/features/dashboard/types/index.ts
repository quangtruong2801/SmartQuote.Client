export type ChartDataPoint = {
    date: string;
    revenue: number;
}

export type DashboardSummary = {
    totalRevenue: number;
    totalQuotations: number;
    totalCustomers: number;
    totalProducts: number;
    chartData: ChartDataPoint[];
}
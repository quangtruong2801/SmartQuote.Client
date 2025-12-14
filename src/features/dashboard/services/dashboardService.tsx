import axiosClient from "../../../api/axiosClient";

export interface ChartDataPoint {
    date: string;
    revenue: number;
}

export interface DashboardSummary {
    totalRevenue: number;
    totalQuotations: number;
    totalCustomers: number;
    totalProducts: number;
    chartData: ChartDataPoint[];
}

export const dashboardService = {
    getSummary: async () => {
        const response = await axiosClient.get<DashboardSummary>('/Dashboard/summary');
        return response.data;
    }
};
import axiosClient from '../../../api/axiosClient';
import type { DashboardSummary } from '../types';

export const dashboardService = {
  // Thêm tham số optional
  getSummary: async (fromDate?: Date, toDate?: Date) => {
    const params: Record<string, string> = {};
    
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();

    const response = await axiosClient.get<DashboardSummary>('/Dashboard/summary', { params });
    return response.data;
  },
};
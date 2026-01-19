import axiosClient from "../../../api/axiosClient";
import type { DashboardSummary } from "../types";

export const dashboardService = {
    getSummary: async () => {
        const response = await axiosClient.get<DashboardSummary>('/Dashboard/summary');
        return response.data;
    }
};
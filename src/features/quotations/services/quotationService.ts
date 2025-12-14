import axiosClient from "../../../api/axiosClient";
import type { QuotationListDto, QuotationCreateDto, QuotationDetailDto, QuotationStatus } from "../types";
const mapStatusToInt = (status: QuotationStatus): number => {
    switch (status) {
        case 'Draft': return 0;
        case 'Sent': return 1;
        case 'Approved': return 2;
        case 'Rejected': return 3;
        default: return 0; // Mặc định là Draft
    }
};
export const quotationService = {
    getAll: async () => {
        const response = await axiosClient.get<QuotationListDto[]>('/Quotations');
        return response.data;
    },
    create: async (data: QuotationCreateDto) => {
        const response = await axiosClient.post<QuotationDetailDto>('/Quotations', data);
        return response.data;
    },
    getById: async (id: number) => { // Để in ấn sau này
        const response = await axiosClient.get<QuotationDetailDto>(`/Quotations/${id}`);
        return response.data;
    },
    updateStatus: async (id: number, statusStr: QuotationStatus) => {
        // Chuyển đổi string ('Sent') thành int (1)
        const statusInt = mapStatusToInt(statusStr);

        // Gửi object JSON lên backend
        await axiosClient.put(`/Quotations/${id}/status`, { status: statusInt }); 
    }
};
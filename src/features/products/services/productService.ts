import axiosClient from "../../../api/axiosClient";
import type { ProductTemplate, ProductCreateDto } from "../types";

export const productService = {
    getAll: async () => {
        const response = await axiosClient.get<ProductTemplate[]>('/ProductTemplates');
        return response.data;
    },

    create: async (data: ProductCreateDto) => {
        const response = await axiosClient.post<ProductTemplate>('/ProductTemplates', data);
        return response.data;
    },

    delete: async (id: number) => {
        await axiosClient.delete(`/ProductTemplates/${id}`);
    }
};
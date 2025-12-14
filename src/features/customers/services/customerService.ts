import axiosClient from "../../../api/axiosClient";
import type { Customer, CustomerCreateDto } from "../types";

export const customerService = {
    getAll: async () => {
        const response = await axiosClient.get<Customer[]>('/Customers');
        return response.data;
    },
    create: async (data: CustomerCreateDto) => {
        const response = await axiosClient.post<Customer>('/Customers', data);
        return response.data;
    },
    update: async (id: number, data: Customer) => {
        await axiosClient.put(`/Customers/${id}`, data);
    },

    delete: async (id: number) => {
        await axiosClient.delete(`/Customers/${id}`);
    }
};
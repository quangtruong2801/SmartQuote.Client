import axiosClient from "../../../api/axiosClient";
import type { User, CreateUserRequest } from "../types";

export const userService = {
    getAll: async () => {
        const response = await axiosClient.get<User[]>('/Users');
        return response.data;
    },

    create: async (data: CreateUserRequest) => {
        await axiosClient.post('/Users', data);
    },

    delete: async (id: number) => {
        await axiosClient.delete(`/Users/${id}`);
    }
};
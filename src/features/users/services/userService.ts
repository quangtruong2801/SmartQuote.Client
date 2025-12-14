import axiosClient from "../../../api/axiosClient";

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    role: string;
}

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
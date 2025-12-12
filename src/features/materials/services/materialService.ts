import axiosClient from '../../../api/axiosClient';
import type { Material, MaterialCreateDto } from '../types';

export const materialService = {
    getAll: async () => {
        const response = await axiosClient.get<Material[]>('/Materials');
        return response.data;
    },

    create: async (data: MaterialCreateDto) => {
        const response = await axiosClient.post<Material>('/Materials', data);
        return response.data;
    },

    update: async (id: number, data: Material) => {
      // PUT yêu cầu gửi cả ID trên URL và trong Body
      await axiosClient.put(`/Materials/${id}`, data);
  },

  delete: async (id: number) => {
      await axiosClient.delete(`/Materials/${id}`);
  }
};
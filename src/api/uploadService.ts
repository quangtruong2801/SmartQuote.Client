import axiosClient from "./axiosClient";

export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<{ url: string }>('/Upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    }
};
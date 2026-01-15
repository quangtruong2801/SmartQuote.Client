import axiosClient from "./axiosClient";

export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosClient.post<{
            url: string;
            publicId: string;
        }>("/Upload/image", formData,
            {
                headers: {
                    'Content-Type': undefined,
                },
            }
        );

        return response.data;
    }
};

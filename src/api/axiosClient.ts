import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7283/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR ---
axiosClient.interceptors.request.use(
    (config) => {
        // 1. Lấy token từ bộ nhớ
        const token = localStorage.getItem('ACCESS_TOKEN');
        
        // 2. Nếu có token, đính kèm vào Header: Authorization: Bearer eyJ...
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// (Tùy chọn) Xử lý khi Token hết hạn (401) -> Tự động đá ra trang Login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Xóa token cũ
            localStorage.removeItem('ACCESS_TOKEN');
            // Chuyển hướng về trang login (Dùng window.location cho đơn giản)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
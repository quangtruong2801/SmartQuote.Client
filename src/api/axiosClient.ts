import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7207/api', // Thay port của bạn vào đây
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
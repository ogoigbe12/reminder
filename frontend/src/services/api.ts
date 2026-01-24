import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = 'https://reminder-backend-taip.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

import axios from 'axios';

// ============================================
// Axios Instance with JWT Interceptor
// ============================================
// All API calls go through this instance.
// The request interceptor automatically attaches
// the JWT token from localStorage to every request.

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Send cookies with requests
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Token expired or invalid — redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Only redirect if not already on auth pages
                if (!window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

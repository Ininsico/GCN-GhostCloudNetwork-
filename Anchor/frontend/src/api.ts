import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getClusters = () => api.get('/clusters').then(res => res.data);
export const createCluster = (data: any) => api.post('/clusters', data).then(res => res.data);
export const deleteCluster = (id: string) => api.delete(`/clusters/${id}`).then(res => res.data);

export const getNodes = () => api.get('/nodes').then(res => res.data);
export const registerNode = (data: any) => api.post('/nodes/register', data).then(res => res.data);

export const getAvailableCompute = () => api.get('/compute/available').then(res => res.data);

export default api;

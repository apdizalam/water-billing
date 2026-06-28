import axios from 'axios';

export const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const applyAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

applyAuthHeader();

api.interceptors.request.use((config) => {
  applyAuthHeader();
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }
};

export const customerService = {
  getCustomers: () => axios.get(`${API_BASE}/customers`, { withCredentials: true }).then((res) => res.data),
  createCustomer: (data) => axios.post(`${API_BASE}/customers`, data, { withCredentials: true }).then((res) => res.data),
  updateCustomer: (id, data) => axios.put(`${API_BASE}/customers/${id}`, data, { withCredentials: true }).then((res) => res.data),
  deleteCustomer: (id) => axios.delete(`${API_BASE}/customers/${id}`, { withCredentials: true }).then((res) => res.data),
};

export const meterService = {
  getMeters: () => axios.get(`${API_BASE}/meters`, { withCredentials: true }).then((res) => res.data),
  createMeter: (data) => axios.post(`${API_BASE}/meters`, data, { withCredentials: true }).then((res) => res.data),
  updateMeter: (id, data) => axios.put(`${API_BASE}/meters/${id}`, data, { withCredentials: true }).then((res) => res.data),
  deleteMeter: (id) => axios.delete(`${API_BASE}/meters/${id}`, { withCredentials: true }).then((res) => res.data),
  getLatestMeterReading: ({ supplyNo, customerId }) =>
    axios
      .get(
        `${API_BASE}/meters/latest${
          supplyNo
            ? `?supplyNo=${encodeURIComponent(supplyNo)}`
            : customerId
              ? `?customerId=${encodeURIComponent(customerId)}`
              : ''
        }`,
        { withCredentials: true }
      )
      .then((res) => res.data),
};

export const billService = {
  getBills: () => axios.get(`${API_BASE}/billing`, { withCredentials: true }).then((res) => res.data),
  createBill: (data) => axios.post(`${API_BASE}/billing`, data, { withCredentials: true }).then((res) => res.data),
  updateBill: (id, data) => axios.put(`${API_BASE}/billing/${id}`, data, { withCredentials: true }).then((res) => res.data),
  deleteBill: (id) => axios.delete(`${API_BASE}/billing/${id}`, { withCredentials: true }).then((res) => res.data),
};

export const transactionService = {
  getTransactions: () => axios.get(`${API_BASE}/transactions`, { withCredentials: true }).then((res) => res.data),
};

export const dashboardService = {
  getStats: () => axios.get(`${API_BASE}/dashboard/stats`, { withCredentials: true }).then((res) => res.data),
};

export const managerService = {
  getManagers: () => axios.get(`${API_BASE}/managers`, { withCredentials: true }).then((res) => res.data),
  registerManager: (data) => axios.post(`${API_BASE}/managers`, data, { withCredentials: true }).then((res) => res.data),
  updateManager: (id, data) => axios.put(`${API_BASE}/managers/${id}`, data, { withCredentials: true }).then((res) => res.data),
  deleteManager: (id) => axios.delete(`${API_BASE}/managers/${id}`, { withCredentials: true }).then((res) => res.data),
};

export const authService = {
  login: (data) => axios.post(`${API_BASE}/auth/login`, data, { withCredentials: true }).then((res) => res.data),
};

export default api;

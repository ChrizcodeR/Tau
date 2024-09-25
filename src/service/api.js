import axios from 'axios';

const API_URL = 'https://backendlaravel-production-39e7.up.railway.app/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Permitir el manejo de cookies
axios.defaults.withCredentials = true;

//export const fetchCsrfToken = () => {
//  return api.get('/sanctum/csrf-cookie');
//};

export default api;

import axios from "axios";

const api = axios.create({
    baseURL: 'http://107.6.54.56:8080'
});

// Obtener el token del almacenamiento local
const token = JSON.parse(localStorage.getItem("token")) || null;

// Configurar el interceptor para añadir el token a los encabezados de las solicitudes
api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
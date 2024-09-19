import axios from "axios";

const api = axios.create({
    baseURL: 'https://backendlaravel-production-39e7.up.railway.app/'
});

// Obtener el token del almacenamiento local
//const token = JSON.parse(localStorage.getItem("token")) || null;

// Configurar el interceptor para añadir el token a los encabezados de las solicitudes
//api.interceptors.request.use(config => {
//   return config;
//});

export default api;
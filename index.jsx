import axios from 'axios';

// Verificar si el token CSRF está disponible
const metaTag = document.querySelector('meta[name="csrf-token"]');
if (metaTag) {
    const token = metaTag.getAttribute('content');
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
} else {
    console.error('CSRF token meta tag not found.');
}

// Configurar la URL base de Axios
axios.defaults.baseURL = 'https://backendlaravel-production-39e7.up.railway.app';

const AttendanceService = {
    async validate(codigo_tr) {
        try {
            const response = await axios.get("/admin/empleados");
            const empleados = response.data.empleados;
            return empleados.find(empleado => empleado.codigo_empleado === codigo_tr) !== undefined;
        } catch (error) {
            console.error("Error obteniendo la lista de empleados:", error);
            throw error;
        }
    },

    async createArrival(data) {
        try {
            const response = await axios.post("/asistencia/registrar", data);
            return response.data;
        } catch (error) {
            console.error("Error creando la llegada:", error);
            throw error;
        }
    }
};

export { AttendanceService };

import axios from "axios";

// Configurar el token CSRF en Axios
const token = axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Configura Axios para incluir el token CSRF en todas las solicitudes
axios.defaults.headers.common['X-CSRF-TOKEN'] = token;

// Configurar la URL base de Axios
axios.defaults.baseURL = 'https://backendlaravel-production-39e7.up.railway.app';

const AttendanceService = {
  async validate(codigo_tr) {
    try {
      const response = await axios.get("admin/empleados");
      const empleados = response.data.empleados; // Asegúrate de acceder a `empleados` correctamente
      return empleados.find(empleado => empleado.codigo_empleado === codigo_tr) !== undefined;
    } catch (error) {
      console.error("Error obteniendo la lista de empleados:", error);
      throw error;
    }
  },

  async createArrival(data) {
    try {
      const response = await axios.post("asistencia/registrar", data);
      return response.data;
    } catch (error) {
      console.error("Error creando la llegada:", error);
      throw error;
    }
  }
};

export { AttendanceService };

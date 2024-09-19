import axios from 'axios';

const API_URL = 'https://backendlaravel-production-39e7.up.railway.app';

export const AttendanceService = {
  validate: async (codigo_tr) => {
    try {
      const response = await axios.get(`${API_URL}/admin/empleados`);
      const empleados = response.data;
      const empleadoEncontrado = empleados.find(empleado => empleado.codigo_tr === codigo_tr);
      return !!empleadoEncontrado;
    } catch (error) {
      console.error('Error obteniendo la lista de empleados:', error);
      throw error;
    }
  },

  createArrival: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/asistencia/registrar`, data);
      return response.data;
    } catch (error) {
      console.error('Error registrando la asistencia:', error);
      throw error;
    }
  }
};

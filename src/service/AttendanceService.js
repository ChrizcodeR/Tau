import api from './api';

export const AttendanceService = {
  validate: async (codigo_tr) => {
    const token = localStorage.getItem('authToken'); // Obtener el token
    const response = await api.get('/admin/empleados', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token a la cabecera
      },
      params: { codigo_tr }, // Pasar el código como parámetro
    });
    return response.data.isValid;
  },

  createArrival: async (requestData) => {
    const token = localStorage.getItem('authToken'); // Obtener el token
    const response = await api.post('/asistencia/registrar', requestData, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token a la cabecera
      },
    });
    return response.data;
  },
};

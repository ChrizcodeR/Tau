import api from './api';

export const AttendanceService = {
  validate: async (codigo_tr) => {
    const token = localStorage.getItem('authToken'); // Obtener el token
    await fetchCsrfToken();
    const response = await api.post('/validate', { codigo_tr }, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
      },
    });
    return response.data.isValid;
  },

  createArrival: async (requestData) => {
    const token = localStorage.getItem('authToken'); // Obtener el token
    await fetchCsrfToken();
    const response = await api.post('/createArrival', requestData, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
      },
    });
    return response.data;
  },
};

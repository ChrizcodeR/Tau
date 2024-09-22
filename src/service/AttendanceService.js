import api from './api';

export const AttendanceService = {
  getEmployees: async () => {
    const token = localStorage.getItem('authToken'); // Obtener el token
    const response = await api.get('/admin/empleados', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token a la cabecera
      },
    });
    return response.data; // Devolver la lista completa de empleados
  },

  validateAndCreateArrival: async (codigo_tr, requestData) => {
    const employees = await AttendanceService.getEmployees(); // Obtener la lista de empleados
    const employee = employees.find(emp => emp.codigo_tr === codigo_tr);

    if (employee) {
      console.log('Empleado válido:', employee);

      // Registrar la asistencia
      const token = localStorage.getItem('authToken'); // Obtener el token
      const response = await api.post('/asistencia/registrar', requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token a la cabecera
        },
      });
      return response.data;
    } else {
      throw new Error('El código no existe');
    }
  },
};

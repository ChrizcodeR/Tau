import api from "./api";
import AuthService from "./AuthService";

export const AttendanceService = {
  // Método para iniciar sesión y obtener el token
  login: async (email, password) => {
    await AuthService.login(email, password);
  },

  getEmployees: async () => {
    const token = AuthService.getToken();
    if (!token) throw new Error("No token found");

    const response = await api.get("/admin/empleados", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  validateAndCreateArrival: async (codigo_tr, requestData) => {
    try {
      // Lista de empleados del AttendanceService
      const response = await AttendanceService.getEmployees();

      // Accede a los empleados desde la respuesta
      const employees = response.empleados; 
      const employee = employees.find((emp) => emp.codigo_empleado === codigo_tr); 

      if (employee) {
        console.log("Empleado válido:", employee);

        // Registrar la asistencia
        const token = AuthService.getToken();
        const response = await api.post("/asistencia/registrar", requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } else {
        throw new Error("El código no existe");
      }
    } catch (error) {
      console.error(
        "Error en la validación y creación de llegada:",
        error.message
      );
      throw error; // Emvia el error para manejarlo en el componente
    }
  },
};

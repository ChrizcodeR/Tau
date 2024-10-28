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

    const response = await api.get("/empleados/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  validateAndCreateArrival: async (codigo_tr, requestData) => {
    try {
      console.log("Datos recibidos", codigo_tr, requestData);
  
      // Lista de empleados del AttendanceService
      const employees = await AttendanceService.getEmployees(); // Cambiar aquí
      console.log("Respuesta de empleados:", employees); // Verifica la respuesta
  
      const employee = employees.find(
        (emp) => emp.codigo_empleado === codigo_tr
      );
  
      if (employee) {
        console.log("Empleado válido:", employee);
        
        const requestDataJSON = JSON.stringify(requestData);
        console.log("Datos a enviar a registrar:", requestDataJSON);
  
        // Registrar la asistencia
        const token = AuthService.getToken();
        const response = await api.post("/asistencia/registrar", requestDataJSON, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Respues Endponit resgistrar:", JSON.stringify(response.data, null, 2));
      
        return response.data;
        
      } else {
        throw new Error("El código no existe");
      }
    } catch (error) {
      console.error("Error en la validación y creación de llegada:", error.message);
      //throw error; // Envía el error para manejarlo en el componente
      throw new Error(error);
    }
  },
};
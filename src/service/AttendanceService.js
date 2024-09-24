import api from "./api";
import AuthService from "./AuthService";

export const AttendanceService = {
  // Método para iniciar sesión y obtener el token
  login: async (email, password) => {
    await AuthService.login(email, password);
  },

 /* getEmployees: async () => {
    const token = AuthService.getToken();
    if (!token) throw new Error("No token found");

    const response = await api.get("/empleados", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }, */

  validateAndCreateArrival: async (codigo_tr, requestData) => {
    try {

      console.log("Datos recibidos", requestData);

      if (codigo_tr) {
        console.log("Empleado válido:", codigo_tr);

        const requestDataJSON = JSON.stringify(requestData);
        // Ver datos que se enviarán
        console.log("Datos a enviar a registrar:", JSON.stringify(requestData, null, 2));

        // Registrar la asistencia
        const token = AuthService.getToken();
        const response = await api.post("/asistencia/registrar", requestDataJSON, {
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

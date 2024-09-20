import axios from "axios";

const AttendanceService = {
  async validate(codigo_tr) {
    try {
      const response = await axios.get("/api/empleados");
      const empleados = response.data.empleados; // Asegúrate de acceder a `empleados` correctamente
      return empleados.find(empleado => empleado.codigo_empleado === codigo_tr) !== undefined;
    } catch (error) {
      console.error("Error obteniendo la lista de empleados:", error);
      throw error;
    }
  },

  async createArrival(data) {
    try {
      const response = await axios.post("/api/attendance", data);
      return response.data;
    } catch (error) {
      console.error("Error creando la llegada:", error);
      throw error;
    }
  }
};

export { AttendanceService };

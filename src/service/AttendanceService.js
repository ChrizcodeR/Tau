import axios from "axios";

const AttendanceService = {
  async validate(codigo_tr) {
    try {
      const response = await axios.get("/api/empleados");
      const empleados = response.data; // Asegúrate de que `response.data` sea un array
      return empleados.find(empleado => empleado.codigo_tr === codigo_tr) !== undefined;
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

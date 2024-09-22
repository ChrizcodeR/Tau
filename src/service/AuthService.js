import api from './api';

// Declarar las credenciales aquí
const email = "angeldev@gmail.com";
const password = "12345678";

const AuthService = {
  login: async () => {
    const response = await api.post('/login', { email, password });
    console.log("Datos enviados:", JSON.stringify(response)); // validar que esta llegando
    // Guardar el token en el localStorage
    if (response.data.status) {
      localStorage.setItem('authToken', response.data.token);
      return response.data.token;
    } else {
      throw new Error(response.data.message);
    }
  },

  logout: async () => {
    const token = localStorage.getItem('authToken');
    await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('authToken');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },
};

// Llama al método de inicio de sesión
const loginAndUseToken = async () => {
  try {
    const token = await AuthService.login();
    console.log('Token:', token);
    // Aquí puedes usar el token para las solicitudes de AttendanceService
  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

// Llama a la función de inicio de sesión
loginAndUseToken();

export default AuthService;

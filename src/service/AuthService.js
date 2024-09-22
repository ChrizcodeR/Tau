import api from './api';

// Enviar las credenciales y obtener el token
const email = "angeldev@gmail.com";
const password = "12345678";

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    console.log(response.data.token) // validar que esta llegando
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

const loginAndUseToken = async () => {
  try {
    const token = await AuthService.login(email, password);
    console.log('Token:', token);
    // Aquí puedes usar el token para las solicitudes de AttendanceService
  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

// Llama a la función de inicio de sesión
loginAndUseToken();

export default AuthService;

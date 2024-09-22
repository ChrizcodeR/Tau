import api from './api';

const AuthService = {

  login: async (email, password) => {

    // Enviar las credenciales y obtener el token
    const email = "angeldev@gmail.com";
    const password = "12345678";

    const response = await api.post('/login', { email, password });

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

// Exportar el servicio de autenticación
export default AuthService;

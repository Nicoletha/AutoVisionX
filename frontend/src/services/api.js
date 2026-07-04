import axios from 'axios';

// Base URL del backend ASP.NET Core.
// En desarrollo, Vite hace proxy de /api hacia el backend (ver vite.config.js).
// En producción, define VITE_API_BASE_URL en tu archivo .env
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      'Ocurrió un error al conectar con el servidor.';
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default api;

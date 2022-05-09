import axios from 'axios';
import { toastError } from 'src/utils/toast';
import clearStorage from 'src/utils/clearLocalStorage';

//const herokuUrl = 'https://api-pecuaria.herokuapp.com'
const railwayUrl = 'https://api-dominio-pecuaria-production-fca7.up.railway.app'
export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : railwayUrl;
// export const baseURL = 'https://api-pecuaria.herokuapp.com';

const instance = axios.create({
  baseURL
});

const StatusConflict = 409;

instance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.log(error.response?.data);

  if (error?.response?.status === 403) {
    toastError('Sessão expirada, necessario novo login');
    clearStorage();
    window.location.reload();
    return;
  }

  if (error?.response?.status === StatusConflict) {
    toastError('Conflito ao salvar o registro');
    return;
  }

  if (!error.response) {
    toastError('Erro interno');
    throw error;
  }

  const messages = error.response.data.details || null;
  if (messages) {
    messages.forEach((element) => {
      toastError(element);
    });
  }

  throw error;
});

export default instance;

import axios from 'axios';
import { toastError } from 'src/utils/toast';

export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api-pecuaria.herokuapp.com';
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
    console.log('403');
    toastError('Houve um problema com sua autenticação');
    localStorage.clear();
    window.location.reload();
    return;
  }

  if (error?.response?.status === StatusConflict) {
    console.log(StatusConflict);
    toastError('Conflito');
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

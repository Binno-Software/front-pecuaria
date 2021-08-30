import { STORAGE_LOGIN, STORAGE_PASSWORD } from 'src/constants';

export default function clearStorage() {
  const login = window.localStorage.getItem(STORAGE_LOGIN);

  if (login) {
    const password = window.localStorage.getItem(STORAGE_PASSWORD);
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_LOGIN, login);
    window.localStorage.setItem(STORAGE_PASSWORD, password);
    return;
  }

  window.localStorage.clear();
}

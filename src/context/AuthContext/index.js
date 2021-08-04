import React, {
  createContext, useState, useCallback, useContext
} from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import api from '../../service/api';

toast.configure();

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const usuario = localStorage.getItem('@BINNO_AGRO_UUI');
    if (usuario) {
      const parsed = JSON.parse(usuario);
      api.defaults.headers.authorization = `Bearer ${parsed.token}`;
      return parsed;
    }

    return {
      isLoggedIn: false
    };
  });

  const login = useCallback(async (credentials) => {
    try {
      const { data } = await api.post('auth', credentials);
      localStorage.setItem('@BINNO_AGRO_UUI', JSON.stringify({ isLoggedIn: true, ...data }));
      api.defaults.headers.authorization = `Bearer ${data.token}`;
      setUser({ isLoggedIn: true, ...data });
      return true;
    } catch (error) {
      toast.error('Falha no login');
      return false;
    }
  }, [setUser]);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser({
      isLoggedIn: false
    });
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthProvider;

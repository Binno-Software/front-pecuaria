import React, {
  createContext, useState, useCallback, useContext
} from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import api from 'src/service/api';
import { auth, provider } from 'src/service/fire';
import clearStorage from 'src/utils/clearLocalStorage';

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

  const atualizarDadosUsuarioLocal = useCallback((data) => {
    const user = {...data, isLoggedIn: true};
    localStorage.setItem('@BINNO_AGRO_UUI', JSON.stringify(user));
    setUser(user);
  }, []);

  const verificarSeTemFazendas = useCallback(async () => {
    const { data } = await api.get('fazendas/listagem');
    return data.length > 0;
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const { data } = await api.post('auth', credentials);
      api.defaults.headers.authorization = `Bearer ${data.token}`;

      const jaTemFazendas = await verificarSeTemFazendas();

      const user = { isLoggedIn: true, jaTemFazendas, ...data };

      localStorage.setItem('@BINNO_AGRO_UUI', JSON.stringify(user));
      
      setUser(user);
      return true;
    } catch (error) {
      toast.error('Falha no login');
      return false;
    }
  }, [setUser, verificarSeTemFazendas]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await auth.signInWithPopup(provider)
      const { data } = await api.post('auth/google', {
        nome: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
        photoURL: result.user.photoURL
      })

      api.defaults.headers.authorization = `Bearer ${data.token}`;

      const jaTemFazendas = await verificarSeTemFazendas();
      const user = { isLoggedIn: true, jaTemFazendas, ...data };

      localStorage.setItem('@BINNO_AGRO_UUI', JSON.stringify(user));
      
      setUser(user);
      
      return true;
    } catch (error) {
      toast.error('Falha no login');
      return false;
    }
  }, [verificarSeTemFazendas]);

  const loginWithFacebook = useCallback(async () => {
    // try {
    //   const result = await auth.signInWithPopup(facebookProvider)
    //   console.log(result)
    //   const { data } = await api.post('auth/google', {
    //     nome: result.user.displayName,
    //     email: result.user.email,
    //     uid: result.user.uid,
    //     photoURL: result.user.photoURL
    //   })
    //   localStorage.setItem('@BINNO_AGRO_UUI', JSON.stringify({ isLoggedIn: true, ...data }));
    //   setUser({ isLoggedIn: true, ...data });
    //   api.defaults.headers.authorization = `Bearer ${data.token}`;
    //   return true;
    // } catch (error) {
    //   toast.error('Falha no login');
    //   return false;
    // }
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    api.defaults.headers.authorization = ``;
    setUser({
      isLoggedIn: false
    });
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, loginWithFacebook, logout, atualizarDadosUsuarioLocal }}>
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

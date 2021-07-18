import React, { createContext, useState, useCallback, useContext } from 'react'
import api from '../../service/api'
import { toast } from 'react-toastify'

toast.configure()

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const usuario = localStorage.getItem('@BINNO_AGRO_UUI')
    if (usuario)
      return usuario

    return null
  })

  const login = useCallback(async credentials => {
    try {
      await api.post('auth', credentials)
      window.localStorage.setItem('@BINNO_AGRO_UUI', credentials)
      setUser(credentials)
      return true
    } catch (error) {
      toast.error('Falha no login')
      return false
    }
  }, [setUser])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [setUser])


  return <AuthContext.Provider value={{user, login, logout}}>
    {children}
  </AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider

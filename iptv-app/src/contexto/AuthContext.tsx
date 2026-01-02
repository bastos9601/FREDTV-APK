import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import iptvServicio, { UserInfo } from '../servicios/iptvServicio';

interface AuthContextData {
  usuario: UserInfo | null;
  cargando: boolean;
  iniciarSesion: (username: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('@usuario');
      const credenciales = await AsyncStorage.getItem('@credenciales');
      
      if (usuarioGuardado && credenciales) {
        setUsuario(JSON.parse(usuarioGuardado));
        const creds = JSON.parse(credenciales);
        iptvServicio.setCredentials(creds);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (username: string, password: string) => {
    try {
      const userInfo = await iptvServicio.login(username, password);
      setUsuario(userInfo);
      
      await AsyncStorage.setItem('@usuario', JSON.stringify(userInfo));
      await AsyncStorage.setItem('@credenciales', JSON.stringify({ username, password }));
    } catch (error) {
      throw error;
    }
  };

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem('@usuario');
      await AsyncStorage.removeItem('@credenciales');
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

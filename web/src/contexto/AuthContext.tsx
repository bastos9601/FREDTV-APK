import React, { createContext, useState, useContext, useEffect } from 'react';
import iptvServicio, { UserInfo } from '../servicios/iptvServicio';

interface AuthContextData {
  usuario: UserInfo | null;
  cargando: boolean;
  iniciarSesion: (username: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = () => {
    try {
      const usuarioGuardado = localStorage.getItem('@usuario');
      const credenciales = localStorage.getItem('@credenciales');
      
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
      console.log('AuthContext: Iniciando sesión...');
      const userInfo = await iptvServicio.login(username, password);
      console.log('AuthContext: Usuario recibido:', userInfo);
      
      setUsuario(userInfo);
      console.log('AuthContext: Estado de usuario actualizado');
      
      localStorage.setItem('@usuario', JSON.stringify(userInfo));
      localStorage.setItem('@credenciales', JSON.stringify({ username, password }));
      console.log('AuthContext: Datos guardados en localStorage');
    } catch (error) {
      console.error('AuthContext: Error en iniciarSesion:', error);
      throw error;
    }
  };

  const cerrarSesion = () => {
    try {
      localStorage.removeItem('@usuario');
      localStorage.removeItem('@credenciales');
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

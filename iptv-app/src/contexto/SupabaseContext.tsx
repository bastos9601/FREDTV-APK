import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../servicios/supabaseServicio';
import supabaseServicio from '../servicios/supabaseServicio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import iptvServicio from '../servicios/iptvServicio';

interface SupabaseContextType {
  usuarioId: string | null;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  iniciarSesionSupabase: (email: string, password: string) => Promise<boolean>;
  registrarse: (email: string, password: string) => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      // Verificar si hay sesión activa
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        setUsuarioId(data.session.user.id);
        await AsyncStorage.setItem('usuarioId', data.session.user.id);
        // Cargar credenciales guardadas
        await cargarCredencialesGuardadas(data.session.user.id);
      } else {
        // Intentar recuperar del almacenamiento local
        const usuarioGuardado = await AsyncStorage.getItem('usuarioId');
        if (usuarioGuardado) {
          setUsuarioId(usuarioGuardado);
          await cargarCredencialesGuardadas(usuarioGuardado);
        }
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCredencialesGuardadas = async (usuarioId: string) => {
    try {
      const credenciales = await supabaseServicio.obtenerCredenciales(usuarioId);
      if (credenciales) {
        // Restaurar credenciales en AsyncStorage
        await AsyncStorage.setItem('@credenciales', JSON.stringify({
          username: credenciales.username,
          password: credenciales.password,
        }));
        await AsyncStorage.setItem('@usuario', JSON.stringify(credenciales.datos_usuario));
        
        // Configurar credenciales en el servicio IPTV
        iptvServicio.setCredentials({
          username: credenciales.username,
          password: credenciales.password,
        });
      }
    } catch (error) {
      console.error('Error cargando credenciales guardadas:', error);
    }
  };

  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error iniciando sesión:', error);
        return false;
      }

      if (data.user) {
        setUsuarioId(data.user.id);
        await AsyncStorage.setItem('usuarioId', data.user.id);
        // Cargar credenciales guardadas
        await cargarCredencialesGuardadas(data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en iniciarSesion:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesionSupabase = async (username: string, password: string): Promise<boolean> => {
    try {
      // Usar el username como ID único en lugar de email
      // Esto permite usar solo usuario sin email
      setUsuarioId(username);
      await AsyncStorage.setItem('usuarioId', username);
      return true;
    } catch (error) {
      console.error('Error en iniciarSesionSupabase:', error);
      return false;
    }
  };

  const registrarse = async (email: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error registrándose:', error);
        return false;
      }

      if (data.user) {
        setUsuarioId(data.user.id);
        await AsyncStorage.setItem('usuarioId', data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en registrarse:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await supabase.auth.signOut();
      setUsuarioId(null);
      await AsyncStorage.removeItem('usuarioId');
      await AsyncStorage.removeItem('@credenciales');
      await AsyncStorage.removeItem('@usuario');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        usuarioId,
        cargando,
        iniciarSesion,
        iniciarSesionSupabase,
        registrarse,
        cerrarSesion,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider');
  }
  return context;
};

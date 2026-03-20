import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PerfilActivo {
  id: string;
  nombre: string;
  avatar?: string;
}

interface PerfilActivoContextType {
  perfilActivo: PerfilActivo | null;
  cambiarPerfil: (perfil: PerfilActivo) => Promise<void>;
  limpiarPerfil: () => Promise<void>;
}

const PerfilActivoContext = createContext<PerfilActivoContextType | undefined>(undefined);

export const PerfilActivoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perfilActivo, setPerfilActivo] = useState<PerfilActivo | null>(null);

  useEffect(() => {
    cargarPerfilGuardado();
  }, []);

  const cargarPerfilGuardado = async () => {
    try {
      const perfilGuardado = await AsyncStorage.getItem('perfilActivo');
      if (perfilGuardado) {
        setPerfilActivo(JSON.parse(perfilGuardado));
      }
    } catch (error) {
      console.error('Error cargando perfil guardado:', error);
    }
  };

  const cambiarPerfil = async (perfil: PerfilActivo) => {
    try {
      setPerfilActivo(perfil);
      await AsyncStorage.setItem('perfilActivo', JSON.stringify(perfil));
    } catch (error) {
      console.error('Error cambiando perfil:', error);
    }
  };

  const limpiarPerfil = async () => {
    try {
      setPerfilActivo(null);
      await AsyncStorage.removeItem('perfilActivo');
    } catch (error) {
      console.error('Error limpiando perfil:', error);
    }
  };

  return (
    <PerfilActivoContext.Provider
      value={{
        perfilActivo,
        cambiarPerfil,
        limpiarPerfil,
      }}
    >
      {children}
    </PerfilActivoContext.Provider>
  );
};

export const usePerfilActivo = () => {
  const context = useContext(PerfilActivoContext);
  if (!context) {
    throw new Error('usePerfilActivo debe usarse dentro de PerfilActivoProvider');
  }
  return context;
};

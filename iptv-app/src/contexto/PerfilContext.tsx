import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Perfil, obtenerPerfilActivo, establecerPerfilActivo, obtenerPerfiles } from '../utils/perfilesStorage';

interface PerfilContextType {
  perfilActivo: Perfil | null;
  perfiles: Perfil[];
  cambiarPerfil: (perfilId: string) => Promise<void>;
  recargarPerfiles: () => Promise<void>;
  cerrarPerfil: () => void;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export const PerfilProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [perfilActivo, setPerfilActivo] = useState<Perfil | null>(null);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);

  useEffect(() => {
    cargarPerfilActivo();
  }, []);

  const cargarPerfilActivo = async () => {
    const perfil = await obtenerPerfilActivo();
    setPerfilActivo(perfil);
    await recargarPerfiles();
  };

  const recargarPerfiles = async () => {
    const listaPerfiles = await obtenerPerfiles();
    setPerfiles(listaPerfiles);
  };

  const cambiarPerfil = async (perfilId: string) => {
    await establecerPerfilActivo(perfilId);
    await cargarPerfilActivo();
  };

  const cerrarPerfil = () => {
    setPerfilActivo(null);
  };

  return (
    <PerfilContext.Provider
      value={{
        perfilActivo,
        perfiles,
        cambiarPerfil,
        recargarPerfiles,
        cerrarPerfil,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (context === undefined) {
    throw new Error('usePerfil debe ser usado dentro de un PerfilProvider');
  }
  return context;
};

import React from 'react';
import './Boton.css';

interface BotonProps {
  titulo: string;
  onClick: () => void;
  cargando?: boolean;
  disabled?: boolean;
}

export const Boton: React.FC<BotonProps> = ({ titulo, onClick, cargando = false, disabled = false }) => {
  return (
    <button
      className="boton"
      onClick={onClick}
      disabled={cargando || disabled}
    >
      {cargando ? 'Cargando...' : titulo}
    </button>
  );
};

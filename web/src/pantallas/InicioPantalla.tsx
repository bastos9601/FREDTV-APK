import React from 'react';
import { useAuth } from '../contexto/AuthContext';
import { Boton } from '../componentes/Boton';
import './InicioPantalla.css';

export const InicioPantalla = () => {
  const { usuario, cerrarSesion } = useAuth();

  const manejarCerrarSesion = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      cerrarSesion();
    }
  };

  return (
    <div className="inicio-container">
      <div className="inicio-content">
        <h1 className="inicio-titulo">Bienvenido</h1>
        <h2 className="inicio-usuario">{usuario?.username}</h2>
        
        <div className="info-card">
          <div className="info-item">
            <span className="info-label">Estado:</span>
            <span className="info-value">{usuario?.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fecha de expiración:</span>
            <span className="info-value">
              {usuario?.exp_date ? new Date(parseInt(usuario.exp_date) * 1000).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Conexiones activas:</span>
            <span className="info-value">{usuario?.active_cons}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Máximo de conexiones:</span>
            <span className="info-value">{usuario?.max_connections}</span>
          </div>
        </div>

        <div className="instrucciones">
          <p className="instrucciones-texto">
            Usa el menú de navegación para explorar:
          </p>
          <ul className="instrucciones-lista">
            <li>📺 TV en Vivo</li>
            <li>🎬 Películas</li>
            <li>📺 Series</li>
          </ul>
        </div>

        <div className="boton-cerrar">
          <Boton titulo="Cerrar Sesión" onClick={manejarCerrarSesion} />
        </div>
      </div>
    </div>
  );
};

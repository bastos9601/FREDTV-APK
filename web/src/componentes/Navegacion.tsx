import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navegacion.css';

export const Navegacion = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link activo' : 'nav-link';
  };

  return (
    <nav className="navegacion">
      <div className="nav-container">
        <Link to="/inicio" className="nav-logo">
          📺 FRED TV
        </Link>
        
        <div className="nav-links">
          <Link to="/inicio" className={isActive('/inicio')}>
            🏠 Inicio
          </Link>
          <Link to="/favoritos" className={isActive('/favoritos')}>
            ❤️ Favoritos
          </Link>
          <Link to="/tv-en-vivo" className={isActive('/tv-en-vivo')}>
            📺 TV en Vivo
          </Link>
          <Link to="/peliculas" className={isActive('/peliculas')}>
            🎬 Películas
          </Link>
          <Link to="/series" className={isActive('/series')}>
            📺 Series
          </Link>
        </div>
      </div>
    </nav>
  );
};

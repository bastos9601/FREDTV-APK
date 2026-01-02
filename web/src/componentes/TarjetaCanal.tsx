import React, { useState, useEffect } from 'react';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';
import './TarjetaCanal.css';

interface TarjetaCanalProps {
  nombre: string;
  imagen?: string;
  onClick: () => void;
  canal?: any;
}

export const TarjetaCanal: React.FC<TarjetaCanalProps> = ({ nombre, imagen, onClick, canal }) => {
  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    if (canal) {
      const fav = esFavorito(`canal_${canal.stream_id}`);
      setEsFav(fav);
    }
  }, [canal]);

  const manejarFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!canal) return;

    const favorito: Favorito = {
      id: `canal_${canal.stream_id}`,
      tipo: 'canal',
      nombre: canal.name,
      imagen: canal.stream_icon,
      fecha: Date.now(),
      datos: canal,
    };

    const nuevoEstado = toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  return (
    <div className="tarjeta-canal" onClick={onClick}>
      {imagen ? (
        <img src={imagen} alt={nombre} className="tarjeta-imagen" />
      ) : (
        <div className="tarjeta-placeholder">
          <span>📺</span>
        </div>
      )}
      <div className="tarjeta-info">
        <h3 className="tarjeta-titulo">{nombre}</h3>
        {canal && (
          <button
            className={`btn-favorito-tarjeta ${esFav ? 'activo' : ''}`}
            onClick={manejarFavorito}
            title={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {esFav ? '❤️' : '🤍'}
          </button>
        )}
      </div>
    </div>
  );
};

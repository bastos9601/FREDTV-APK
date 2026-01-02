import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import iptvServicio from '../servicios/iptvServicio';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';
import './DetallesPeliculaPantalla.css';

export const DetallesPeliculaPantalla = () => {
  const { peliculaId } = useParams<{ peliculaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { pelicula } = location.state || {};

  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    if (pelicula) {
      verificarFavorito();
    }
  }, [pelicula]);

  const verificarFavorito = () => {
    const fav = esFavorito(`pelicula_${pelicula.stream_id}`);
    setEsFav(fav);
  };

  const manejarFavorito = () => {
    const favorito: Favorito = {
      id: `pelicula_${pelicula.stream_id}`,
      tipo: 'pelicula',
      nombre: pelicula.name,
      imagen: pelicula.stream_icon,
      fecha: Date.now(),
      datos: pelicula,
    };

    const nuevoEstado = toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  const reproducirPelicula = () => {
    const url = iptvServicio.getVodStreamUrl(
      pelicula.stream_id,
      pelicula.container_extension
    );
    navigate('/reproductor', {
      state: {
        url,
        titulo: pelicula.name,
      },
    });
  };

  if (!pelicula) {
    return (
      <div className="detalles-pelicula-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>No se encontró la película</p>
          <button className="btn-volver" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detalles-pelicula-container">
      {/* Header con imagen de fondo */}
      <div className="pelicula-header">
        {pelicula.stream_icon ? (
          <img src={pelicula.stream_icon} alt={pelicula.name} className="pelicula-cover" />
        ) : (
          <div className="pelicula-cover-placeholder">🎬</div>
        )}
        <div className="pelicula-header-overlay">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>

      {/* Información de la película */}
      <div className="pelicula-info">
        <h1 className="pelicula-titulo">{pelicula.name}</h1>
        
        <div className="pelicula-meta">
          {pelicula.rating && (
            <div className="pelicula-rating">
              <span className="star-icon">⭐</span>
              <span>{pelicula.rating}</span>
            </div>
          )}
          {pelicula.added && (
            <span className="pelicula-year">
              {new Date(parseInt(String(pelicula.added)) * 1000).getFullYear()}
            </span>
          )}
          {pelicula.container_extension && (
            <span className="pelicula-format">{pelicula.container_extension.toUpperCase()}</span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="pelicula-acciones">
          <button className="btn-reproducir" onClick={reproducirPelicula}>
            <span className="play-icon">▶</span>
            Reproducir
          </button>
          <button 
            className={`btn-favorito ${esFav ? 'activo' : ''}`}
            onClick={manejarFavorito}
          >
            <span className="heart-icon">{esFav ? '❤️' : '🤍'}</span>
            {esFav ? 'En favoritos' : 'Agregar a favoritos'}
          </button>
        </div>

        {/* Información adicional */}
        <div className="pelicula-info-adicional">
          <div className="info-item">
            <span className="info-icon">📅</span>
            <div className="info-content">
              <span className="info-label">Agregado</span>
              <span className="info-value">
                {pelicula.added 
                  ? new Date(parseInt(String(pelicula.added)) * 1000).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          {pelicula.rating_5based && (
            <div className="info-item">
              <span className="info-icon">⭐</span>
              <div className="info-content">
                <span className="info-label">Rating</span>
                <span className="info-value">{pelicula.rating_5based}/5</span>
              </div>
            </div>
          )}

          <div className="info-item">
            <span className="info-icon">🎥</span>
            <div className="info-content">
              <span className="info-label">Formato</span>
              <span className="info-value">{pelicula.container_extension || 'N/A'}</span>
            </div>
          </div>

          {pelicula.category_id && (
            <div className="info-item">
              <span className="info-icon">📂</span>
              <div className="info-content">
                <span className="info-label">Categoría</span>
                <span className="info-value">ID: {pelicula.category_id}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import iptvServicio from '../servicios/iptvServicio';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';
import './DetallesSeriePantalla.css';

interface Episodio {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: {
    duration?: string;
    plot?: string;
    rating?: string;
  };
}

interface SerieInfo {
  info: any;
  episodes: { [key: string]: Episodio[] };
  seasons: any[];
}

export const DetallesSeriePantalla = () => {
  const { serieId } = useParams<{ serieId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { serie } = location.state || {};

  const [cargando, setCargando] = useState(true);
  const [infoSerie, setInfoSerie] = useState<SerieInfo | null>(null);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState<string>('1');
  const [error, setError] = useState('');
  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    if (serieId) {
      cargarDetalles();
    }
  }, [serieId]);

  useEffect(() => {
    if (serie) {
      verificarFavorito();
    }
  }, [serie]);

  const verificarFavorito = () => {
    const fav = esFavorito(`serie_${serieId}`);
    setEsFav(fav);
  };

  const manejarFavorito = () => {
    const favorito: Favorito = {
      id: `serie_${serieId}`,
      tipo: 'serie',
      nombre: serie?.name || infoSerie?.info?.name || 'Serie',
      imagen: serie?.cover,
      fecha: Date.now(),
      datos: serie,
    };

    const nuevoEstado = toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  const cargarDetalles = async () => {
    try {
      setCargando(true);
      const info = await iptvServicio.getSeriesInfo(parseInt(serieId!));
      setInfoSerie(info);
      
      if (info.episodes) {
        const tempKeys = Object.keys(info.episodes).sort((a, b) => parseInt(a) - parseInt(b));
        if (tempKeys.length > 0) {
          setTemporadaSeleccionada(tempKeys[0]);
        }
      }
    } catch (error: any) {
      console.error('Error al cargar detalles:', error);
      setError('No se pudo cargar la información de la serie');
    } finally {
      setCargando(false);
    }
  };

  const reproducirEpisodio = (episodio: Episodio) => {
    const url = iptvServicio.getSeriesStreamUrl(
      parseInt(episodio.id),
      episodio.container_extension
    );
    
    // Preparar lista de episodios con sus URLs
    const episodiosConUrl = episodiosTemporada.map((ep) => ({
      id: ep.id,
      episode_num: ep.episode_num,
      title: ep.title,
      duration: ep.info?.duration,
      url: iptvServicio.getSeriesStreamUrl(
        parseInt(ep.id),
        ep.container_extension
      ),
      titulo: `${serie?.name || 'Serie'} - T${temporadaSeleccionada}E${ep.episode_num} - ${ep.title}`,
    }));

    navigate('/reproductor', {
      state: {
        url,
        titulo: `${serie?.name || 'Serie'} - T${temporadaSeleccionada}E${episodio.episode_num} - ${episodio.title}`,
        serie: serie,
        temporada: temporadaSeleccionada,
        episodios: episodiosConUrl,
        episodioActual: episodio.episode_num,
      },
    });
  };

  if (cargando) {
    return (
      <div className="detalles-serie-container">
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error || !infoSerie) {
    return (
      <div className="detalles-serie-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'No se encontró la serie'}</p>
          <button className="btn-volver" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const episodiosTemporada = infoSerie.episodes[temporadaSeleccionada] || [];
  const temporadas = Object.keys(infoSerie.episodes).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="detalles-serie-container">
      {/* Header con imagen de fondo */}
      <div className="serie-header">
        {serie?.cover ? (
          <img src={serie.cover} alt={serie.name} className="serie-cover" />
        ) : (
          <div className="serie-cover-placeholder">📺</div>
        )}
        <div className="serie-header-overlay">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>

      {/* Información de la serie */}
      <div className="serie-info">
        <h1 className="serie-titulo">{serie?.name || infoSerie.info?.name}</h1>
        
        <div className="serie-meta">
          {serie?.rating && (
            <div className="serie-rating">
              <span className="star-icon">⭐</span>
              <span>{serie.rating}</span>
            </div>
          )}
          {serie?.releaseDate && (
            <span className="serie-year">{serie.releaseDate.split('-')[0]}</span>
          )}
          {serie?.genre && (
            <span className="serie-genre">{serie.genre}</span>
          )}
        </div>

        {serie?.plot && (
          <p className="serie-descripcion">{serie.plot}</p>
        )}

        {serie?.cast && (
          <div className="serie-cast">
            <span className="cast-label">Reparto:</span>
            <span className="cast-text">{serie.cast}</span>
          </div>
        )}

        {/* Botón de favoritos */}
        <div className="serie-acciones">
          <button 
            className={`btn-favorito ${esFav ? 'activo' : ''}`}
            onClick={manejarFavorito}
          >
            <span className="heart-icon">{esFav ? '❤️' : '🤍'}</span>
            {esFav ? 'En favoritos' : 'Agregar a favoritos'}
          </button>
        </div>
      </div>

      {/* Selector de temporadas */}
      <div className="temporadas-section">
        <h2 className="section-titulo">Temporadas</h2>
        <div className="temporadas-scroll">
          {temporadas.map((temp) => (
            <button
              key={temp}
              className={`temporada-btn ${temp === temporadaSeleccionada ? 'activa' : ''}`}
              onClick={() => setTemporadaSeleccionada(temp)}
            >
              Temporada {temp}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de episodios */}
      <div className="episodios-section">
        <h2 className="section-titulo">
          Episodios ({episodiosTemporada.length})
        </h2>
        <div className="episodios-lista">
          {episodiosTemporada.map((episodio) => (
            <div
              key={episodio.id}
              className="episodio-item"
              onClick={() => reproducirEpisodio(episodio)}
            >
              <div className="episodio-numero">
                {episodio.episode_num}
              </div>
              <div className="episodio-info">
                <h3 className="episodio-titulo">
                  {episodio.title || `Episodio ${episodio.episode_num}`}
                </h3>
                {episodio.info?.duration && (
                  <span className="episodio-duracion">{episodio.info.duration}</span>
                )}
                {episodio.info?.plot && (
                  <p className="episodio-descripcion">{episodio.info.plot}</p>
                )}
              </div>
              <div className="episodio-play">
                <span className="play-icon">▶</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

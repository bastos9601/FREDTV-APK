import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iptvServicio, { VodStream, SeriesInfo } from '../servicios/iptvServicio';
import { useAuth } from '../contexto/AuthContext';
import { obtenerFavoritos, Favorito } from '../utils/favoritosStorage';
import './NuevaInicioPantalla.css';

export const NuevaInicioPantalla = () => {
  const [peliculasDestacadas, setPeliculasDestacadas] = useState<VodStream[]>([]);
  const [peliculasRecientes, setPeliculasRecientes] = useState<VodStream[]>([]);
  const [seriesPopulares, setSeriesPopulares] = useState<SeriesInfo[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  useEffect(() => {
    cargarContenido();
    cargarFavoritos();
  }, []);

  // Auto-deslizamiento del carrusel
  useEffect(() => {
    if (peliculasDestacadas.length === 0) return;

    const intervalo = setInterval(() => {
      setBannerIndex((prevIndex) => 
        (prevIndex + 1) % peliculasDestacadas.length
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [peliculasDestacadas.length]);

  const cargarContenido = async () => {
    try {
      setCargando(true);
      const [peliculas, categorias, series] = await Promise.all([
        iptvServicio.getVodStreams(),
        iptvServicio.getVodCategories(),
        iptvServicio.getSeries(),
      ]);

      // Buscar categoría de estrenos
      const categoriaEstrenos = categorias.find(cat => 
        cat.category_name.toLowerCase().includes('estrenos')
      );

      let peliculasEstrenos: VodStream[] = [];
      if (categoriaEstrenos) {
        peliculasEstrenos = peliculas.filter(p => 
          p.category_id === categoriaEstrenos.category_id
        );
      }

      // Si no hay estrenos, usar las más recientes
      if (peliculasEstrenos.length === 0) {
        peliculasEstrenos = [...peliculas].sort((a, b) => {
          const fechaA = a.added ? parseInt(String(a.added)) : 0;
          const fechaB = b.added ? parseInt(String(b.added)) : 0;
          return fechaB - fechaA;
        });
      }

      setPeliculasDestacadas(peliculasEstrenos.slice(0, 5));

      // Películas recientes
      const peliculasOrdenadas = [...peliculas].sort((a, b) => {
        const fechaA = a.added ? parseInt(String(a.added)) : 0;
        const fechaB = b.added ? parseInt(String(b.added)) : 0;
        return fechaB - fechaA;
      });

      setPeliculasRecientes(peliculasOrdenadas.slice(0, 15));
      setSeriesPopulares(series.slice(0, 15));
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarFavoritos = () => {
    const favs = obtenerFavoritos();
    setFavoritos(favs);
  };

  const verDetallesPelicula = (pelicula: VodStream) => {
    navigate(`/pelicula/${pelicula.stream_id}`, { state: { pelicula } });
  };

  const verSerie = (serie: SeriesInfo) => {
    navigate(`/serie/${serie.series_id}`, { state: { serie } });
  };

  const verFavorito = (favorito: Favorito) => {
    if (favorito.tipo === 'pelicula') {
      verDetallesPelicula(favorito.datos);
    } else if (favorito.tipo === 'serie') {
      verSerie(favorito.datos);
    }
  };

  const manejarCerrarSesion = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      cerrarSesion();
    }
  };

  if (cargando) {
    return (
      <div className="nueva-inicio-container">
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  const peliculaDestacada = peliculasDestacadas[bannerIndex];

  return (
    <div className="nueva-inicio-container">
      {/* Header */}
      <header className="inicio-header">
        <h1 className="inicio-logo">FRED TV</h1>
        <div className="header-actions">
          <button className="btn-perfil" onClick={manejarCerrarSesion}>
            <span className="icon-perfil">👤</span>
            <span>{usuario?.username}</span>
          </button>
        </div>
      </header>

      <div className="inicio-content">
        {/* Banner Destacado */}
        {peliculaDestacada && (
          <div className="banner-destacado">
            <img 
              src={peliculaDestacada.stream_icon} 
              alt={peliculaDestacada.name}
              className="banner-image"
            />
            <div className="banner-overlay">
              <div className="banner-badge">
                <span className="star-icon">⭐</span>
                <span>ESTRENO</span>
              </div>
              <div className="banner-content">
                <h2 className="banner-title">{peliculaDestacada.name}</h2>
                <button 
                  className="btn-ver-detalles"
                  onClick={() => verDetallesPelicula(peliculaDestacada)}
                >
                  <span className="play-icon">▶</span>
                  Ver Detalles
                </button>
              </div>
              <div className="banner-dots">
                {peliculasDestacadas.map((_, index) => (
                  <div
                    key={index}
                    className={`dot ${index === bannerIndex ? 'active' : ''}`}
                    onClick={() => setBannerIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sección: Mis Favoritos */}
        {favoritos.length > 0 && (
          <section className="content-section">
            <div className="section-header">
              <h3 className="section-title">❤️ Mis Favoritos</h3>
              <button 
                className="btn-ver-todo"
                onClick={() => navigate('/favoritos')}
              >
                Ver todo
              </button>
            </div>
            <div className="posters-scroll">
              {favoritos.slice(0, 10).map((favorito) => (
                <div
                  key={favorito.id}
                  className="poster-item"
                  onClick={() => verFavorito(favorito)}
                >
                  {favorito.imagen ? (
                    <img 
                      src={favorito.imagen} 
                      alt={favorito.nombre}
                      className="poster-image"
                    />
                  ) : (
                    <div className="poster-placeholder">🎬</div>
                  )}
                  <p className="poster-title">{favorito.nombre}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sección: Películas Recientes */}
        <section className="content-section">
          <div className="section-header">
            <h3 className="section-title">Películas Recientes</h3>
            <button 
              className="btn-ver-todo"
              onClick={() => navigate('/peliculas')}
            >
              Ver todo
            </button>
          </div>
          <div className="posters-scroll">
            {peliculasRecientes.map((pelicula) => (
              <div
                key={pelicula.stream_id}
                className="poster-item"
                onClick={() => verDetallesPelicula(pelicula)}
              >
                {pelicula.stream_icon ? (
                  <img 
                    src={pelicula.stream_icon} 
                    alt={pelicula.name}
                    className="poster-image"
                  />
                ) : (
                  <div className="poster-placeholder">🎬</div>
                )}
                <p className="poster-title">{pelicula.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Series Populares */}
        <section className="content-section">
          <div className="section-header">
            <h3 className="section-title">Series Populares</h3>
            <button 
              className="btn-ver-todo"
              onClick={() => navigate('/series')}
            >
              Ver todo
            </button>
          </div>
          <div className="posters-scroll">
            {seriesPopulares.map((serie) => (
              <div
                key={serie.series_id}
                className="poster-item"
                onClick={() => verSerie(serie)}
              >
                {serie.cover ? (
                  <img 
                    src={serie.cover} 
                    alt={serie.name}
                    className="poster-image"
                  />
                ) : (
                  <div className="poster-placeholder">📺</div>
                )}
                <p className="poster-title">{serie.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Información del Usuario */}
        <div className="user-info-footer">
          <p>Usuario: {usuario?.username}</p>
          <p>Expira: {usuario?.exp_date ? new Date(parseInt(usuario.exp_date) * 1000).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

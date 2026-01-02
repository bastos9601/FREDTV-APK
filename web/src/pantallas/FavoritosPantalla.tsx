import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerFavoritos, eliminarFavorito, Favorito } from '../utils/favoritosStorage';
import './FavoritosPantalla.css';

export const FavoritosPantalla = () => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'pelicula' | 'serie' | 'canal'>('todos');
  const navigate = useNavigate();

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = () => {
    const favs = obtenerFavoritos();
    setFavoritos(favs);
  };

  const handleEliminar = (id: string) => {
    if (window.confirm('¿Eliminar de favoritos?')) {
      eliminarFavorito(id);
      cargarFavoritos();
    }
  };

  const verFavorito = (favorito: Favorito) => {
    if (favorito.tipo === 'pelicula') {
      navigate(`/pelicula/${favorito.datos.stream_id}`, { state: { pelicula: favorito.datos } });
    } else if (favorito.tipo === 'serie') {
      navigate(`/serie/${favorito.datos.series_id}`, { state: { serie: favorito.datos } });
    }
  };

  const favoritosFiltrados = filtro === 'todos' 
    ? favoritos 
    : favoritos.filter(f => f.tipo === filtro);

  return (
    <div className="favoritos-container">
      <h1 className="favoritos-titulo">❤️ Mis Favoritos</h1>

      {/* Filtros */}
      <div className="favoritos-filtros">
        <button 
          className={`filtro-btn ${filtro === 'todos' ? 'activo' : ''}`}
          onClick={() => setFiltro('todos')}
        >
          Todos ({favoritos.length})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'pelicula' ? 'activo' : ''}`}
          onClick={() => setFiltro('pelicula')}
        >
          Películas ({favoritos.filter(f => f.tipo === 'pelicula').length})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'serie' ? 'activo' : ''}`}
          onClick={() => setFiltro('serie')}
        >
          Series ({favoritos.filter(f => f.tipo === 'serie').length})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'canal' ? 'activo' : ''}`}
          onClick={() => setFiltro('canal')}
        >
          Canales ({favoritos.filter(f => f.tipo === 'canal').length})
        </button>
      </div>

      {/* Lista de Favoritos */}
      {favoritosFiltrados.length === 0 ? (
        <div className="favoritos-vacio">
          <div className="vacio-icon">💔</div>
          <h2>No tienes favoritos</h2>
          <p>Agrega contenido a tus favoritos para verlo aquí</p>
          <button className="btn-explorar" onClick={() => navigate('/inicio')}>
            Explorar Contenido
          </button>
        </div>
      ) : (
        <div className="favoritos-grid">
          {favoritosFiltrados.map((favorito) => (
            <div key={favorito.id} className="favorito-card">
              <div className="favorito-imagen-container" onClick={() => verFavorito(favorito)}>
                {favorito.imagen ? (
                  <img 
                    src={favorito.imagen} 
                    alt={favorito.nombre}
                    className="favorito-imagen"
                  />
                ) : (
                  <div className="favorito-placeholder">
                    {favorito.tipo === 'pelicula' ? '🎬' : favorito.tipo === 'serie' ? '📺' : '📡'}
                  </div>
                )}
                <div className="favorito-overlay">
                  <button className="btn-play">▶</button>
                </div>
              </div>
              <div className="favorito-info">
                <h3 className="favorito-nombre">{favorito.nombre}</h3>
                <div className="favorito-meta">
                  <span className="favorito-tipo">
                    {favorito.tipo === 'pelicula' ? '🎬 Película' : 
                     favorito.tipo === 'serie' ? '📺 Serie' : '📡 Canal'}
                  </span>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleEliminar(favorito.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

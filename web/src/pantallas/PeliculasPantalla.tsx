import React, { useState, useEffect } from 'react';
import iptvServicio, { Category, VodStream } from '../servicios/iptvServicio';
import { TarjetaCanal } from '../componentes/TarjetaCanal';
import { useNavigate } from 'react-router-dom';
import './PeliculasPantalla.css';

export const PeliculasPantalla = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [peliculas, setPeliculas] = useState<VodStream[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      cargarPeliculas(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const cargarCategorias = async () => {
    try {
      const cats = await iptvServicio.getVodCategories();
      setCategorias(cats);
      if (cats.length > 0) {
        setCategoriaSeleccionada(cats[0].category_id);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarPeliculas = async (categoryId: string) => {
    setCargando(true);
    try {
      const streams = await iptvServicio.getVodStreams(categoryId);
      setPeliculas(streams);
    } catch (error) {
      console.error('Error al cargar películas:', error);
    } finally {
      setCargando(false);
    }
  };

  const reproducirPelicula = (pelicula: VodStream) => {
    navigate(`/pelicula/${pelicula.stream_id}`, { state: { pelicula } });
  };

  return (
    <div className="peliculas-container">
      <h1 className="peliculas-titulo">Películas</h1>
      
      <div className="categorias-scroll">
        {categorias.map((cat) => (
          <button
            key={cat.category_id}
            className={`categoria-btn ${categoriaSeleccionada === cat.category_id ? 'activa' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat.category_id)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="cargando">Cargando...</div>
      ) : (
        <div className="peliculas-grid">
          {peliculas.map((pelicula) => (
            <TarjetaCanal
              key={pelicula.stream_id}
              nombre={pelicula.name}
              imagen={pelicula.stream_icon}
              onClick={() => reproducirPelicula(pelicula)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

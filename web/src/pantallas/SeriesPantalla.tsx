import React, { useState, useEffect } from 'react';
import iptvServicio, { Category, SeriesInfo } from '../servicios/iptvServicio';
import { TarjetaCanal } from '../componentes/TarjetaCanal';
import { useNavigate } from 'react-router-dom';
import './SeriesPantalla.css';

export const SeriesPantalla = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [series, setSeries] = useState<SeriesInfo[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      cargarSeries(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const cargarCategorias = async () => {
    try {
      const cats = await iptvServicio.getSeriesCategories();
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

  const cargarSeries = async (categoryId: string) => {
    setCargando(true);
    try {
      const seriesData = await iptvServicio.getSeries(categoryId);
      setSeries(seriesData);
    } catch (error) {
      console.error('Error al cargar series:', error);
    } finally {
      setCargando(false);
    }
  };

  const verSerie = (serie: SeriesInfo) => {
    navigate(`/serie/${serie.series_id}`, { state: { serie } });
  };

  return (
    <div className="series-container">
      <h1 className="series-titulo">Series</h1>
      
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
        <div className="series-grid">
          {series.map((serie) => (
            <TarjetaCanal
              key={serie.series_id}
              nombre={serie.name}
              imagen={serie.cover}
              onClick={() => verSerie(serie)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

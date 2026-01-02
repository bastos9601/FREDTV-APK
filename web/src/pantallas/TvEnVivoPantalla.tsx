import React, { useState, useEffect } from 'react';
import iptvServicio, { Category, LiveStream } from '../servicios/iptvServicio';
import { TarjetaCanal } from '../componentes/TarjetaCanal';
import { useNavigate } from 'react-router-dom';
import './TvEnVivoPantalla.css';

export const TvEnVivoPantalla = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [canales, setCanales] = useState<LiveStream[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      cargarCanales(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const cargarCategorias = async () => {
    try {
      const cats = await iptvServicio.getLiveCategories();
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

  const cargarCanales = async (categoryId: string) => {
    setCargando(true);
    try {
      const streams = await iptvServicio.getLiveStreams(categoryId);
      setCanales(streams);
    } catch (error) {
      console.error('Error al cargar canales:', error);
    } finally {
      setCargando(false);
    }
  };

  const reproducirCanal = (canal: LiveStream) => {
    const url = iptvServicio.getLiveStreamUrl(canal.stream_id);
    navigate('/reproductor', { state: { url, titulo: canal.name } });
  };

  return (
    <div className="tv-container">
      <h1 className="tv-titulo">TV en Vivo</h1>
      
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
        <div className="canales-grid">
          {canales.map((canal) => (
            <TarjetaCanal
              key={canal.stream_id}
              nombre={canal.name}
              imagen={canal.stream_icon}
              onClick={() => reproducirCanal(canal)}
              canal={canal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

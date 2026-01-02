import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReproductorPantalla.css';

export const ReproductorPantalla = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, titulo } = location.state || {};

  if (!url) {
    return (
      <div className="reproductor-container">
        <div className="error-message">No se proporcionó una URL válida</div>
        <button className="boton-volver" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="reproductor-container">
      <div className="reproductor-header">
        <button className="boton-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h2 className="reproductor-titulo">{titulo}</h2>
      </div>
      
      <div className="video-wrapper">
        <video
          className="video-player"
          controls
          autoPlay
          src={url}
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  );
};

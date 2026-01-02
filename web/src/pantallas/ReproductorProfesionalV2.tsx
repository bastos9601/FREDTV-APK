import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import './ReproductorProfesional.css';

export const ReproductorProfesionalV2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, titulo, serie, temporada, episodios, episodioActual } = location.state || {};
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [useNativePlayer, setUseNativePlayer] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!url || !videoRef.current) {
      setError('No se proporcionó una URL válida');
      return;
    }

    const video = videoRef.current;
    console.log('Cargando URL:', url);

    // Detectar tipo de stream
    const isHLS = url.includes('.m3u8');
    const isTS = url.includes('.ts');
    const isMP4 = url.includes('.mp4');
    const isMKV = url.includes('.mkv');
    const isAVI = url.includes('.avi');

    console.log('📊 Análisis de URL:');
    console.log('  - URL completa:', url);
    console.log('  - Tipo detectado:', { isHLS, isTS, isMP4, isMKV, isAVI });

    // Para streams .ts, intentar convertir a .m3u8
    let streamUrl = url;
    if (isTS && !isHLS) {
      // Intentar cambiar .ts por .m3u8
      streamUrl = url.replace('.ts', '.m3u8');
      console.log('🔄 Intentando URL HLS:', streamUrl);
    }

    // Función para cargar con HLS.js
    const loadWithHLS = (sourceUrl: string) => {
      if (Hls.isSupported()) {
        console.log('Usando HLS.js');
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          debug: false,
        });
        
        hlsRef.current = hls;
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ Manifest cargado, iniciando reproducción...');
          
          // Intentar reproducir con manejo de errores mejorado
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('✅ Reproducción iniciada automáticamente');
                setIsLoading(false);
                setIsPlaying(true);
              })
              .catch((err) => {
                console.log('ℹ️ Autoplay bloqueado, mostrando botón manual:', err.name);
                // No mostrar error, solo activar botón manual
                setNeedsManualPlay(true);
                setError('');
                setIsLoading(false);
              });
          } else {
            setNeedsManualPlay(true);
            setIsLoading(false);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('❌ HLS Error:', data.type, data.details);
          console.error('   Fatal:', data.fatal);
          console.error('   Datos completos:', data);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('🔄 Error de red, reintentando...');
                setError('Error de red. Reintentando conexión...');
                setTimeout(() => {
                  hls.startLoad();
                  setError('');
                }, 1000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('🔄 Error de medios, intentando recuperar...');
                setError('Error de medios. Recuperando stream...');
                hls.recoverMediaError();
                setTimeout(() => setError(''), 2000);
                break;
              default:
                console.error('💥 Error fatal no recuperable');
                let errorMsg = 'No se pudo cargar el stream.';
                
                if (data.details === 'manifestLoadError') {
                  errorMsg = 'No se pudo cargar el manifest del stream. El canal puede estar offline.';
                } else if (data.details === 'manifestParsingError') {
                  errorMsg = 'Error al analizar el manifest. Formato no válido.';
                } else if (data.details === 'levelLoadError') {
                  errorMsg = 'Error al cargar el nivel del stream. Intenta con otro canal.';
                } else if (data.details === 'fragLoadError') {
                  errorMsg = 'Error al cargar fragmentos del video. Conexión inestable.';
                }
                
                setError(errorMsg);
                setIsLoading(false);
                break;
            }
          }
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          if (error) setError('');
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari nativo
        console.log('Usando Safari nativo');
        video.src = sourceUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play()
            .then(() => {
              setIsLoading(false);
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error('Error al reproducir:', err);
              setError('No se pudo iniciar la reproducción.');
              setIsLoading(false);
            });
        });
      } else {
        setError('Tu navegador no soporta HLS. Usa Chrome, Firefox o Safari.');
      }
    };

    // Función para cargar video directo
    const loadDirectVideo = (sourceUrl: string) => {
      console.log('Cargando video directo');
      video.src = sourceUrl;
      video.load();
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Video directo reproduciendo');
            setIsLoading(false);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('ℹ️ Autoplay bloqueado, mostrando botón manual:', err.name);
            setNeedsManualPlay(true);
            setError('');
            setIsLoading(false);
          });
      } else {
        setNeedsManualPlay(true);
        setIsLoading(false);
      }
    };

    // Decidir cómo cargar según el tipo
    if (isHLS || isTS) {
      // Intentar primero con HLS
      loadWithHLS(streamUrl);
    } else {
      // Video directo
      loadDirectVideo(url);
    }

    // Event listeners del video
    const handleCanPlay = () => {
      console.log('Video listo para reproducir');
      setIsLoading(false);
    };

    const handlePlaying = () => {
      console.log('Reproduciendo...');
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleWaiting = () => {
      console.log('Buffering...');
      setIsLoading(true);
    };

    const handleError = () => {
      console.error('Error en el video');
      const videoError = video.error;
      
      let errorMessage = 'Error al cargar el video.';
      
      if (videoError) {
        console.error('Código de error:', videoError.code);
        console.error('Mensaje:', videoError.message);
        
        switch (videoError.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMessage = 'Carga del video abortada.';
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorMessage = 'Error de red al cargar el video. Verifica tu conexión.';
            break;
          case 3: // MEDIA_ERR_DECODE
            errorMessage = 'Error al decodificar el video. El archivo puede estar corrupto.';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMessage = 'Formato de video no soportado. Intenta con otro canal o usa la app móvil.';
            break;
          default:
            errorMessage = 'Error desconocido al cargar el video.';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('error', handleError);
    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('error', handleError);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
    };
  }, [url]);

  // Manejar movimiento del mouse
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleVolver = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    navigate(-1);
  };

  const handleManualPlay = () => {
    if (videoRef.current) {
      setNeedsManualPlay(false);
      setIsLoading(true);
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error al reproducir manualmente:', err);
          setError('No se pudo reproducir el video.');
          setIsLoading(false);
        });
    }
  };

  const handleReintentar = () => {
    setError('');
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const intentarReproductorNativo = () => {
    console.log('🔄 Intentando con reproductor nativo...');
    setUseNativePlayer(true);
    setError('');
    setIsLoading(true);
    
    if (videoRef.current) {
      // Destruir HLS.js si existe
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      // Usar reproductor nativo
      videoRef.current.src = url;
      videoRef.current.load();
      videoRef.current.play()
        .then(() => {
          setIsLoading(false);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Error con reproductor nativo:', err);
          setError('No se pudo reproducir con ningún método. El formato puede no ser compatible.');
          setIsLoading(false);
        });
    }
  };

  const cambiarEpisodio = (episodio: any) => {
    // Detener el video actual
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Navegar al nuevo episodio
    const nuevaUrl = episodio.url;
    const nuevoTitulo = episodio.titulo;
    
    navigate('/reproductor', {
      replace: true,
      state: {
        url: nuevaUrl,
        titulo: nuevoTitulo,
        serie,
        temporada,
        episodios,
        episodioActual: episodio.episode_num,
      },
    });

    // Recargar la página para iniciar el nuevo video
    window.location.reload();
  };

  if (!url) {
    return (
      <div className="reproductor-profesional">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>No se proporcionó una URL válida</p>
          <button className="btn-volver" onClick={handleVolver}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="reproductor-profesional"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header */}
      <div className={`reproductor-header ${showControls ? 'visible' : ''}`}>
        <button className="btn-volver-header" onClick={handleVolver}>
          <span className="icon-volver">←</span>
          <span>Volver</span>
        </button>
        <h2 className="reproductor-titulo">{titulo}</h2>
        <div className="header-actions">
          {episodios && episodios.length > 0 && (
            <button 
              className="btn-episodios"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
            >
              <span className="icon-list">☰</span>
              <span>Episodios</span>
            </button>
          )}
        </div>
      </div>

      {/* Video */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-player"
          controls
          autoPlay
          playsInline
        />

        {/* Loading */}
        {isLoading && !error && !needsManualPlay && (
          <div className="loading-overlay">
            <div className="spinner-large"></div>
            <p>Cargando stream...</p>
          </div>
        )}

        {/* Manual Play Button */}
        {needsManualPlay && !error && (
          <div className="manual-play-overlay" onClick={handleManualPlay}>
            <button className="btn-play-large" onClick={handleManualPlay}>
              <span className="play-icon">▶</span>
            </button>
            <p>Haz clic para iniciar la reproducción</p>
            <p className="manual-play-hint">El navegador requiere interacción del usuario</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-overlay">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <h3>Error de Reproducción</h3>
              <p>{error}</p>
              <div className="error-actions">
                <button className="btn-reintentar" onClick={handleReintentar}>
                  Reintentar
                </button>
                {!useNativePlayer && (
                  <button className="btn-native" onClick={intentarReproductorNativo}>
                    Reproductor Nativo
                  </button>
                )}
                <button className="btn-volver" onClick={handleVolver}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Badge */}
      <div className={`reproductor-info ${showControls ? 'visible' : ''}`}>
        <div className="info-badge">
          <span className="badge-live">● EN VIVO</span>
        </div>
      </div>

      {/* Lista de Episodios */}
      {showEpisodeList && episodios && (
        <div className="episode-list-overlay" onClick={() => setShowEpisodeList(false)}>
          <div className="episode-list-container" onClick={(e) => e.stopPropagation()}>
            <div className="episode-list-header">
              <h3>Episodios - Temporada {temporada}</h3>
              <button 
                className="btn-close-list"
                onClick={() => setShowEpisodeList(false)}
              >
                ✕
              </button>
            </div>
            <div className="episode-list-content">
              {episodios.map((ep: any) => (
                <div
                  key={ep.id}
                  className={`episode-list-item ${ep.episode_num === episodioActual ? 'active' : ''}`}
                  onClick={() => cambiarEpisodio(ep)}
                >
                  <div className="episode-list-number">{ep.episode_num}</div>
                  <div className="episode-list-info">
                    <h4>{ep.title || `Episodio ${ep.episode_num}`}</h4>
                    {ep.duration && <span className="episode-duration">{ep.duration}</span>}
                  </div>
                  {ep.episode_num === episodioActual && (
                    <span className="episode-playing">▶ Reproduciendo</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

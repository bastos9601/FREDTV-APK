import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { COLORS } from '../utils/constantes';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { guardarProgreso, obtenerProgreso, ProgresoVideo } from '../utils/progresoStorage';

const { width, height } = Dimensions.get('window');

export const ReproductorProfesional = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { url, titulo, serie, temporada, episodio, esTvEnVivo, streamId, serieId, posicionInicial } = route.params;
  
  const [mostrarControles, setMostrarControles] = useState(true);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [volumen, setVolumen] = useState(1);
  const [mostrarVolumen, setMostrarVolumen] = useState(false);
  const [duracion, setDuracion] = useState(0);
  const [posicion, setPosicion] = useState(0);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [progresoRecuperado, setProgresoRecuperado] = useState(false);
  const [posicionInicialAplicada, setPosicionInicialAplicada] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const player = useVideoPlayer(url, (player) => {
    player.play();
    player.volume = volumen;
  });

  useEffect(() => {
    // Listener para detectar cuando el video está listo
    if (player) {
      const checkReady = setInterval(() => {
        if (player.duration > 0) {
          setCargando(false);
          setDuracion(player.duration);
          clearInterval(checkReady);
          
          // Si viene con posición inicial (desde "Continuar viendo"), aplicarla directamente
          if (posicionInicial && posicionInicial > 0 && !posicionInicialAplicada) {
            player.currentTime = posicionInicial;
            setPosicionInicialAplicada(true);
            setProgresoRecuperado(true);
          }
          // Si no, recuperar progreso guardado (solo para películas y series, no TV en vivo)
          else if (!esTvEnVivo && !progresoRecuperado && !posicionInicial) {
            recuperarProgreso();
          }
        }
      }, 100);

      return () => clearInterval(checkReady);
    }
  }, [player]);

  // Función para recuperar el progreso guardado
  const recuperarProgreso = async () => {
    try {
      const videoId = generarIdVideo();
      const progreso = await obtenerProgreso(videoId);
      
      if (progreso && progreso.posicion > 0) {
        Alert.alert(
          'Continuar viendo',
          `¿Deseas continuar desde ${formatearTiempo(progreso.posicion)}?`,
          [
            {
              text: 'Desde el inicio',
              style: 'cancel',
            },
            {
              text: 'Continuar',
              onPress: () => {
                if (player) {
                  player.currentTime = progreso.posicion;
                }
              },
            },
          ]
        );
      }
      setProgresoRecuperado(true);
    } catch (error) {
      console.error('Error al recuperar progreso:', error);
      setProgresoRecuperado(true);
    }
  };

  // Función para generar ID único del video
  const generarIdVideo = (): string => {
    if (serie && serieId && temporada && episodio) {
      return `serie_${serieId}_t${temporada}_e${episodio}`;
    } else if (streamId) {
      return `pelicula_${streamId}`;
    }
    return `video_${titulo.replace(/\s+/g, '_')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        try {
          const currentTime = player.currentTime;
          const duration = player.duration;
          const playing = player.playing;
          
          setPosicion(currentTime);
          setDuracion(duration);
          setReproduciendo(playing);
          
          // Ocultar cargando si el video está reproduciendo
          if (playing && cargando) {
            setCargando(false);
          }

          // Guardar progreso cada 10 segundos (solo si no es TV en vivo)
          if (!esTvEnVivo && duration > 0 && currentTime > 0) {
            const porcentaje = (currentTime / duration) * 100;
            
            // Guardar progreso
            const progreso: ProgresoVideo = {
              id: generarIdVideo(),
              titulo,
              posicion: currentTime,
              duracion: duration,
              porcentaje,
              fecha: Date.now(),
              tipo: serie ? 'episodio' : 'pelicula',
              streamId,
              serieId,
              temporada,
              episodio,
              url,
            };
            
            guardarProgreso(progreso);
          }
        } catch (error) {
          // Player ya fue liberado, ignorar
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [player, cargando, esTvEnVivo, titulo, streamId, serieId, temporada, episodio]);

  // Guardar progreso al salir
  useEffect(() => {
    return () => {
      // Guardar el progreso usando los valores del estado en lugar del player
      if (!esTvEnVivo && duracion > 0 && posicion > 0) {
        const porcentaje = (posicion / duracion) * 100;
        
        const progreso: ProgresoVideo = {
          id: generarIdVideo(),
          titulo,
          posicion,
          duracion,
          porcentaje,
          fecha: Date.now(),
          tipo: serie ? 'episodio' : 'pelicula',
          streamId,
          serieId,
          temporada,
          episodio,
          url,
        };
        
        guardarProgreso(progreso);
      }
    };
  }, [esTvEnVivo, duracion, posicion, titulo, streamId, serieId, temporada, episodio, url]);

  useEffect(() => {
    if (mostrarControles && !bloqueado) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        ocultarControles();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [mostrarControles, bloqueado]);

  const ocultarControles = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMostrarControles(false);
    });
  };

  const toggleControles = () => {
    if (!bloqueado) {
      setMostrarControles(!mostrarControles);
    }
  };

  const toggleBloqueo = () => {
    const nuevoEstadoBloqueo = !bloqueado;
    setBloqueado(nuevoEstadoBloqueo);
    
    if (nuevoEstadoBloqueo) {
      // Al bloquear, ocultar controles
      setMostrarControles(false);
    } else {
      // Al desbloquear, mostrar controles
      setMostrarControles(true);
    }
  };

  const abrirSelectorEpisodios = () => {
    if (serie) {
      (navigation as any).navigate('DetallesSerie', { serie });
    }
  };

  const volverACanales = () => {
    // Volver a la pantalla de TV en vivo
    navigation.goBack();
  };

  const toggleReproduccion = () => {
    if (player) {
      if (reproduciendo) {
        player.pause();
      } else {
        player.play();
      }
      setReproduciendo(!reproduciendo);
    }
  };

  const adelantar = (segundos: number) => {
    if (player) {
      player.currentTime = player.currentTime + segundos;
    }
  };

  const cambiarVolumen = (delta: number) => {
    const nuevoVolumen = Math.max(0, Math.min(1, volumen + delta));
    setVolumen(nuevoVolumen);
    if (player) {
      player.volume = nuevoVolumen;
    }
    setMostrarVolumen(true);
    setTimeout(() => setMostrarVolumen(false), 2000);
  };

  const togglePantallaCompleta = async () => {
    if (pantallaCompleta) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    setPantallaCompleta(!pantallaCompleta);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calcularProgreso = () => {
    if (duracion > 0) {
      return (posicion / duracion) * 100;
    }
    return 0;
  };

  const buscarPosicion = (porcentaje: number) => {
    if (player && duracion > 0) {
      const nuevaPosicion = (porcentaje / 100) * duracion;
      player.currentTime = nuevaPosicion;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Player */}
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={toggleControles}
      >
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false}
        />

        {/* Indicador de Carga */}
        {cargando && duracion === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando video...</Text>
          </View>
        )}

        {/* Indicador de Volumen */}
        {mostrarVolumen && (
          <View style={styles.volumenIndicador}>
            <Ionicons
              name={volumen === 0 ? 'volume-mute' : volumen < 0.5 ? 'volume-low' : 'volume-high'}
              size={30}
              color="#FFF"
            />
            <View style={styles.volumenBarra}>
              <View style={[styles.volumenProgreso, { width: `${volumen * 100}%` }]} />
            </View>
            <Text style={styles.volumenTexto}>{Math.round(volumen * 100)}%</Text>
          </View>
        )}

        {/* Botón de Bloqueo Flotante (siempre visible cuando está bloqueado) */}
        {bloqueado && (
          <TouchableOpacity 
            style={styles.botonBloqueoFlotante}
            onPress={toggleBloqueo}
          >
            <Ionicons name="lock-closed" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Indicador de Bloqueo (aparece temporalmente) */}
        {bloqueado && mostrarControles && (
          <View style={styles.bloqueoIndicador}>
            <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
            <Text style={styles.bloqueoTexto}>Pantalla bloqueada</Text>
            <Text style={styles.bloqueoSubtexto}>Toca el candado para desbloquear</Text>
          </View>
        )}

        {/* Controles */}
        {mostrarControles && (
          <Animated.View style={[styles.controlesContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.botonHeader}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.titulo} numberOfLines={1}>
                {titulo}
              </Text>
              <View style={styles.headerButtons}>
                {esTvEnVivo && (
                  <TouchableOpacity 
                    style={styles.botonHeader}
                    onPress={volverACanales}
                  >
                    <Ionicons name="tv" size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
                {serie && (
                  <TouchableOpacity 
                    style={styles.botonHeader}
                    onPress={abrirSelectorEpisodios}
                  >
                    <Ionicons name="list" size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.botonHeader}
                  onPress={toggleBloqueo}
                >
                  <Ionicons 
                    name={bloqueado ? "lock-closed" : "lock-open"} 
                    size={24} 
                    color={bloqueado ? COLORS.primary : "#FFF"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Controles Centrales */}
            <View style={styles.controlesCentro}>
              <TouchableOpacity
                style={styles.botonControl}
                onPress={() => adelantar(-10)}
              >
                <Ionicons name="play-back" size={40} color="#FFF" />
                <Text style={styles.textoControl}>10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonPlayPausa}
                onPress={toggleReproduccion}
              >
                <Ionicons
                  name={reproduciendo ? 'pause' : 'play'}
                  size={60}
                  color="#FFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonControl}
                onPress={() => adelantar(10)}
              >
                <Ionicons name="play-forward" size={40} color="#FFF" />
                <Text style={styles.textoControl}>10s</Text>
              </TouchableOpacity>
            </View>

            {/* Footer con Barra de Progreso */}
            <View style={styles.footer}>
              {/* Barra de Progreso */}
              <View style={styles.progresoContainer}>
                <Text style={styles.tiempo}>{formatearTiempo(posicion)}</Text>
                <View style={styles.barraPrincipal}>
                  <View style={styles.barraFondo}>
                    <View
                      style={[styles.barraProgreso, { width: `${calcularProgreso()}%` }]}
                    />
                  </View>
                </View>
                <Text style={styles.tiempo}>
                  {duracion > 0 ? formatearTiempo(duracion) : '--:--'}
                </Text>
              </View>

              {/* Controles Inferiores */}
              <View style={styles.controlesInferiores}>
                <View style={styles.controlesIzquierda}>
                  <TouchableOpacity
                    style={styles.botonInferior}
                    onPress={() => cambiarVolumen(-0.1)}
                  >
                    <Ionicons name="volume-low" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.botonInferior}
                    onPress={() => cambiarVolumen(0.1)}
                  >
                    <Ionicons name="volume-high" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.controlesDerecha}>
                  <TouchableOpacity style={styles.botonInferior}>
                    <Ionicons name="settings-outline" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.botonInferior}
                    onPress={togglePantallaCompleta}
                  >
                    <Ionicons
                      name={pantallaCompleta ? 'contract' : 'expand'}
                      size={24}
                      color="#FFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  volumenIndicador: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
  },
  volumenBarra: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  volumenProgreso: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  volumenTexto: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 14,
  },
  controlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonHeader: {
    padding: 5,
    marginLeft: 10,
  },
  titulo: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  controlesCentro: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonControl: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  textoControl: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },
  botonPlayPausa: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  progresoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tiempo: {
    color: '#FFF',
    fontSize: 12,
    minWidth: 45,
  },
  barraPrincipal: {
    flex: 1,
    marginHorizontal: 10,
  },
  barraFondo: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  controlesInferiores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlesIzquierda: {
    flexDirection: 'row',
  },
  controlesDerecha: {
    flexDirection: 'row',
  },
  botonInferior: {
    padding: 5,
    marginHorizontal: 7,
  },
  botonBloqueoFlotante: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
    zIndex: 1000,
  },
  bloqueoIndicador: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -80 }],
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: 200,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  bloqueoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  bloqueoSubtexto: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

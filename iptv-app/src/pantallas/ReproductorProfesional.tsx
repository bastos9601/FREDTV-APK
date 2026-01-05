import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  ScrollView,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { VideoView, useVideoPlayer } from 'expo-video';
import { COLORS } from '../utils/constantes';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Brightness from 'expo-brightness';
import { guardarProgreso, obtenerProgreso, ProgresoVideo } from '../utils/progresoStorage';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';
import iptvServicio from '../servicios/iptvServicio';

const { width, height } = Dimensions.get('window');

export const ReproductorProfesional = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { url, titulo, serie, temporada, episodio, esTvEnVivo, streamId, serieId, posicionInicial, imagen } = route.params;
  
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
  const [mostrarSiguienteEpisodio, setMostrarSiguienteEpisodio] = useState(false);
  const [siguienteEpisodio, setSiguienteEpisodio] = useState<any>(null);
  const [cuentaRegresiva, setCuentaRegresiva] = useState(10);
  const [modalEpisodios, setModalEpisodios] = useState(false);
  const [episodiosSerie, setEpisodiosSerie] = useState<any>({});
  const [temporadaModal, setTemporadaModal] = useState<string>(temporada || '1');
  const [cargandoEpisodios, setCargandoEpisodios] = useState(false);
  const [modalCanales, setModalCanales] = useState(false);
  const [canalesTv, setCanalesTv] = useState<any[]>([]);
  const [canalesFiltrados, setCanalesFiltrados] = useState<any[]>([]);
  const [categoriasTv, setCategoriasTv] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('all');
  const [cargandoCanales, setCargandoCanales] = useState(false);
  const [modalConfiguracion, setModalConfiguracion] = useState(false);
  const [brillo, setBrillo] = useState(0.5);
  const [brilloOriginal, setBrilloOriginal] = useState(0.5);
  const [pistasAudio, setPistasAudio] = useState<any[]>([]);
  const [pistaAudioSeleccionada, setPistaAudioSeleccionada] = useState<number>(0);
  const [esFav, setEsFav] = useState(false);
  const barraRef = useRef<View>(null);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const player = useVideoPlayer(url, (player) => {
    player.play();
    player.volume = volumen;
    // Configurar modo live para streams en vivo
    if (esTvEnVivo) {
      player.loop = false; // No hacer loop en streams en vivo
      // El player de expo-video maneja automáticamente HLS live streams
    }
  });

  // Guardar y restaurar brillo original
  useEffect(() => {
    const obtenerBrilloInicial = async () => {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          const brilloActual = await Brightness.getBrightnessAsync();
          setBrilloOriginal(brilloActual);
          setBrillo(brilloActual);
        }
      } catch (error) {
        console.error('Error al obtener brillo:', error);
      }
    };

    obtenerBrilloInicial();

    // Restaurar brillo al salir
    return () => {
      Brightness.setBrightnessAsync(brilloOriginal).catch(console.error);
    };
  }, []);

  // Obtener pistas de audio disponibles
  useEffect(() => {
    if (player) {
      try {
        // expo-video maneja las pistas de audio automáticamente
        // Aquí podríamos obtener las pistas disponibles si la API lo permite
        const audioTracks = player.audioTracks || [];
        setPistasAudio(audioTracks);
      } catch (error) {
        console.error('Error al obtener pistas de audio:', error);
      }
    }
  }, [player]);

  // Rotar pantalla a horizontal automáticamente al entrar
  useEffect(() => {
    const rotarPantalla = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setPantallaCompleta(true);
      } catch (error) {
        console.error('Error al rotar pantalla:', error);
      }
    };

    rotarPantalla();

    // Volver a vertical al salir
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT).catch(console.error);
    };
  }, []);

  // Verificar si es favorito (solo para canales de TV)
  useEffect(() => {
    if (esTvEnVivo && streamId) {
      verificarFavorito();
    }
  }, [esTvEnVivo, streamId]);

  const verificarFavorito = async () => {
    if (esTvEnVivo && streamId) {
      const fav = await esFavorito(`canal_${streamId}`);
      setEsFav(fav);
    }
  };

  const manejarFavorito = async () => {
    if (!esTvEnVivo || !streamId) return;

    const favorito: Favorito = {
      id: `canal_${streamId}`,
      tipo: 'canal',
      nombre: titulo,
      imagen: imagen,
      streamId: streamId,
      fecha: Date.now(),
      datos: { url },
    };

    const nuevoEstado = await toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  // Cargar información del siguiente episodio
  useEffect(() => {
    if (serie && temporada && episodio) {
      cargarSiguienteEpisodio();
    }
  }, [serie, temporada, episodio]);

  // Auto-reproducir siguiente episodio cuando la cuenta regresiva llegue a 0
  useEffect(() => {
    if (mostrarSiguienteEpisodio && cuentaRegresiva <= 0 && siguienteEpisodio) {
      reproducirSiguienteEpisodio();
    }
  }, [cuentaRegresiva, mostrarSiguienteEpisodio, siguienteEpisodio]);

  const cargarSiguienteEpisodio = async () => {
    try {
      const info = await iptvServicio.getSeriesInfo(serieId);
      if (info.episodes && info.episodes[temporada]) {
        const episodiosTemporada = info.episodes[temporada];
        const siguienteEp = episodiosTemporada.find((ep: any) => ep.episode_num === parseInt(episodio) + 1);
        
        if (siguienteEp) {
          setSiguienteEpisodio(siguienteEp);
        } else {
          // Buscar primer episodio de la siguiente temporada
          const siguienteTemp = (parseInt(temporada) + 1).toString();
          if (info.episodes[siguienteTemp] && info.episodes[siguienteTemp].length > 0) {
            setSiguienteEpisodio({
              ...info.episodes[siguienteTemp][0],
              esSiguienteTemporada: true,
              temporada: siguienteTemp
            });
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar siguiente episodio:', error);
    }
  };

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
          
          // Para streams en vivo, no usar la duración del buffer
          if (!esTvEnVivo) {
            setDuracion(duration);
          } else {
            // En modo live, la duración no es relevante
            setDuracion(0);
          }
          
          setReproduciendo(playing);
          
          // Ocultar cargando si el video está reproduciendo
          if (playing && cargando) {
            setCargando(false);
          }

          // Mostrar siguiente episodio cuando falten 30 segundos (solo para series)
          if (serie && siguienteEpisodio && duration > 0 && !esTvEnVivo) {
            const tiempoRestante = duration - currentTime;
            if (tiempoRestante <= 30 && tiempoRestante > 0 && !mostrarSiguienteEpisodio) {
              setMostrarSiguienteEpisodio(true);
              setCuentaRegresiva(Math.floor(tiempoRestante));
            }
            if (mostrarSiguienteEpisodio && tiempoRestante > 0) {
              setCuentaRegresiva(Math.floor(tiempoRestante));
            }
          }
        } catch (error) {
          // Player ya fue liberado, ignorar
        }
      }
    }, 1000); // Actualizar cada segundo para la cuenta regresiva

    return () => clearInterval(interval);
  }, [player, cargando, esTvEnVivo, siguienteEpisodio, mostrarSiguienteEpisodio, serie]);

  // Guardar progreso periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && !esTvEnVivo) {
        try {
          const currentTime = player.currentTime;
          const duration = player.duration;
          
          if (duration > 0 && currentTime > 0) {
            const porcentaje = (currentTime / duration) * 100;
            
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
              imagen,
            };
            
            guardarProgreso(progreso);
          }
        } catch (error) {
          // Player ya fue liberado, ignorar
        }
      }
    }, 10000); // Guardar cada 10 segundos

    return () => clearInterval(interval);
  }, [player, esTvEnVivo, titulo, streamId, serieId, temporada, episodio, serie]);

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
          imagen,
        };
        
        guardarProgreso(progreso);
      }
    };
  }, [esTvEnVivo, duracion, posicion, titulo, streamId, serieId, temporada, episodio, url]);

  useEffect(() => {
    if (mostrarControles && !bloqueado) {
      // Animación rápida de aparición (150ms en lugar de 300ms)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
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
      if (!mostrarControles) {
        // Mostrar controles instantáneamente
        fadeAnim.setValue(1);
        setMostrarControles(true);
      } else {
        // Ocultar con animación suave
        ocultarControles();
      }
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

  const abrirSelectorEpisodios = async () => {
    if (serie) {
      setModalEpisodios(true);
      setCargandoEpisodios(true);
      try {
        const info = await iptvServicio.getSeriesInfo(serieId);
        if (info.episodes) {
          setEpisodiosSerie(info.episodes);
          setTemporadaModal(temporada || Object.keys(info.episodes)[0]);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los episodios');
      } finally {
        setCargandoEpisodios(false);
      }
    }
  };

  const cerrarModalEpisodios = () => {
    setModalEpisodios(false);
  };

  const seleccionarEpisodio = (episodio: any) => {
    const url = iptvServicio.getSeriesStreamUrl(
      episodio.id,
      episodio.container_extension
    );

    setModalEpisodios(false);
    
    navigation.replace('Reproductor', {
      url,
      titulo: `${serie.name} - T${temporadaModal}E${episodio.episode_num} - ${episodio.title}`,
      serie: serie,
      temporada: temporadaModal,
      episodio: episodio.episode_num,
      serieId: serieId,
      streamId: episodio.id,
    });
  };

  const volverACanales = async () => {
    // Abrir modal de canales
    setModalCanales(true);
    setCargandoCanales(true);
    try {
      const [canales, categorias] = await Promise.all([
        iptvServicio.getLiveStreams(),
        iptvServicio.getLiveCategories(),
      ]);
      
      setCanalesTv(canales);
      setCanalesFiltrados(canales);
      setCategoriasTv([
        { category_id: 'all', category_name: 'Todos', parent_id: 0 },
        ...categorias
      ]);
      setCategoriaSeleccionada('all');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los canales');
    } finally {
      setCargandoCanales(false);
    }
  };

  const filtrarCanalesPorCategoria = (categoriaId: string) => {
    setCategoriaSeleccionada(categoriaId);
    
    if (categoriaId === 'all') {
      setCanalesFiltrados(canalesTv);
    } else {
      const filtrados = canalesTv.filter(canal => canal.category_id === categoriaId);
      setCanalesFiltrados(filtrados);
    }
  };

  const cerrarModalCanales = () => {
    setModalCanales(false);
  };

  const seleccionarCanal = (canal: any) => {
    const url = iptvServicio.getLiveStreamUrl(canal.stream_id, canal.container_extension);
    
    setModalCanales(false);
    
    navigation.replace('Reproductor', {
      url,
      titulo: canal.name,
      esTvEnVivo: true,
      streamId: canal.stream_id,
    });
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

  const cambiarBrillo = async (nuevoBrillo: number) => {
    try {
      setBrillo(nuevoBrillo);
      await Brightness.setBrightnessAsync(nuevoBrillo);
    } catch (error) {
      console.error('Error al cambiar brillo:', error);
    }
  };

  const abrirModalConfiguracion = () => {
    setModalConfiguracion(true);
  };

  const cerrarModalConfiguracion = () => {
    setModalConfiguracion(false);
  };

  const cambiarPistaAudio = (index: number) => {
    try {
      setPistaAudioSeleccionada(index);
      // expo-video maneja el cambio de pista automáticamente
      if (player && player.audioTracks && player.audioTracks[index]) {
        // Aquí se cambiaría la pista si la API lo permite
        console.log('Cambiando a pista de audio:', index);
      }
    } catch (error) {
      console.error('Error al cambiar pista de audio:', error);
    }
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

  // Manejar toque en la barra de progreso
  const manejarToqueBarra = (event: any) => {
    if (!barraRef.current || duracion === 0 || !player) return;

    barraRef.current.measure((fx, fy, width, height, px, py) => {
      const touchX = event.nativeEvent.pageX - px;
      const porcentaje = Math.max(0, Math.min(100, (touchX / width) * 100));
      const nuevaPosicion = (porcentaje / 100) * duracion;
      
      player.currentTime = nuevaPosicion;
      setPosicion(nuevaPosicion);
    });
  };

  const reproducirSiguienteEpisodio = () => {
    if (!siguienteEpisodio) return;

    const tempActual = siguienteEpisodio.esSiguienteTemporada ? siguienteEpisodio.temporada : temporada;
    const url = iptvServicio.getSeriesStreamUrl(
      siguienteEpisodio.id,
      siguienteEpisodio.container_extension
    );

    navigation.replace('Reproductor', {
      url,
      titulo: `${serie.name} - T${tempActual}E${siguienteEpisodio.episode_num} - ${siguienteEpisodio.title}`,
      serie: serie,
      temporada: tempActual,
      episodio: siguienteEpisodio.episode_num,
      serieId: serieId,
      streamId: siguienteEpisodio.id,
    });
  };

  const cancelarSiguienteEpisodio = () => {
    setMostrarSiguienteEpisodio(false);
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

        {/* Siguiente Episodio */}
        {mostrarSiguienteEpisodio && siguienteEpisodio && (
          <View style={styles.siguienteEpisodioContainer}>
            <View style={styles.siguienteEpisodioCard}>
              <View style={styles.siguienteEpisodioHeader}>
                <Text style={styles.siguienteEpisodioTitulo}>Siguiente episodio</Text>
                <TouchableOpacity onPress={cancelarSiguienteEpisodio}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.siguienteEpisodioInfo}>
                {siguienteEpisodio.esSiguienteTemporada 
                  ? `Temporada ${siguienteEpisodio.temporada} - Episodio ${siguienteEpisodio.episode_num}`
                  : `Episodio ${siguienteEpisodio.episode_num}`
                }
              </Text>
              <Text style={styles.siguienteEpisodioNombre} numberOfLines={2}>
                {siguienteEpisodio.title}
              </Text>

              <View style={styles.siguienteEpisodioAcciones}>
                <Text style={styles.cuentaRegresivaTexto}>
                  Reproduciendo en {cuentaRegresiva}s
                </Text>
                <TouchableOpacity 
                  style={styles.botonReproducirAhora}
                  onPress={reproducirSiguienteEpisodio}
                >
                  <Ionicons name="play" size={20} color="#FFF" />
                  <Text style={styles.botonReproducirTexto}>Reproducir ahora</Text>
                </TouchableOpacity>
              </View>
            </View>
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
                  <>
                    <TouchableOpacity 
                      style={styles.botonHeader}
                      onPress={manejarFavorito}
                    >
                      <Ionicons 
                        name={esFav ? "heart" : "heart-outline"} 
                        size={24} 
                        color={esFav ? COLORS.primary : "#FFF"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.botonHeader}
                      onPress={volverACanales}
                    >
                      <Ionicons name="tv" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </>
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
              {/* Solo mostrar botones de adelantar/retroceder si NO es TV en vivo */}
              {!esTvEnVivo && (
                <TouchableOpacity
                  style={styles.botonControl}
                  onPress={() => adelantar(-10)}
                >
                  <Ionicons name="play-back" size={40} color="#FFF" />
                  <Text style={styles.textoControl}>10s</Text>
                </TouchableOpacity>
              )}

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

              {!esTvEnVivo && (
                <TouchableOpacity
                  style={styles.botonControl}
                  onPress={() => adelantar(10)}
                >
                  <Ionicons name="play-forward" size={40} color="#FFF" />
                  <Text style={styles.textoControl}>10s</Text>
                </TouchableOpacity>
              )}
              
              {/* Para TV en vivo, mostrar indicador LIVE */}
              {esTvEnVivo && (
                <View style={styles.liveIndicador}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveTexto}>EN VIVO</Text>
                </View>
              )}
            </View>

            {/* Footer con Barra de Progreso */}
            <View style={styles.footer}>
              {/* Barra de Progreso - Solo para contenido bajo demanda */}
              {!esTvEnVivo && (
                <View style={styles.progresoContainer}>
                  <Text style={styles.tiempo}>
                    {formatearTiempo(posicion)}
                  </Text>
                  <Pressable 
                    ref={barraRef}
                    style={styles.barraPrincipal}
                    onPress={manejarToqueBarra}
                  >
                    <View style={styles.barraFondo}>
                      <View
                        style={[
                          styles.barraProgreso, 
                          { width: `${calcularProgreso()}%` }
                        ]}
                      />
                    </View>
                  </Pressable>
                  <Text style={styles.tiempo}>
                    {duracion > 0 ? formatearTiempo(duracion) : '--:--'}
                  </Text>
                </View>
              )}
              
              {/* Para TV en vivo, mostrar solo indicador de tiempo */}
              {esTvEnVivo && (
                <View style={styles.liveInfoContainer}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDotSmall} />
                    <Text style={styles.liveBadgeText}>TRANSMISIÓN EN VIVO</Text>
                  </View>
                </View>
              )}

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
                  <TouchableOpacity 
                    style={styles.botonInferior}
                    onPress={abrirModalConfiguracion}
                  >
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

      {/* Modal de Episodios Estilo Netflix */}
      <Modal
        visible={modalEpisodios}
        animationType="slide"
        transparent={true}
        onRequestClose={cerrarModalEpisodios}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitulo}>{serie?.name}</Text>
                <Text style={styles.modalSubtitulo}>Selecciona un episodio</Text>
              </View>
              <TouchableOpacity onPress={cerrarModalEpisodios} style={styles.modalBotonCerrar}>
                <Ionicons name="close" size={32} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Selector de Temporadas */}
            <View style={styles.modalTemporadas}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalTemporadasScroll}
              >
                {Object.keys(episodiosSerie).sort((a, b) => parseInt(a) - parseInt(b)).map((temp) => (
                  <TouchableOpacity
                    key={temp}
                    style={[
                      styles.modalTemporadaBtn,
                      temp === temporadaModal && styles.modalTemporadaBtnActiva
                    ]}
                    onPress={() => setTemporadaModal(temp)}
                  >
                    <Text style={[
                      styles.modalTemporadaTexto,
                      temp === temporadaModal && styles.modalTemporadaTextoActivo
                    ]}>
                      Temporada {temp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Lista de Episodios */}
            {cargandoEpisodios ? (
              <View style={styles.modalCargando}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <FlatList
                data={episodiosSerie[temporadaModal] || []}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalEpisodiosLista}
                renderItem={({ item, index }) => {
                  const esActual = temporadaModal === temporada && item.episode_num === parseInt(episodio);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalEpisodioItem,
                        esActual && styles.modalEpisodioItemActivo
                      ]}
                      onPress={() => seleccionarEpisodio(item)}
                    >
                      <View style={styles.modalEpisodioNumero}>
                        <Text style={styles.modalEpisodioNumeroTexto}>
                          {item.episode_num}
                        </Text>
                      </View>
                      
                      <View style={styles.modalEpisodioInfo}>
                        <View style={styles.modalEpisodioTituloContainer}>
                          <Text style={styles.modalEpisodioTitulo} numberOfLines={1}>
                            {item.title || `Episodio ${item.episode_num}`}
                          </Text>
                          {esActual && (
                            <View style={styles.modalReproduciendoBadge}>
                              <Ionicons name="play" size={12} color="#FFF" />
                              <Text style={styles.modalReproduciendoTexto}>Reproduciendo</Text>
                            </View>
                          )}
                        </View>
                        
                        {item.info?.duration && (
                          <Text style={styles.modalEpisodoDuracion}>
                            {item.info.duration}
                          </Text>
                        )}
                        
                        {item.info?.plot && (
                          <Text style={styles.modalEpisodioDescripcion} numberOfLines={2}>
                            {item.info.plot}
                          </Text>
                        )}
                      </View>

                      <Ionicons 
                        name={esActual ? "checkmark-circle" : "play-circle"} 
                        size={32} 
                        color={esActual ? COLORS.primary : COLORS.textSecondary} 
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Canales de TV */}
      <Modal
        visible={modalCanales}
        animationType="slide"
        transparent={true}
        onRequestClose={cerrarModalCanales}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitulo}>Canales de TV</Text>
                <Text style={styles.modalSubtitulo}>
                  {categoriaSeleccionada === 'all' 
                    ? `${canalesFiltrados.length} canales` 
                    : `${canalesFiltrados.length} canales en esta categoría`}
                </Text>
              </View>
              <TouchableOpacity onPress={cerrarModalCanales} style={styles.modalBotonCerrar}>
                <Ionicons name="close" size={32} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Selector de Categorías */}
            <View style={styles.modalTemporadas}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalTemporadasScroll}
              >
                {categoriasTv.map((cat) => {
                  const isSelected = cat.category_id === categoriaSeleccionada;
                  const cantidadCanales = cat.category_id === 'all' 
                    ? canalesTv.length 
                    : canalesTv.filter(c => c.category_id === cat.category_id).length;
                  
                  return (
                    <TouchableOpacity
                      key={cat.category_id}
                      style={[
                        styles.modalTemporadaBtn,
                        isSelected && styles.modalTemporadaBtnActiva
                      ]}
                      onPress={() => filtrarCanalesPorCategoria(cat.category_id)}
                    >
                      <Text style={[
                        styles.modalTemporadaTexto,
                        isSelected && styles.modalTemporadaTextoActivo
                      ]}>
                        {cat.category_name}
                      </Text>
                      <Text style={[
                        styles.modalCategoriaCantidad,
                        isSelected && styles.modalCategoriaCantidadActiva
                      ]}>
                        {cantidadCanales}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Lista de Canales */}
            {cargandoCanales ? (
              <View style={styles.modalCargando}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <FlatList
                data={canalesFiltrados}
                keyExtractor={(item) => item.stream_id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalEpisodiosLista}
                renderItem={({ item }) => {
                  const esActual = streamId === item.stream_id;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalCanalItem,
                        esActual && styles.modalCanalItemActivo
                      ]}
                      onPress={() => seleccionarCanal(item)}
                    >
                      <View style={styles.modalCanalIcono}>
                        {item.stream_icon ? (
                          <Image 
                            source={{ uri: item.stream_icon }}
                            style={styles.modalCanalLogo}
                            resizeMode="contain"
                          />
                        ) : (
                          <Ionicons 
                            name="tv" 
                            size={24} 
                            color={esActual ? COLORS.primary : COLORS.text} 
                          />
                        )}
                      </View>
                      
                      <View style={styles.modalEpisodioInfo}>
                        <View style={styles.modalEpisodioTituloContainer}>
                          <Text style={styles.modalCanalNombre} numberOfLines={1}>
                            {item.name}
                          </Text>
                          {esActual && (
                            <View style={styles.modalReproduciendoBadge}>
                              <Ionicons name="play" size={12} color="#FFF" />
                              <Text style={styles.modalReproduciendoTexto}>En vivo</Text>
                            </View>
                          )}
                        </View>
                        
                        {item.category_name && (
                          <Text style={styles.modalEpisodoDuracion}>
                            {item.category_name}
                          </Text>
                        )}
                      </View>

                      <Ionicons 
                        name={esActual ? "checkmark-circle" : "play-circle"} 
                        size={32} 
                        color={esActual ? COLORS.primary : COLORS.textSecondary} 
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Configuración */}
      <Modal
        visible={modalConfiguracion}
        animationType="slide"
        transparent={true}
        onRequestClose={cerrarModalConfiguracion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitulo}>Configuración</Text>
                <Text style={styles.modalSubtitulo}>Ajustes de reproducción</Text>
              </View>
              <TouchableOpacity onPress={cerrarModalConfiguracion} style={styles.modalBotonCerrar}>
                <Ionicons name="close" size={32} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.modalConfiguracionScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Control de Brillo */}
              <View style={styles.configuracionSeccion}>
                <View style={styles.configuracionHeader}>
                  <Ionicons name="sunny" size={24} color={COLORS.primary} />
                  <Text style={styles.configuracionTitulo}>Brillo</Text>
                </View>
                <View style={styles.configuracionControl}>
                  <Ionicons name="sunny-outline" size={20} color={COLORS.textSecondary} />
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={brillo}
                    onValueChange={cambiarBrillo}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbTintColor={COLORS.primary}
                  />
                  <Ionicons name="sunny" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.configuracionValor}>{Math.round(brillo * 100)}%</Text>
                </View>
              </View>

              {/* Selector de Idioma de Audio */}
              {pistasAudio.length > 0 && (
                <View style={styles.configuracionSeccion}>
                  <View style={styles.configuracionHeader}>
                    <Ionicons name="language" size={24} color={COLORS.primary} />
                    <Text style={styles.configuracionTitulo}>Idioma de Audio</Text>
                  </View>
                  {pistasAudio.map((pista, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.configuracionOpcion,
                        pistaAudioSeleccionada === index && styles.configuracionOpcionActiva
                      ]}
                      onPress={() => cambiarPistaAudio(index)}
                    >
                      <Text style={[
                        styles.configuracionOpcionTexto,
                        pistaAudioSeleccionada === index && styles.configuracionOpcionTextoActivo
                      ]}>
                        {pista.language || `Audio ${index + 1}`}
                      </Text>
                      {pistaAudioSeleccionada === index && (
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Información del Video */}
              <View style={styles.configuracionSeccion}>
                <View style={styles.configuracionHeader}>
                  <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                  <Text style={styles.configuracionTitulo}>Información</Text>
                </View>
                <View style={styles.configuracionInfo}>
                  <Text style={styles.configuracionInfoTexto}>
                    Duración: {formatearTiempo(duracion)}
                  </Text>
                  <Text style={styles.configuracionInfoTexto}>
                    Posición: {formatearTiempo(posicion)}
                  </Text>
                  {serie && (
                    <Text style={styles.configuracionInfoTexto}>
                      Temporada {temporada} - Episodio {episodio}
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 10, // Área de toque más grande
    justifyContent: 'center',
  },
  barraFondo: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  barraProgreso: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
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
  siguienteEpisodioContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 320,
    zIndex: 999,
  },
  siguienteEpisodioCard: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  siguienteEpisodioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  siguienteEpisodioTitulo: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  siguienteEpisodioInfo: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 5,
  },
  siguienteEpisodioNombre: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 15,
  },
  siguienteEpisodioAcciones: {
    alignItems: 'center',
  },
  cuentaRegresivaTexto: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 10,
  },
  botonReproducirAhora: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  botonReproducirTexto: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Estilos del Modal de Episodios
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 3,
  },
  modalSubtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  modalBotonCerrar: {
    padding: 5,
  },
  modalTemporadas: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalTemporadasScroll: {
    paddingHorizontal: 15,
    gap: 8,
  },
  modalTemporadaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTemporadaBtnActiva: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalTemporadaTexto: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalTemporadaTextoActivo: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalCargando: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEpisodiosLista: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalEpisodioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modalEpisodioItemActivo: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
  },
  modalEpisodioNumero: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalEpisodioNumeroTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalEpisodioInfo: {
    flex: 1,
    marginRight: 10,
  },
  modalEpisodioTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalEpisodioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  modalReproduciendoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  modalReproduciendoTexto: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  modalEpisodoDuracion: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 3,
    opacity: 0.7,
  },
  modalEpisodioDescripcion: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    opacity: 0.7,
  },
  // Estilos específicos para modal de canales
  modalCanalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modalCanalItemActivo: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
  },
  modalCanalIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  modalCanalLogo: {
    width: '100%',
    height: '100%',
  },
  modalCanalNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  modalCategoriaCantidad: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
    fontWeight: '500',
  },
  modalCategoriaCantidadActiva: {
    color: 'rgba(255,255,255,0.9)',
  },
  // Estilos del modal de configuración
  modalConfiguracionScroll: {
    paddingBottom: 20,
  },
  configuracionSeccion: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  configuracionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  configuracionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
  },
  configuracionControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  configuracionValor: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 45,
    textAlign: 'right',
  },
  configuracionOpcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  configuracionOpcionActiva: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
  },
  configuracionOpcionTexto: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  configuracionOpcionTextoActivo: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  configuracionInfo: {
    gap: 8,
  },
  configuracionInfoTexto: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Estilos para indicador LIVE
  liveIndicador: {
    position: 'absolute',
    top: -60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  liveTexto: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  liveInfoContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  liveDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
    marginRight: 8,
  },
  liveBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

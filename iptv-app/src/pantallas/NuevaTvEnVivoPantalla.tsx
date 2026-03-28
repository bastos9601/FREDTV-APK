import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { WebView } from 'react-native-webview';
import iptvServicio, { LiveStream, Category } from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';
import { useAuth } from '../contexto/AuthContext';
import { toggleFavorito, esFavorito, obtenerFavoritosPorTipo, Favorito } from '../utils/favoritosStorage';
import { useSupabaseData } from '../hooks/useSupabaseData';

const { width } = Dimensions.get('window');

export const NuevaTvEnVivoPantalla = () => {
  const [canales, setCanales] = useState<LiveStream[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('all');
  const [canalActual, setCanalActual] = useState<LiveStream | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoCanal, setCargandoCanal] = useState(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [urlVideo, setUrlVideo] = useState<string>('');
  const [audioHabilitado, setAudioHabilitado] = useState(true);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [canalesFavoritos, setCanalesFavoritos] = useState<Set<string>>(new Set());
  const navigation = useNavigation<any>();
  const { perfilActivo } = usePerfilActivo();
  const { usuario } = useAuth();
  const { obtenerFavoritos: obtenerFavoritosSupabase } = useSupabaseData();
  const scrollViewRef = useRef<any>(null);

  // HTML para reproducir HLS en WebView
  const getVideoHTML = (url: string, conAudio: boolean = true) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
                width: 100%; 
                height: 100%; 
                background: #000; 
                overflow: hidden;
            }
            video { 
                width: 100%; 
                height: 100%; 
                object-fit: cover;
                display: block;
            }
        </style>
    </head>
    <body>
        <video id="video" autoplay ${conAudio ? '' : 'muted'} playsinline controls="false"></video>
        <script>
            const video = document.getElementById('video');
            const videoSrc = '${url}';
            
            function sendMessage(message) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(message));
                }
            }
            
            sendMessage({ type: 'log', message: 'Intentando cargar video: ' + videoSrc });
            
            // Configurar volumen inicial
            video.volume = ${conAudio ? '0.8' : '0'}; // 80% de volumen o silenciado
            video.muted = ${conAudio ? 'false' : 'true'};
            
            if (Hls.isSupported()) {
                sendMessage({ type: 'log', message: 'HLS soportado, usando HLS.js' });
                const hls = new Hls({
                    enableWorker: false,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                
                hls.loadSource(videoSrc);
                hls.attachMedia(video);
                
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    sendMessage({ type: 'log', message: 'Manifest parseado, iniciando reproducción' });
                    video.play().then(() => {
                        sendMessage({ type: 'success', message: 'Video iniciado correctamente' });
                    }).catch(e => {
                        sendMessage({ type: 'error', message: 'Error al reproducir: ' + e.message });
                    });
                });
                
                hls.on(Hls.Events.ERROR, function(event, data) {
                    sendMessage({ type: 'error', message: 'Error HLS: ' + JSON.stringify(data) });
                });
                
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                sendMessage({ type: 'log', message: 'Usando reproducción nativa' });
                video.src = videoSrc;
                video.addEventListener('loadedmetadata', function() {
                    sendMessage({ type: 'log', message: 'Metadata cargada, iniciando reproducción' });
                    video.play().then(() => {
                        sendMessage({ type: 'success', message: 'Video nativo iniciado correctamente' });
                    }).catch(e => {
                        sendMessage({ type: 'error', message: 'Error al reproducir nativo: ' + e.message });
                    });
                });
            } else {
                sendMessage({ type: 'error', message: 'HLS no soportado en este dispositivo' });
            }
            
            video.addEventListener('error', function(e) {
                sendMessage({ type: 'error', message: 'Error de video: ' + e.message });
            });
            
            video.addEventListener('loadstart', function() {
                sendMessage({ type: 'log', message: 'Video loadstart' });
            });
            
            video.addEventListener('canplay', function() {
                sendMessage({ type: 'log', message: 'Video canplay' });
            });
            
            video.addEventListener('playing', function() {
                sendMessage({ type: 'success', message: 'Video playing' });
            });
        </script>
    </body>
    </html>
  `;

  useEffect(() => {
    cargarDatos();
  }, []);

  // Efecto para recargar el video cuando cambie el estado del audio
  useEffect(() => {
    if (urlVideo && canalActual) {
      // Forzar recarga del WebView cuando cambie el audio
      const tempUrl = urlVideo;
      setUrlVideo('');
      setTimeout(() => {
        setUrlVideo(tempUrl);
      }, 100);
    }
  }, [audioHabilitado]);

  const cargarDatos = async () => {
    try {
      const [canalesData, categoriasData] = await Promise.all([
        iptvServicio.getLiveStreams(),
        iptvServicio.getLiveCategories(),
      ]);
      
      setCanales(canalesData);
      setCategorias([{ category_id: 'all', category_name: 'Todos los Canales', parent_id: 0 }, ...categoriasData]);
      
      // Cargar favoritos del almacenamiento local
      const favoritosLocal = await obtenerFavoritosPorTipo('canal', perfilActivo?.id);
      
      // Si hay usuario, también cargar favoritos de Supabase y sincronizar
      let favoritosFinal = favoritosLocal;
      if (usuario?.username && perfilActivo?.id) {
        try {
          console.log('Cargando favoritos de Supabase para usuario:', usuario.username, 'perfil:', perfilActivo.id);
          const favoritosSupabase = await obtenerFavoritosSupabase(perfilActivo.id);
          console.log('Favoritos de Supabase cargados:', favoritosSupabase.length);
          
          // Convertir favoritos de Supabase al formato local
          const favoritosSupabaseFormateados: Favorito[] = favoritosSupabase.map(fav => ({
            id: fav.canal_id,
            tipo: 'canal' as const,
            nombre: fav.titulo,
            imagen: fav.imagen,
            streamId: parseInt(fav.canal_id),
            fecha: new Date(fav.fecha_agregado).getTime(),
            datos: null,
          }));
          
          // Combinar favoritos locales y de Supabase (Supabase tiene prioridad)
          const favoritosIds = new Set(favoritosSupabaseFormateados.map(f => f.id));
          const favoritosLocalUnicos = favoritosLocal.filter(f => !favoritosIds.has(f.id));
          favoritosFinal = [...favoritosSupabaseFormateados, ...favoritosLocalUnicos];
          
        } catch (error) {
          console.error('Error cargando favoritos de Supabase:', error);
          // Si falla Supabase, usar solo los locales
          favoritosFinal = favoritosLocal;
        }
      }
      
      setFavoritos(favoritosFinal);
      
      // Crear set de IDs de canales favoritos para acceso rápido
      const favoritosIds = new Set(favoritosFinal.map(f => f.id));
      setCanalesFavoritos(favoritosIds);
      
      // No establecer canal por defecto, dejar que el usuario seleccione
      // if (canalesData.length > 0) {
      //   setCanalActual(canalesData[0]);
      // }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los canales');
    } finally {
      setCargando(false);
    }
  };

  const filtrarCanalesPorCategoria = (categoryId: string) => {
    if (categoryId === 'all') {
      return canales;
    }
    return canales.filter((canal) => canal.category_id === categoryId);
  };

  // Función para filtrar canales por búsqueda
  const filtrarCanalesPorBusqueda = (texto: string) => {
    if (!texto.trim()) return canales;
    
    const textoBusqueda = texto.toLowerCase();
    
    return canales.filter((canal) => {
      // Buscar en el nombre del canal
      const coincideNombre = canal.name.toLowerCase().includes(textoBusqueda);
      
      // Buscar en el nombre de la categoría
      const categoria = categorias.find(cat => cat.category_id === canal.category_id);
      const coincideCategoria = categoria ? 
        categoria.category_name.toLowerCase().includes(textoBusqueda) : false;
      
      return coincideNombre || coincideCategoria;
    });
  };

  // Función para obtener canales filtrados (por búsqueda o categoría)
  const obtenerCanalesFiltrados = () => {
    if (busqueda.trim()) {
      return filtrarCanalesPorBusqueda(busqueda);
    }
    
    if (categoriaSeleccionada === 'favoritos') {
      // Retornar solo los canales que están en favoritos
      return canales.filter(canal => canalesFavoritos.has(canal.stream_id.toString()));
    }
    
    return filtrarCanalesPorCategoria(categoriaSeleccionada);
  };

  // Función para manejar favoritos
  const manejarFavorito = async (canal: LiveStream) => {
    try {
      const favoritoData: Favorito = {
        id: canal.stream_id.toString(),
        tipo: 'canal',
        nombre: canal.name,
        imagen: canal.stream_icon,
        streamId: canal.stream_id,
        fecha: Date.now(),
        datos: canal,
      };

      const esFav = await toggleFavorito(favoritoData, usuario?.username, perfilActivo?.id);
      
      // Actualizar el estado local
      if (esFav) {
        setCanalesFavoritos(prev => new Set([...prev, canal.stream_id.toString()]));
        setFavoritos(prev => [...prev, favoritoData]);
      } else {
        setCanalesFavoritos(prev => {
          const newSet = new Set(prev);
          newSet.delete(canal.stream_id.toString());
          return newSet;
        });
        setFavoritos(prev => prev.filter(f => f.id !== canal.stream_id.toString()));
      }
    } catch (error) {
      console.error('Error al manejar favorito:', error);
      Alert.alert('Error', 'No se pudo actualizar el favorito');
    }
  };

  const seleccionarCanal = async (canal: LiveStream) => {
    setCargandoCanal(true);
    setCanalActual(canal);
    setUrlVideo(''); // Limpiar URL anterior
    
    // Si estamos en una vista de categoría específica, regresar a la vista principal
    if (categoriaSeleccionada !== 'all') {
      setCategoriaSeleccionada('all');
    }
    
    try {
      // Obtener URL del stream
      const url = iptvServicio.getLiveStreamUrl(canal.stream_id, 'm3u8');
      console.log('URL del canal:', url);
      
      // Scroll hacia arriba para mostrar la vista previa
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      
      // Establecer la nueva URL después de un pequeño delay
      setTimeout(() => {
        setUrlVideo(url);
        setCargandoCanal(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error al cargar canal:', error);
      setCargandoCanal(false);
      Alert.alert('Error', 'No se pudo cargar el canal');
    }
  };

  const abrirReproductor = () => {
    if (!canalActual) return;
    
    const url = iptvServicio.getLiveStreamUrl(canalActual.stream_id, 'm3u8');
    navigation.navigate('Reproductor', {
      url,
      titulo: canalActual.name,
      esTvEnVivo: true,
      streamId: canalActual.stream_id,
      imagen: canalActual.stream_icon,
    });
  };

  const renderCanalCard = (canal: LiveStream) => {
    const isPlaying = canalActual?.stream_id === canal.stream_id;
    
    return (
      <TouchableOpacity
        key={canal.stream_id}
        style={styles.canalCard}
        onPress={() => seleccionarCanal(canal)}
      >
        <View style={styles.canalCardImagen}>
          {canal.stream_icon ? (
            <Image
              source={{ uri: canal.stream_icon }}
              style={styles.canalCardImg}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.canalCardPlaceholder}>
              <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
            </View>
          )}
          {isPlaying && (
            <View style={styles.canalCardPlayingBadge}>
              <Ionicons name="play" size={12} color="#FFF" />
            </View>
          )}
        </View>
        <Text style={styles.canalCardNombre} numberOfLines={2}>
          {canal.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoriaSeccion = (categoria: Category) => {
    const canalesCategoria = filtrarCanalesPorCategoria(categoria.category_id);
    
    if (canalesCategoria.length === 0) return null;
    
    return (
      <View key={categoria.category_id} style={styles.categoriaSeccion}>
        <View style={styles.categoriaSeccionHeader}>
          <Text style={styles.categoriaSeccionTitulo}>
            {categoria.category_name} ({canalesCategoria.length})
          </Text>
          <TouchableOpacity>
            <Text style={styles.verTodoBtn}>Ver Todo</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.canalesHorizontal}
        >
          {canalesCategoria.slice(0, 10).map((canal) => renderCanalCard(canal))}
        </ScrollView>
      </View>
    );
  };

  const renderCategoriaItem = (categoria: Category) => {
    const canalesCategoria = filtrarCanalesPorCategoria(categoria.category_id);
    
    if (canalesCategoria.length === 0) return null;
    
    return (
      <View key={categoria.category_id} style={styles.categoriaSeccion}>
        <View style={styles.categoriaSeccionHeader}>
          <Text style={styles.categoriaSeccionTitulo}>
            {categoria.category_name} ({canalesCategoria.length})
          </Text>
          <TouchableOpacity onPress={() => setCategoriaSeleccionada(categoria.category_id)}>
            <Text style={styles.verTodoBtn}>Ver Todo</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.canalesHorizontal}
        >
          {canalesCategoria.slice(0, 10).map((canal) => (
            <TouchableOpacity
              key={canal.stream_id}
              style={styles.canalCard}
              onPress={() => seleccionarCanal(canal)}
            >
              <View style={styles.canalCardImagen}>
                {canal.stream_icon ? (
                  <Image
                    source={{ uri: canal.stream_icon }}
                    style={styles.canalCardImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.canalCardPlaceholder}>
                    <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
                  </View>
                )}
                {canalActual?.stream_id === canal.stream_id && (
                  <View style={styles.canalCardPlayingBadge}>
                    <Ionicons name="play" size={12} color="#FFF" />
                  </View>
                )}
                {/* Botón de favorito */}
                <TouchableOpacity 
                  style={styles.canalCardFavBtn}
                  onPress={(e: any) => {
                    e.stopPropagation();
                    manejarFavorito(canal);
                  }}
                >
                  <Ionicons 
                    name={canalesFavoritos.has(canal.stream_id.toString()) ? "heart" : "heart-outline"} 
                    size={16} 
                    color={canalesFavoritos.has(canal.stream_id.toString()) ? COLORS.primary : "#FFF"} 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.canalCardNombre} numberOfLines={2}>
                {canal.name}
              </Text>
              <Text style={styles.canalCardEstado}>
                {canalActual?.stream_id === canal.stream_id ? 'Reproduciendo ahora' : 'No se encontró ningún programa'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Función para renderizar resultados de búsqueda
  const renderResultadosBusqueda = () => {
    const canalesFiltrados = filtrarCanalesPorBusqueda(busqueda);
    
    if (canalesFiltrados.length === 0) {
      return (
        <View style={styles.sinResultados}>
          <Ionicons name="search-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.sinResultadosTexto}>
            No se encontraron canales para "{busqueda}"
          </Text>
          <Text style={styles.sinResultadosSubtexto}>
            Intenta con otro término de búsqueda
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.resultadosBusqueda}>
        <Text style={styles.resultadosBusquedaTitulo}>
          Resultados para "{busqueda}" ({canalesFiltrados.length})
        </Text>
        <View style={styles.canalesGrid}>
          {canalesFiltrados.map((canal) => (
            <TouchableOpacity
              key={canal.stream_id}
              style={styles.canalGridItem}
              onPress={() => seleccionarCanal(canal)}
            >
              <View style={styles.canalGridImagen}>
                {canal.stream_icon ? (
                  <Image
                    source={{ uri: canal.stream_icon }}
                    style={styles.canalGridImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.canalGridPlaceholder}>
                    <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
                  </View>
                )}
                {canalActual?.stream_id === canal.stream_id && (
                  <View style={styles.canalCardPlayingBadge}>
                    <Ionicons name="play" size={12} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={styles.canalGridNombre} numberOfLines={2}>
                {canal.name}
              </Text>
              <Text style={styles.canalGridEstado}>
                {canalActual?.stream_id === canal.stream_id ? 'Reproduciendo ahora' : 'No se encontró ningún programa'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCanalesGrid = () => {
    const canalesFiltrados = obtenerCanalesFiltrados();
    
    return (
      <View style={styles.canalesGrid}>
        {canalesFiltrados.map((canal) => (
          <TouchableOpacity
            key={canal.stream_id}
            style={styles.canalGridItem}
            onPress={() => seleccionarCanal(canal)}
          >
            <View style={styles.canalGridImagen}>
              {canal.stream_icon ? (
                <Image
                  source={{ uri: canal.stream_icon }}
                  style={styles.canalGridImg}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.canalGridPlaceholder}>
                  <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
                </View>
              )}
            </View>
            <Text style={styles.canalGridNombre} numberOfLines={2}>
              {canal.name}
            </Text>
            <Text style={styles.canalGridEstado}>No se encontró ningún...</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerNombre}>{perfilActivo?.nombre || 'Usuario'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => setMostrarBuscador(!mostrarBuscador)}
          >
            <Ionicons name="search" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="person-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Buscador */}
      {mostrarBuscador && (
        <View style={styles.buscadorContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.buscadorInput}
            placeholder="Buscar canales o categorías (ej: peru, deportes)..."
            placeholderTextColor={COLORS.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
            autoFocus
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Vista previa del Canal Actual - Fija */}
      {categoriaSeleccionada === 'all' && (
        <TouchableOpacity 
          style={styles.canalActualContainer}
          onPress={canalActual ? abrirReproductor : undefined}
          activeOpacity={canalActual ? 0.8 : 1}
        >
          <View style={styles.canalActualImagen}>
            {canalActual ? (
              <>
                {cargandoCanal ? (
                  <View style={styles.canalActualCargando}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.cargandoTexto}>Cargando canal...</Text>
                  </View>
                ) : urlVideo ? (
                  <>
                    <WebView
                      source={{ html: getVideoHTML(urlVideo, audioHabilitado) }}
                      style={styles.webViewPlayer}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      allowsInlineMediaPlayback={true}
                      mediaPlaybackRequiresUserAction={false}
                      scrollEnabled={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      allowsFullscreenVideo={false}
                      mixedContentMode="compatibility"
                      onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.log('WebView error: ', nativeEvent);
                      }}
                      onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.log('WebView HTTP error: ', nativeEvent);
                      }}
                      onLoadStart={() => console.log('WebView load start')}
                      onLoadEnd={() => console.log('WebView load end')}
                      onMessage={(event) => {
                        console.log('WebView message:', event.nativeEvent.data);
                      }}
                    />
                    
                    {/* Overlay con información del canal */}
                    <View style={styles.canalActualOverlayInfo}>
                      {/* Información del canal - Izquierda */}
                      <View style={styles.canalInfoLeft}>
                        <View style={styles.canalLogoContainer}>
                          {canalActual.stream_icon ? (
                            <Image
                              source={{ uri: canalActual.stream_icon }}
                              style={styles.canalLogo}
                              resizeMode="contain"
                            />
                          ) : (
                            <View style={styles.canalLogoPlaceholder}>
                              <Ionicons name="tv" size={20} color="#FFF" />
                            </View>
                          )}
                        </View>
                        <View style={styles.canalTextoInfo}>
                          <Text style={styles.canalNombreOverlay}>{canalActual.name}</Text>
                          <View style={styles.liveBadgeOverlay}>
                            <View style={styles.liveDotOverlay} />
                            <Text style={styles.liveTextOverlay}>EN VIVO</Text>
                          </View>
                        </View>
                      </View>
                      
                      {/* Controles - Derecha */}
                      <View style={styles.canalControlsRight}>
                        <TouchableOpacity 
                          style={styles.controlBtn}
                          onPress={() => setAudioHabilitado(!audioHabilitado)}
                        >
                          <Ionicons 
                            name={audioHabilitado ? "volume-high" : "volume-mute"} 
                            size={24} 
                            color="#FFF" 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.controlBtn}
                          onPress={() => manejarFavorito(canalActual)}
                        >
                          <Ionicons 
                            name={canalesFavoritos.has(canalActual.stream_id.toString()) ? "heart" : "heart-outline"} 
                            size={24} 
                            color={canalesFavoritos.has(canalActual.stream_id.toString()) ? COLORS.primary : "#FFF"} 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.controlBtn}
                          onPress={abrirReproductor}
                        >
                          <Ionicons name="expand" size={24} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    {canalActual.stream_icon ? (
                      <Image
                        source={{ uri: canalActual.stream_icon }}
                        style={styles.canalActualImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.canalActualPlaceholder}>
                        <Ionicons name="tv" size={80} color={COLORS.textSecondary} />
                      </View>
                    )}
                    <View style={styles.canalActualOverlay}>
                      <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.9)" />
                    </View>
                  </>
                )}
              </>
            ) : (
              <View style={styles.canalActualVacio}>
                <Ionicons name="play-circle-outline" size={80} color={COLORS.textSecondary} />
                <Text style={styles.canalActualVacioTexto}>
                  Haz clic en cualquier canal para reproducir
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Contenido Scrolleable */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Mostrar resultados de búsqueda si hay texto en el buscador */}
        {busqueda.trim() ? (
          renderResultadosBusqueda()
        ) : (
          /* Vista según categoría seleccionada */
          categoriaSeleccionada === 'all' ? (
            <>
              {/* Sección de Favoritos */}
              <View style={styles.categoriaSeccion}>
                <View style={styles.categoriaSeccionHeader}>
                  <Text style={styles.categoriaSeccionTitulo}>
                    Favoritos ({favoritos.length})
                  </Text>
                  <TouchableOpacity onPress={() => {
                    // Crear una categoría especial para favoritos
                    setCategoriaSeleccionada('favoritos');
                  }}>
                    <Text style={styles.verTodoBtn}>Ver Todo</Text>
                  </TouchableOpacity>
                </View>
                
                {favoritos.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.canalesHorizontal}
                  >
                    {favoritos.slice(0, 10).map((favorito) => {
                      // Buscar el canal completo en la lista de canales
                      const canal = canales.find(c => c.stream_id.toString() === favorito.id);
                      if (!canal) return null;
                      
                      return (
                        <TouchableOpacity
                          key={canal.stream_id}
                          style={styles.canalCard}
                          onPress={() => seleccionarCanal(canal)}
                        >
                          <View style={styles.canalCardImagen}>
                            {canal.stream_icon ? (
                              <Image
                                source={{ uri: canal.stream_icon }}
                                style={styles.canalCardImg}
                                resizeMode="contain"
                              />
                            ) : (
                              <View style={styles.canalCardPlaceholder}>
                                <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
                              </View>
                            )}
                            {canalActual?.stream_id === canal.stream_id && (
                              <View style={styles.canalCardPlayingBadge}>
                                <Ionicons name="play" size={12} color="#FFF" />
                              </View>
                            )}
                            {/* Botón de favorito */}
                            <TouchableOpacity 
                              style={styles.canalCardFavBtn}
                              onPress={(e: any) => {
                                e.stopPropagation();
                                manejarFavorito(canal);
                              }}
                            >
                              <Ionicons 
                                name="heart" 
                                size={16} 
                                color={COLORS.primary} 
                              />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.canalCardNombre} numberOfLines={2}>
                            {canal.name}
                          </Text>
                          <Text style={styles.canalCardEstado}>
                            {canalActual?.stream_id === canal.stream_id ? 'Reproduciendo ahora' : 'No se encontró ningún programa'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.favoritosVacio}>
                    <Ionicons name="heart-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.favoritosVacioTexto}>
                      No tienes canales favoritos
                    </Text>
                  </View>
                )}
              </View>

              {/* Lista de Categorías */}
              <View style={styles.categoriasListContainer}>
                {categorias.slice(1).map((cat) => renderCategoriaItem(cat))}
              </View>
            </>
          ) : (
            <>
              {/* Header de categoría seleccionada */}
              <View style={styles.categoriaSeleccionadaHeader}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setCategoriaSeleccionada('all')}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.categoriaSeleccionadaTitulo}>
                  {categoriaSeleccionada === 'favoritos' 
                    ? `Favoritos (${favoritos.length})`
                    : `${categorias.find(c => c.category_id === categoriaSeleccionada)?.category_name} (${filtrarCanalesPorCategoria(categoriaSeleccionada).length})`
                  }
                </Text>
              </View>

              {/* Grid de canales */}
              {renderCanalesGrid()}
            </>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flex: 1,
  },
  headerNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    padding: 5,
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  buscadorInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  categoriasContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoriasScroll: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoriaBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoriaBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoriaBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoriaBtnTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  canalActualContainer: {
    margin: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  canalActualImagen: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.border,
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  canalActualImg: {
    width: '100%',
    height: '100%',
  },
  canalActualPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalActualCargando: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  webViewPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  canalActualVacio: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  canalActualVacioTexto: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
  },
  canalActualOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalActualOverlayBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 25,
  },
  canalActualAudioBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 25,
  },
  // Nuevos estilos para el overlay de información
  canalActualOverlayInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  canalInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  canalLogoContainer: {
    width: 35,
    height: 35,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  canalLogoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalTextoInfo: {
    flex: 1,
  },
  canalNombreOverlay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  liveBadgeOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  liveDotOverlay: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFF',
    marginRight: 4,
  },
  liveTextOverlay: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  canalControlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalActualInfo: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  canalActualLogoContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  canalActualLogo: {
    width: '100%',
    height: '100%',
  },
  canalActualTexto: {
    flex: 1,
  },
  canalActualNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  canalActualBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginRight: 5,
  },
  liveText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  favoritoBtn: {
    padding: 5,
  },
  fullscreenBtn: {
    padding: 5,
  },
  categoriaSeccion: {
    marginTop: 20,
  },
  categoriaSeccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  categoriaSeccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  verTodoBtn: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  canalesHorizontal: {
    paddingHorizontal: 15,
    gap: 12,
  },
  canalCard: {
    width: 100,
  },
  canalCardImagen: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  canalCardImg: {
    width: '100%',
    height: '100%',
  },
  canalCardPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalCardPlayingBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 4,
  },
  canalCardFavBtn: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  canalCardNombre: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  canalCardEstado: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  favoritosVacio: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  favoritosVacioTexto: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 10,
  },
  categoriasListContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoriaListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoriaListNombre: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoriaSeleccionadaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  categoriaSeleccionadaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  canalesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  canalGridItem: {
    width: '33.33%',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  canalGridImagen: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  canalGridImg: {
    width: '100%',
    height: '100%',
  },
  canalGridPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalGridNombre: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 14,
  },
  canalGridEstado: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Estilos para búsqueda
  resultadosBusqueda: {
    padding: 15,
  },
  resultadosBusquedaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  sinResultados: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  sinResultadosTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  sinResultadosSubtexto: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

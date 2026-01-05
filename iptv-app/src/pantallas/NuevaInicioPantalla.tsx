import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import iptvServicio, { VodStream, SeriesInfo, LiveStream } from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { useAuth } from '../contexto/AuthContext';
import { obtenerTodosLosProgresos, ProgresoVideo, eliminarProgreso, guardarProgreso } from '../utils/progresoStorage';
import { TarjetaContinuarViendo } from '../componentes/TarjetaContinuarViendo';
import { TarjetaCanalTV } from '../componentes/TarjetaCanalTV';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;
const POSTER_WIDTH = 120;
const POSTER_HEIGHT = 180;

export const NuevaInicioPantalla = () => {
  const [peliculasDestacadas, setPeliculasDestacadas] = useState<VodStream[]>([]);
  const [peliculasRecientes, setPeliculasRecientes] = useState<VodStream[]>([]);
  const [seriesPopulares, setSeriesPopulares] = useState<SeriesInfo[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [todasLasPeliculasEstrenos, setTodasLasPeliculasEstrenos] = useState<VodStream[]>([]);
  const [indiceGrupo, setIndiceGrupo] = useState(0);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [continuarViendo, setContinuarViendo] = useState<ProgresoVideo[]>([]);
  const [canalesPeru, setCanalesPeru] = useState<LiveStream[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const { usuario, cerrarSesion } = useAuth();

  useEffect(() => {
    cargarContenido();
    cargarContinuarViendo();
    cargarCanalesPeru();
  }, []);

  // Actualizar fecha y hora cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Auto-deslizamiento del carrusel cada 4 segundos
  useEffect(() => {
    if (peliculasDestacadas.length === 0) return;

    const intervalo = setInterval(() => {
      setBannerIndex((prevIndex) => 
        (prevIndex + 1) % peliculasDestacadas.length
      );
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(intervalo);
  }, [peliculasDestacadas.length]);

  // Cambiar grupo de películas cada minuto
  useEffect(() => {
    if (todasLasPeliculasEstrenos.length === 0) return;

    const intervaloGrupo = setInterval(() => {
      setIndiceGrupo((prevIndice) => {
        const nuevoIndice = prevIndice + 5;
        // Si llegamos al final, volver al inicio
        if (nuevoIndice >= todasLasPeliculasEstrenos.length) {
          return 0;
        }
        return nuevoIndice;
      });
    }, 60000); // Cambia cada 60 segundos (1 minuto)

    return () => clearInterval(intervaloGrupo);
  }, [todasLasPeliculasEstrenos.length]);

  // Actualizar películas destacadas cuando cambia el índice del grupo
  useEffect(() => {
    if (todasLasPeliculasEstrenos.length > 0) {
      const nuevasDestacadas = todasLasPeliculasEstrenos.slice(
        indiceGrupo,
        indiceGrupo + 5
      );
      
      // Si no hay suficientes películas, completar desde el inicio
      if (nuevasDestacadas.length < 5) {
        const faltantes = 5 - nuevasDestacadas.length;
        const desdeInicio = todasLasPeliculasEstrenos.slice(0, faltantes);
        setPeliculasDestacadas([...nuevasDestacadas, ...desdeInicio]);
      } else {
        setPeliculasDestacadas(nuevasDestacadas);
      }
      
      // Resetear el índice del banner
      setBannerIndex(0);
    }
  }, [indiceGrupo, todasLasPeliculasEstrenos]);

  const cargarContenido = async () => {
    try {
      const [peliculas, categorias] = await Promise.all([
        iptvServicio.getVodStreams(),
        iptvServicio.getVodCategories(),
      ]);
      const series = await iptvServicio.getSeries();
      
      // Buscar primero la categoría "New Releases"
      let categoriaEstrenos = categorias.find(cat => 
        cat.category_name.toLowerCase().includes('new') && 
        cat.category_name.toLowerCase().includes('releases')
      );
      
      // Si no existe "New Releases", buscar categoría con "CAM"
      if (!categoriaEstrenos) {
        categoriaEstrenos = categorias.find(cat => 
          cat.category_name.toLowerCase().includes('cam')
        );
      }
      
      // Si no existe "CAM", buscar cualquier categoría con "estrenos"
      if (!categoriaEstrenos) {
        categoriaEstrenos = categorias.find(cat => 
          cat.category_name.toLowerCase().includes('estrenos')
        );
      }
      
      let peliculasEstrenos: VodStream[] = [];
      
      if (categoriaEstrenos) {
        // Filtrar películas de la categoría encontrada
        peliculasEstrenos = peliculas.filter(p => 
          p.category_id === categoriaEstrenos.category_id
        );
      }
      
      // Si aún no hay películas, usar las más recientes
      if (peliculasEstrenos.length === 0) {
        peliculasEstrenos = [...peliculas].sort((a, b) => {
          const fechaA = a.added ? parseInt(String(a.added)) : 0;
          const fechaB = b.added ? parseInt(String(b.added)) : 0;
          return fechaB - fechaA;
        });
      }
      
      // Guardar todas las películas de estrenos para rotación
      setTodasLasPeliculasEstrenos(peliculasEstrenos);
      
      // Las primeras 5 para el carrusel inicial
      setPeliculasDestacadas(peliculasEstrenos.slice(0, 5));
      
      // Ordenar todas las películas por fecha para "Películas Recientes"
      const peliculasOrdenadas = [...peliculas].sort((a, b) => {
        const fechaA = a.added ? parseInt(String(a.added)) : 0;
        const fechaB = b.added ? parseInt(String(b.added)) : 0;
        return fechaB - fechaA;
      });
      
      setPeliculasRecientes(peliculasOrdenadas.slice(0, 10));
      setSeriesPopulares(series.slice(0, 10));
    } catch (error) {
      console.error('Error cargando contenido:', error);
    }
  };

  const cargarContinuarViendo = async () => {
    try {
      const progresos = await obtenerTodosLosProgresos();
      
      // Cargar películas y series para obtener las imágenes
      const [peliculas, series] = await Promise.all([
        iptvServicio.getVodStreams().catch(() => []),
        iptvServicio.getSeries().catch(() => []),
      ]);
      
      // Enriquecer progresos con imágenes si no las tienen
      const progresosEnriquecidos = await Promise.all(
        progresos.map(async (progreso) => {
          if (!progreso.imagen) {
            // Intentar encontrar la imagen según el tipo
            if (progreso.tipo === 'pelicula' && progreso.streamId) {
              const pelicula = peliculas.find(p => p.stream_id === progreso.streamId);
              if (pelicula && pelicula.stream_icon) {
                progreso.imagen = pelicula.stream_icon;
                // Guardar el progreso actualizado
                await guardarProgreso(progreso);
                console.log(`Imagen encontrada y guardada para película: ${progreso.titulo}`, pelicula.stream_icon);
              }
            } else if ((progreso.tipo === 'serie' || progreso.tipo === 'episodio') && progreso.serieId) {
              const serie = series.find(s => s.series_id === progreso.serieId);
              if (serie && serie.cover) {
                progreso.imagen = serie.cover;
                // Guardar el progreso actualizado
                await guardarProgreso(progreso);
                console.log(`Imagen encontrada y guardada para serie: ${progreso.titulo}`, serie.cover);
              }
            }
          } else {
            console.log(`Progreso ya tiene imagen: ${progreso.titulo}`, progreso.imagen);
          }
          return progreso;
        })
      );
      
      // Ordenar por fecha más reciente y tomar los primeros 10
      const progresosRecientes = progresosEnriquecidos
        .sort((a, b) => b.fecha - a.fecha)
        .slice(0, 10);
      
      console.log(`Total de progresos cargados: ${progresosRecientes.length}`);
      setContinuarViendo(progresosRecientes);
    } catch (error) {
      console.error('Error cargando continuar viendo:', error);
    }
  };

  const cargarCanalesPeru = async () => {
    try {
      // Obtener todas las categorías de TV
      const categorias = await iptvServicio.getLiveCategories();
      
      // Buscar categoría de Perú (puede tener diferentes nombres)
      const categoriaPeru = categorias.find(cat => 
        cat.category_name.toLowerCase().includes('peru') ||
        cat.category_name.toLowerCase().includes('perú') ||
        cat.category_name.toLowerCase().includes('pe ')
      );
      
      if (categoriaPeru) {
        // Obtener canales de la categoría de Perú
        const canales = await iptvServicio.getLiveStreams(categoriaPeru.category_id);
        console.log(`Canales de Perú encontrados: ${canales.length}`);
        setCanalesPeru(canales.slice(0, 15)); // Mostrar los primeros 15
      } else {
        // Si no hay categoría específica de Perú, buscar canales con "peru" en el nombre
        const todosCanales = await iptvServicio.getLiveStreams();
        const canalesPeruanos = todosCanales.filter(canal =>
          canal.name.toLowerCase().includes('peru') ||
          canal.name.toLowerCase().includes('perú')
        );
        console.log(`Canales peruanos encontrados por nombre: ${canalesPeruanos.length}`);
        setCanalesPeru(canalesPeruanos.slice(0, 15));
      }
    } catch (error) {
      console.error('Error cargando canales de Perú:', error);
    }
  };

  const verDetallesPelicula = (pelicula: VodStream) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('DetallesPelicula', { pelicula });
    }
  };

  const reproducirPelicula = (pelicula: VodStream) => {
    const url = iptvServicio.getVodStreamUrl(
      pelicula.stream_id,
      pelicula.container_extension
    );
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('Reproductor', {
        url,
        titulo: pelicula.name,
        streamId: pelicula.stream_id,
        imagen: pelicula.stream_icon,
      });
    }
  };

  const verSerie = (serie: SeriesInfo) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('DetallesSerie', { serie });
    }
  };

  const reproducirCanal = (canal: LiveStream) => {
    const url = iptvServicio.getLiveStreamUrl(canal.stream_id, 'm3u8');
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('Reproductor', {
        url,
        titulo: canal.name,
        esTvEnVivo: true,
        streamId: canal.stream_id,
      });
    }
  };

  const continuarViendoVideo = (progreso: ProgresoVideo) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation && progreso.url) {
      parentNavigation.navigate('Reproductor', {
        url: progreso.url,
        titulo: progreso.titulo,
        streamId: progreso.streamId,
        serieId: progreso.serieId,
        temporada: progreso.temporada,
        episodio: progreso.episodio,
        serie: progreso.tipo === 'episodio' ? { series_id: progreso.serieId } : undefined,
        esTvEnVivo: false,
        posicionInicial: progreso.posicion,
      });
    }
  };

  const eliminarDeContinuarViendo = async (progreso: ProgresoVideo) => {
    Alert.alert(
      'Eliminar de Continuar Viendo',
      `¿Deseas eliminar "${progreso.titulo}" de tu lista?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarProgreso(progreso.id);
            // Recargar la lista
            await cargarContinuarViendo();
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        cargarContenido(),
        cargarContinuarViendo(),
        cargarCanalesPeru(),
      ]);
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatearFecha = () => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const dia = dias[fechaHora.getDay()];
    const numeroDia = fechaHora.getDate();
    const mes = meses[fechaHora.getMonth()];
    const año = fechaHora.getFullYear();
    
    return `${dia}, ${numeroDia} de ${mes} de ${año}`;
  };

  const formatearHora = () => {
    const horas = fechaHora.getHours().toString().padStart(2, '0');
    const minutos = fechaHora.getMinutes().toString().padStart(2, '0');
    const segundos = fechaHora.getSeconds().toString().padStart(2, '0');
    
    return `${horas}:${minutos}:${segundos}`;
  };

  const renderBanner = () => {
    if (peliculasDestacadas.length === 0) return null;
    
    const pelicula = peliculasDestacadas[bannerIndex];
    
    return (
      <TouchableOpacity 
        style={styles.banner}
        onPress={() => verDetallesPelicula(pelicula)}
      >
        <Image
          source={{ uri: pelicula.stream_icon }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        {/* Badge de "ESTRENO" */}
        <View style={styles.estrenoBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.estrenoText}>ESTRENO</Text>
        </View>
        <View style={styles.bannerGradient}>
          <Text style={styles.bannerTitle}>{pelicula.name}</Text>
          <View style={styles.bannerButtons}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => verDetallesPelicula(pelicula)}
            >
              <Ionicons name="play" size={20} color="#000" />
              <Text style={styles.playButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bannerDots}>
          {peliculasDestacadas.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === bannerIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPosterItem = (item: VodStream | SeriesInfo, tipo: 'pelicula' | 'serie') => {
    const imagen = tipo === 'pelicula' 
      ? (item as VodStream).stream_icon 
      : (item as SeriesInfo).cover;
    
    const nombre = item.name;
    
    return (
      <TouchableOpacity
        style={styles.posterItem}
        onPress={() => {
          if (tipo === 'pelicula') {
            verDetallesPelicula(item as VodStream);
          } else {
            verSerie(item as SeriesInfo);
          }
        }}
      >
        {imagen ? (
          <Image
            source={{ uri: imagen }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Ionicons name="film" size={40} color={COLORS.textSecondary} />
          </View>
        )}
        <Text style={styles.posterTitle} numberOfLines={2}>
          {nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>FRED TV</Text>
        </View>
        <View style={styles.headerCenter}>
          <View style={styles.relojContainer}>
            <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            <Text style={styles.horaTexto}>{formatearHora()}</Text>
          </View>
          <Text style={styles.fechaTexto}>{formatearFecha()}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={cerrarSesion} style={styles.headerIcon}>
            <Ionicons name="person-circle" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            title="Actualizando..."
            titleColor={COLORS.text}
          />
        }
      >
        {/* Banner Destacado */}
        {renderBanner()}

        {/* Sección: Continuar Viendo */}
        {continuarViendo.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="play-circle" size={24} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Continuar viendo</Text>
              </View>
            </View>
            <FlatList
              horizontal
              data={continuarViendo}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TarjetaContinuarViendo
                  progreso={item}
                  onPress={() => continuarViendoVideo(item)}
                  onRemove={() => eliminarDeContinuarViendo(item)}
                />
              )}
            />
          </View>
        )}

        {/* Sección: Películas Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Películas Recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Películas')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={peliculasRecientes}
            keyExtractor={(item, index) => `pelicula-${item.stream_id}-${index}`}
            renderItem={({ item }) => renderPosterItem(item, 'pelicula')}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección: Series Populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Series Populares</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Series')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={seriesPopulares}
            keyExtractor={(item, index) => `serie-${item.series_id}-${index}`}
            renderItem={({ item }) => renderPosterItem(item, 'serie')}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Sección: Canales de Perú */}
        {canalesPeru.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="tv" size={24} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Canales de Perú</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('TV')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={canalesPeru}
              keyExtractor={(item, index) => `canal-${item.stream_id}-${index}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TarjetaCanalTV
                  canal={item}
                  onPress={() => reproducirCanal(item)}
                />
              )}
            />
          </View>
        )}

        {/* Información del Usuario */}
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Usuario: {usuario?.username || 'N/A'}</Text>
          <Text style={styles.userInfoText}>
            Expira: {usuario?.exp_date ? new Date(parseInt(String(usuario.exp_date)) * 1000).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flex: 1.5,
  },
  headerCenter: {
    flex: 2.5,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  relojContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  horaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  fechaTexto: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  headerIcons: {
    flexDirection: 'row',
    flex: 0.8,
    justifyContent: 'flex-end',
  },
  headerIcon: {
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
  },
  banner: {
    width: width,
    height: BANNER_HEIGHT,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  estrenoBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  estrenoText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bannerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bannerButtons: {
    flexDirection: 'row',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerDots: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2.5,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
  },
  horizontalList: {
    paddingHorizontal: 15,
  },
  posterItem: {
    width: POSTER_WIDTH,
    marginRight: 10,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  posterPlaceholder: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterTitle: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 5,
  },
  userInfo: {
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  userInfoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 5,
  },
});

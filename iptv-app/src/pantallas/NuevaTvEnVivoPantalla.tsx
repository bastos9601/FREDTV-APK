import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import iptvServicio, { LiveStream, Category } from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = 220;

export const NuevaTvEnVivoPantalla = () => {
  const [canales, setCanales] = useState<LiveStream[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('all');
  const [canalActual, setCanalActual] = useState<LiveStream | null>(null);
  const [cargando, setCargando] = useState(true);
  const [pestanaActiva, setPestanaActiva] = useState<'categoria' | 'favoritos'>('categoria');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [canalesData, categoriasData] = await Promise.all([
        iptvServicio.getLiveStreams(),
        iptvServicio.getLiveCategories(),
      ]);
      
      setCanales(canalesData);
      setCategorias([{ category_id: 'all', category_name: 'ChannelList', parent_id: 0 }, ...categoriasData]);
      
      if (canalesData.length > 0) {
        setCanalActual(canalesData[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los canales');
    } finally {
      setCargando(false);
    }
  };

  const filtrarCanales = () => {
    let canalesFiltrados = canales;
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== 'all') {
      canalesFiltrados = canalesFiltrados.filter(
        (canal) => canal.category_id === categoriaSeleccionada
      );
    }
    
    // Filtrar por búsqueda
    if (busqueda.trim() !== '') {
      canalesFiltrados = canalesFiltrados.filter((canal) =>
        canal.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    return canalesFiltrados;
  };

  const reproducirCanal = (canal: LiveStream) => {
    setCanalActual(canal);
    // Abrir directamente el reproductor profesional
    const url = iptvServicio.getLiveStreamUrl(canal.stream_id, 'm3u8');
    navigation.navigate('Reproductor', {
      url,
      titulo: canal.name,
      esTvEnVivo: true,
    });
  };

  const renderCategoria = (categoria: Category) => {
    const isSelected = categoriaSeleccionada === categoria.category_id;
    
    // Contar canales en esta categoría
    const cantidadCanales = categoria.category_id === 'all' 
      ? canales.length 
      : canales.filter(c => c.category_id === categoria.category_id).length;
    
    // Mapeo de países a banderas emoji
    const getBanderaEmoji = (nombre: string): string => {
      const nombreLower = nombre.toLowerCase();
      if (nombreLower.includes('españa') || nombreLower.includes('spain')) return '🇪🇸';
      if (nombreLower.includes('méxico') || nombreLower.includes('mexico')) return '🇲🇽';
      if (nombreLower.includes('argentina')) return '🇦🇷';
      if (nombreLower.includes('colombia')) return '🇨🇴';
      if (nombreLower.includes('chile')) return '🇨🇱';
      if (nombreLower.includes('perú') || nombreLower.includes('peru')) return '🇵🇪';
      if (nombreLower.includes('venezuela')) return '🇻🇪';
      if (nombreLower.includes('ecuador')) return '🇪🇨';
      if (nombreLower.includes('uruguay')) return '🇺🇾';
      if (nombreLower.includes('bolivia')) return '🇧🇴';
      if (nombreLower.includes('paraguay')) return '🇵🇾';
      if (nombreLower.includes('usa') || nombreLower.includes('estados unidos') || nombreLower.includes('united states')) return '🇺🇸';
      if (nombreLower.includes('uk') || nombreLower.includes('reino unido') || nombreLower.includes('united kingdom')) return '🇬🇧';
      if (nombreLower.includes('francia') || nombreLower.includes('france')) return '🇫🇷';
      if (nombreLower.includes('alemania') || nombreLower.includes('germany')) return '🇩🇪';
      if (nombreLower.includes('italia') || nombreLower.includes('italy')) return '🇮🇹';
      if (nombreLower.includes('portugal')) return '🇵🇹';
      if (nombreLower.includes('brasil') || nombreLower.includes('brazil')) return '🇧🇷';
      if (nombreLower.includes('deportes') || nombreLower.includes('sports')) return '⚽';
      if (nombreLower.includes('películas') || nombreLower.includes('movies')) return '🎬';
      if (nombreLower.includes('noticias') || nombreLower.includes('news')) return '📰';
      if (nombreLower.includes('infantil') || nombreLower.includes('kids')) return '👶';
      if (nombreLower.includes('música') || nombreLower.includes('music')) return '🎵';
      if (nombreLower.includes('documentales') || nombreLower.includes('documentary')) return '📺';
      if (nombreLower.includes('entretenimiento') || nombreLower.includes('entertainment')) return '🎭';
      if (nombreLower.includes('all') || nombreLower.includes('todos') || nombreLower.includes('channellist')) return '📋';
      return '📡';
    };
    
    const bandera = getBanderaEmoji(categoria.category_name);
    
    return (
      <TouchableOpacity
        key={categoria.category_id}
        style={[styles.categoriaCard, isSelected && styles.categoriaCardActive]}
        onPress={() => setCategoriaSeleccionada(categoria.category_id)}
      >
        <View style={[styles.categoriaIcono, isSelected && styles.categoriaIconoActive]}>
          <Text style={styles.banderaEmoji}>{bandera}</Text>
        </View>
        <Text style={[styles.categoriaCardText, isSelected && styles.categoriaCardTextActive]} numberOfLines={2}>
          {categoria.category_name}
        </Text>
        <Text style={styles.cantidadCanales}>{cantidadCanales.toString()}</Text>
        {isSelected && <View style={styles.categoriaCheckmark}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
        </View>}
      </TouchableOpacity>
    );
  };

  const renderCanal = ({ item, index }: { item: LiveStream; index: number }) => {
    const isPlaying = canalActual?.stream_id === item.stream_id;
    
    return (
      <TouchableOpacity
        style={[styles.canalItem, isPlaying && styles.canalItemActive]}
        onPress={() => reproducirCanal(item)}
      >
        <View style={styles.canalLeft}>
          {item.stream_icon ? (
            <Image
              source={{ uri: item.stream_icon }}
              style={styles.canalLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.canalLogoPlaceholder}>
              <Ionicons name="tv" size={24} color={COLORS.textSecondary} />
            </View>
          )}
          <View style={styles.canalInfo}>
            <Text style={styles.canalNumero}>{String(index + 1).padStart(3, '0')}</Text>
            <Text style={styles.canalNombre} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => reproducirCanal(item)}
        >
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={32}
            color={isPlaying ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
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
        <Text style={styles.logo}>FRED TV</Text>
        <Text style={styles.subtitulo}>TV en Vivo</Text>
      </View>

      {/* Vista previa del Canal */}
      <View style={styles.videoContainer}>
        {canalActual ? (
          <TouchableOpacity 
            style={styles.videoPlaceholder}
            onPress={() => reproducirCanal(canalActual)}
          >
            {canalActual.stream_icon ? (
              <Image
                source={{ uri: canalActual.stream_icon }}
                style={styles.canalImagenGrande}
                resizeMode="contain"
              />
            ) : (
              <Ionicons name="tv" size={80} color={COLORS.textSecondary} />
            )}
            <View style={styles.playOverlay}>
              <Ionicons name="play-circle" size={80} color={COLORS.primary} />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{canalActual.name}</Text>
              <Text style={styles.videoSubtitle}>Toca para reproducir</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="tv" size={60} color={COLORS.textSecondary} />
            <Text style={styles.videoPlaceholderText}>
              Selecciona un canal para reproducir
            </Text>
          </View>
        )}
      </View>

      {/* Pestañas: Categoría / Favoritos */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setPestanaActiva('categoria')}
          >
            <Text style={[styles.tabText, pestanaActiva === 'categoria' && styles.tabTextActive]}>
              Categoría
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setPestanaActiva('favoritos')}
          >
            <Text style={[styles.tabText, pestanaActiva === 'favoritos' && styles.tabTextActive]}>
              Favoritos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setMostrarBuscador(!mostrarBuscador)}
          >
            <Ionicons 
              name={mostrarBuscador ? 'close' : 'search'} 
              size={24} 
              color={COLORS.text} 
            />
          </TouchableOpacity>
        </View>
        {/* Barra indicadora animada */}
        <View style={styles.indicadorContainer}>
          <View 
            style={[
              styles.indicadorBarra,
              { 
                left: pestanaActiva === 'categoria' ? '0%' : '50%',
                width: '50%'
              }
            ]} 
          />
        </View>
      </View>

      {/* Buscador */}
      {mostrarBuscador && (
        <View style={styles.buscadorContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.buscadorInput}
            placeholder="Buscar canales..."
            placeholderTextColor={COLORS.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
            autoFocus
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Categorías Horizontales - Carrusel */}
      {pestanaActiva === 'categoria' && (
        <View style={styles.categoriasSection}>
          <Text style={styles.categoriasTitulo}>Selecciona una categoría</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriasScroll}
            contentContainerStyle={styles.categoriasContent}
          >
            {categorias.map((cat) => renderCategoria(cat))}
          </ScrollView>
        </View>
      )}

      {/* Lista de Canales */}
      <FlatList
        data={filtrarCanales()}
        keyExtractor={(item, index) => `canal-${item.stream_id}-${index}`}
        renderItem={renderCanal}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaCanales}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  videoContainer: {
    width: width,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  volumeButton: {
    padding: 8,
  },
  fullscreenButton: {
    padding: 8,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    position: 'relative',
  },
  canalImagenGrande: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  videoPlaceholderText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    fontSize: 14,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videoSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
  tabsWrapper: {
    backgroundColor: COLORS.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  indicadorContainer: {
    height: 3,
    backgroundColor: COLORS.border,
    position: 'relative',
  },
  indicadorBarra: {
    position: 'absolute',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  categoriasSection: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoriasTitulo: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  categoriasScroll: {
    maxHeight: 90,
  },
  categoriasContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  categoriaCard: {
    width: 75,
    height: 75,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginRight: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  categoriaCardActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  categoriaIcono: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoriaIconoActive: {
    backgroundColor: COLORS.primary + '30',
  },
  banderaEmoji: {
    fontSize: 22,
  },
  categoriaCardText: {
    color: COLORS.text,
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 11,
  },
  categoriaCardTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  categoriaCheckmark: {
    position: 'absolute',
    top: 3,
    right: 3,
  },
  cantidadCanales: {
    color: COLORS.textSecondary,
    fontSize: 8,
    marginTop: 1,
  },
  listaCanales: {
    paddingVertical: 10,
  },
  canalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  canalItemActive: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  canalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  canalLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  canalLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canalInfo: {
    marginLeft: 15,
    flex: 1,
  },
  canalNumero: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  canalNombre: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
  playButton: {
    padding: 5,
  },
  searchButton: {
    padding: 15,
    justifyContent: 'center',
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  buscadorInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
});

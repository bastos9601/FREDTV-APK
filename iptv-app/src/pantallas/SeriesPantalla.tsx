import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import iptvServicio, { SeriesInfo, Category } from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const POSTER_WIDTH = 110;
const POSTER_HEIGHT = 165;

export const SeriesPantalla = () => {
  const [series, setSeries] = useState<SeriesInfo[]>([]);
  const [seriesFiltradas, setSeriesFiltradas] = useState<SeriesInfo[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('all');
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarSeries();
  }, [busqueda, series, categoriaSeleccionada]);

  const cargarDatos = async () => {
    try {
      const [seriesData, categoriasData] = await Promise.all([
        iptvServicio.getSeries(),
        iptvServicio.getSeriesCategories(),
      ]);
      setSeries(seriesData);
      setSeriesFiltradas(seriesData);
      setCategorias([{ category_id: 'all', category_name: 'Todas', parent_id: 0 }, ...categoriasData]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las series');
    } finally {
      setCargando(false);
    }
  };

  const filtrarSeries = () => {
    let filtradas = series;
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== 'all') {
      filtradas = filtradas.filter((serie) =>
        serie.category_id === categoriaSeleccionada
      );
    }
    
    // Filtrar por búsqueda
    if (busqueda.trim() !== '') {
      filtradas = filtradas.filter((serie) =>
        serie.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    setSeriesFiltradas(filtradas);
  };

  const verSerie = (serie: SeriesInfo) => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('DetallesSerie', { serie });
    }
  };

  const getIcono = (nombre: string): string => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('acción') || nombreLower.includes('action')) return '💥';
    if (nombreLower.includes('comedia') || nombreLower.includes('comedy')) return '😂';
    if (nombreLower.includes('drama')) return '🎭';
    if (nombreLower.includes('terror') || nombreLower.includes('horror')) return '😱';
    if (nombreLower.includes('ciencia ficción') || nombreLower.includes('sci-fi')) return '🚀';
    if (nombreLower.includes('romance')) return '💕';
    if (nombreLower.includes('aventura') || nombreLower.includes('adventure')) return '🗺️';
    if (nombreLower.includes('animación') || nombreLower.includes('animation')) return '🎨';
    if (nombreLower.includes('documental') || nombreLower.includes('documentary')) return '📹';
    if (nombreLower.includes('thriller')) return '🔪';
    if (nombreLower.includes('fantasía') || nombreLower.includes('fantasy')) return '🧙';
    if (nombreLower.includes('musical')) return '🎵';
    if (nombreLower.includes('crimen') || nombreLower.includes('crime')) return '🕵️';
    if (nombreLower.includes('todas') || nombreLower.includes('all')) return '📺';
    return '🎬';
  };

  const seleccionarCategoria = (categoriaId: string) => {
    setCategoriaSeleccionada(categoriaId);
    setMostrarCategorias(false);
  };

  const renderCategoria = ({ item }: { item: Category }) => {
    const isSelected = categoriaSeleccionada === item.category_id;
    const cantidadSeries = item.category_id === 'all' 
      ? series.length 
      : series.filter(s => s.category_id === item.category_id).length;
    
    const icono = getIcono(item.category_name);
    
    return (
      <TouchableOpacity
        style={[styles.categoriaItem, isSelected && styles.categoriaItemActive]}
        onPress={() => seleccionarCategoria(item.category_id)}
      >
        <View style={styles.categoriaItemLeft}>
          <Text style={styles.categoriaIconoText}>{icono}</Text>
          <Text style={[styles.categoriaItemText, isSelected && styles.categoriaItemTextActive]}>
            {item.category_name}
          </Text>
        </View>
        <View style={styles.categoriaItemRight}>
          <Text style={styles.cantidadText}>{cantidadSeries.toString()}</Text>
          {isSelected && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSerie = ({ item }: { item: SeriesInfo }) => (
    <TouchableOpacity
      style={styles.posterItem}
      onPress={() => verSerie(item)}
    >
      {item.cover ? (
        <Image
          source={{ uri: item.cover }}
          style={styles.posterImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Ionicons name="tv" size={40} color={COLORS.textSecondary} />
        </View>
      )}
      <Text style={styles.posterTitle} numberOfLines={2}>
        {item.name}
      </Text>
      {item.rating && item.rating !== '' && (
        <View style={styles.rating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toString()}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const categoriaActual = categorias.find(c => c.category_id === categoriaSeleccionada);

  return (
    <View style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FRED TV</Text>
        <Text style={styles.subtitulo}>Series</Text>
      </View>

      {/* Barra de búsqueda y botón de categorías */}
      <View style={styles.topBar}>
        <View style={styles.buscadorContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.buscadorIcono} />
          <TextInput
            style={styles.buscadorInput}
            placeholder="Buscar series..."
            placeholderTextColor={COLORS.textSecondary}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Botón de Categorías */}
        <TouchableOpacity 
          style={styles.botonCategorias}
          onPress={() => setMostrarCategorias(true)}
        >
          <Ionicons name="filter" size={20} color={COLORS.text} />
          <Text style={styles.botonCategoriasText}>
            {categoriaActual?.category_name || 'Categorías'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de series */}
      <FlatList
        data={seriesFiltradas}
        keyExtractor={(item) => item.series_id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={renderSerie}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="tv-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No se encontraron series</Text>
          </View>
        }
      />

      {/* Modal de Categorías */}
      <Modal
        visible={mostrarCategorias}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarCategorias(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Categorías</Text>
              <TouchableOpacity onPress={() => setMostrarCategorias(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categorias}
              keyExtractor={(item) => item.category_id.toString()}
              renderItem={renderCategoria}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoriasList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
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
  topBar: {
    padding: 10,
    paddingTop: 15,
  },
  buscadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buscadorIcono: {
    marginRight: 10,
  },
  buscadorInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  botonCategorias: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  botonCategoriasText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  lista: {
    padding: 10,
  },
  posterItem: {
    width: POSTER_WIDTH,
    margin: 5,
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
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginLeft: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 15,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoriasList: {
    padding: 10,
  },
  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoriaItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  categoriaItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoriaIconoText: {
    fontSize: 24,
    marginRight: 12,
  },
  categoriaItemText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },
  categoriaItemTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  categoriaItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cantidadText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
});

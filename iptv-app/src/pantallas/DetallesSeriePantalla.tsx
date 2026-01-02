import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import iptvServicio from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';

const { width } = Dimensions.get('window');

interface Episodio {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: {
    duration?: string;
    plot?: string;
    rating?: string;
  };
}

export const DetallesSeriePantalla = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { serie } = route.params;

  const [cargando, setCargando] = useState(true);
  const [infoSerie, setInfoSerie] = useState<any>(null);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState<string>('1');
  const [episodios, setEpisodios] = useState<{ [key: string]: Episodio[] }>({});
  const [temporadas, setTemporadas] = useState<any[]>([]);
  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    cargarDetalles();
    verificarFavorito();
  }, []);

  const verificarFavorito = async () => {
    const fav = await esFavorito(`serie_${serie.series_id}`);
    setEsFav(fav);
  };

  const manejarFavorito = async () => {
    const favorito: Favorito = {
      id: `serie_${serie.series_id}`,
      tipo: 'serie',
      nombre: serie.name,
      imagen: serie.cover,
      serieId: serie.series_id,
      fecha: Date.now(),
      datos: serie,
    };

    const nuevoEstado = await toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  const cargarDetalles = async () => {
    try {
      const info = await iptvServicio.getSeriesInfo(serie.series_id);
      setInfoSerie(info);
      
      if (info.episodes) {
        setEpisodios(info.episodes);
        const tempKeys = Object.keys(info.episodes).sort((a, b) => parseInt(a) - parseInt(b));
        if (tempKeys.length > 0) {
          setTemporadaSeleccionada(tempKeys[0]);
        }
      }
      
      if (info.seasons) {
        setTemporadas(info.seasons);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información de la serie');
    } finally {
      setCargando(false);
    }
  };

  const reproducirEpisodio = (episodio: Episodio) => {
    const url = iptvServicio.getSeriesStreamUrl(
      episodio.id,
      episodio.container_extension
    );
    navigation.navigate('Reproductor', {
      url,
      titulo: `${serie.name} - T${temporadaSeleccionada}E${episodio.episode_num} - ${episodio.title}`,
      serie: serie,
      temporada: temporadaSeleccionada,
      episodio: episodio.episode_num,
      serieId: serie.series_id,
      streamId: episodio.id,
    });
  };

  const renderEpisodio = (episodio: Episodio, index: number) => {
    return (
      <TouchableOpacity
        key={episodio.id}
        style={styles.episodioItem}
        onPress={() => reproducirEpisodio(episodio)}
      >
        <View style={styles.episodioNumero}>
          <Text style={styles.episodioNumeroTexto}>{episodio.episode_num}</Text>
        </View>
        <View style={styles.episodioInfo}>
          <Text style={styles.episodioTitulo} numberOfLines={1}>
            {episodio.title || `Episodio ${episodio.episode_num}`}
          </Text>
          {episodio.info?.duration && (
            <Text style={styles.episodioDuracion}>{episodio.info.duration}</Text>
          )}
          {episodio.info?.plot && (
            <Text style={styles.episodioDescripcion} numberOfLines={2}>
              {episodio.info.plot}
            </Text>
          )}
        </View>
        <Ionicons name="play-circle" size={32} color={COLORS.primary} />
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

  const episodiosTemporada = episodios[temporadaSeleccionada] || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con Imagen */}
      <View style={styles.header}>
        {serie.cover ? (
          <Image
            source={{ uri: serie.cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="tv" size={60} color={COLORS.textSecondary} />
          </View>
        )}
        <View style={styles.headerGradient}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Información de la Serie */}
      <View style={styles.infoContainer}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>{serie.name}</Text>
          <TouchableOpacity style={styles.favoritoIcono} onPress={manejarFavorito}>
            <Ionicons 
              name={esFav ? "heart" : "heart-outline"} 
              size={32} 
              color={esFav ? COLORS.primary : COLORS.text} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metaInfo}>
          {serie.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{serie.rating.toString()}</Text>
            </View>
          )}
          {serie.releaseDate && (
            <Text style={styles.metaText}>{serie.releaseDate.split('-')[0]}</Text>
          )}
          {serie.genre && (
            <Text style={styles.metaText}>{serie.genre}</Text>
          )}
        </View>

        {serie.plot && (
          <Text style={styles.descripcion}>{serie.plot}</Text>
        )}

        {serie.cast && (
          <View style={styles.castContainer}>
            <Text style={styles.castLabel}>Reparto:</Text>
            <Text style={styles.castText}>{serie.cast}</Text>
          </View>
        )}
      </View>

      {/* Selector de Temporadas */}
      <View style={styles.temporadasContainer}>
        <Text style={styles.seccionTitulo}>Temporadas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.temporadasScroll}
        >
          {Object.keys(episodios).sort((a, b) => parseInt(a) - parseInt(b)).map((temp) => {
            const isSelected = temp === temporadaSeleccionada;
            return (
              <TouchableOpacity
                key={temp}
                style={[styles.temporadaButton, isSelected && styles.temporadaButtonActive]}
                onPress={() => setTemporadaSeleccionada(temp)}
              >
                <Text style={[styles.temporadaText, isSelected && styles.temporadaTextActive]}>
                  Temporada {temp}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Episodios */}
      <View style={styles.episodiosContainer}>
        <Text style={styles.seccionTitulo}>
          Episodios ({episodiosTemporada.length})
        </Text>
        {episodiosTemporada.map((episodio, index) => renderEpisodio(episodio, index))}
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
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
    width: width,
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  infoContainer: {
    padding: 20,
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titulo: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  favoritoIcono: {
    padding: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  descripcion: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  castContainer: {
    marginTop: 10,
  },
  castLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  castText: {
    color: COLORS.text,
    fontSize: 14,
  },
  temporadasContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  temporadasScroll: {
    paddingRight: 10,
  },
  temporadaButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  temporadaButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  temporadaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  temporadaTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  episodiosContainer: {
    paddingHorizontal: 20,
  },
  episodioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  episodioNumero: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  episodioNumeroTexto: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodioInfo: {
    flex: 1,
  },
  episodioTitulo: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  episodioDuracion: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  episodioDescripcion: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomSpace: {
    height: 30,
  },
});

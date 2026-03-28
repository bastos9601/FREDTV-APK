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
  Modal,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import iptvServicio from '../servicios/iptvServicio';
import tmdbServicio from '../servicios/tmdbServicio';
import { COLORS } from '../utils/constantes';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';
import { useSupabase } from '../contexto/SupabaseContext';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';
import { useSupabaseData } from '../hooks/useSupabaseData';

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
  const { usuarioId } = useSupabase();
  const { perfilActivo } = usePerfilActivo();
  const { obtenerFavoritos: obtenerFavoritosSupabase } = useSupabaseData();
  const { serie } = route.params;

  const [cargando, setCargando] = useState(true);
  const [infoSerie, setInfoSerie] = useState<any>(null);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState<string>('1');
  const [episodios, setEpisodios] = useState<{ [key: string]: Episodio[] }>({});
  const [temporadas, setTemporadas] = useState<any[]>([]);
  const [esFav, setEsFav] = useState(false);
  const [cargandoTrailer, setCargandoTrailer] = useState(false);
  const [modalEpisodios, setModalEpisodios] = useState(false);
  const [temporadaModal, setTemporadaModal] = useState<string>('1');

  useEffect(() => {
    cargarDetalles();
    verificarFavorito();
    buscarDescripcion();
  }, []);

  const verificarFavorito = async () => {
    const id = `serie_${serie.series_id}`;
    // Primero verificar en local
    let fav = await esFavorito(id, perfilActivo?.id);
    
    // Si no está en local pero hay usuarioId, verificar en Supabase
    if (!fav && usuarioId && perfilActivo?.id) {
      const favSupabase = await obtenerFavoritosSupabase(perfilActivo.id);
      fav = favSupabase.some(f => f.canal_id === id);
    }
    
    setEsFav(fav);
  };

  const buscarDescripcion = async () => {
    try {
      setCargandoTrailer(true);
      await tmdbServicio.buscarPeliculaConTrailer(serie.name);
    } catch (error) {
      console.error('Error buscando descripción:', error);
    } finally {
      setCargandoTrailer(false);
    }
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

    const nuevoEstado = await toggleFavorito(favorito, usuarioId || undefined, perfilActivo?.id);
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
          setTemporadaModal(tempKeys[0]);
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

  const reproducirEpisodio = (episodio: Episodio, temporada?: string) => {
    const tempActual = temporada || temporadaSeleccionada;
    const url = iptvServicio.getSeriesStreamUrl(
      episodio.id,
      episodio.container_extension
    );
    
    // Cerrar modal si está abierto
    setModalEpisodios(false);
    
    navigation.navigate('Reproductor', {
      url,
      titulo: `${serie.name} - T${tempActual}E${episodio.episode_num} - ${episodio.title}`,
      serie: serie,
      temporada: tempActual,
      episodio: episodio.episode_num,
      serieId: serie.series_id,
      streamId: episodio.id,
      imagen: episodio.info?.movie_image || serie.cover,
    });
  };

  const abrirModalEpisodios = () => {
    setTemporadaModal(temporadaSeleccionada);
    setModalEpisodios(true);
  };

  const cerrarModalEpisodios = () => {
    setModalEpisodios(false);
  };

  const renderEpisodio = (episodio: Episodio, index: number) => {
    return (
      <TouchableOpacity
        key={episodio.id}
        style={styles.episodioItem}
        onPress={() => reproducirEpisodio(episodio)}
      >
        <View style={styles.episodioImageContainer}>
          {episodio.info?.movie_image ? (
            <Image
              source={{ uri: episodio.info.movie_image }}
              style={styles.episodioImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.episodioImagePlaceholder}>
              <Ionicons name="play" size={32} color="#FFF" />
            </View>
          )}
        </View>
        <View style={styles.episodioInfo}>
          <Text style={styles.episodioTitulo} numberOfLines={1}>
            {episodio.title || `Episodio ${episodio.episode_num}`}
          </Text>
          <View style={styles.episodioMeta}>
            <Text style={styles.episodioNumero}>S{temporadaSeleccionada}E{episodio.episode_num}</Text>
            {episodio.info?.rating && (
              <View style={styles.episodioRating}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.episodioRatingText}>{episodio.info.rating}</Text>
              </View>
            )}
            {episodio.info?.duration && (
              <Text style={styles.episodioDuracion}>{episodio.info.duration}</Text>
            )}
          </View>
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

        {cargandoTrailer && (
          <View style={styles.loadingTrailer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        )}

        {serie.plot && (
          <Text style={styles.descripcion}>{serie.plot}</Text>
        )}

        {serie.cast && (
          <View style={styles.castContainer}>
            <Text style={styles.castLabel}>Reparto:</Text>
            <Text style={styles.castText}>{serie.cast}</Text>
          </View>
        )}

        {/* Géneros */}
        {serie.genre && (
          <View style={styles.generosContainer}>
            <Text style={styles.generosLabel}>Género:</Text>
            <Text style={styles.generosTexto}>{serie.genre}</Text>
          </View>
        )}
      </View>

      {/* Botón Ver Ahora */}
      {episodiosTemporada.length > 0 && (
        <View style={styles.botonVerAhoraContainer}>
          <TouchableOpacity
            style={styles.botonVerAhora}
            onPress={() => reproducirEpisodio(episodiosTemporada[0])}
          >
            <Ionicons name="play" size={24} color="#FFF" />
            <View style={styles.botonVerAhoraTextos}>
              <Text style={styles.botonVerAhoraTexto}>Ver ahora</Text>
              <Text style={styles.botonVerAhoraSubtexto}>S{temporadaSeleccionada}E1</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Selector de Temporadas */}
      <View style={styles.temporadasContainer}>
        <TouchableOpacity 
          style={styles.temporadasHeader}
          onPress={abrirModalEpisodios}
          activeOpacity={0.7}
        >
          <Text style={styles.seccionTitulo}>Temporada {temporadaSeleccionada}</Text>
          <View style={styles.episodiosCountContainer}>
            <Text style={styles.episodiosCount}>Episodios ({episodiosTemporada.length})</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
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

      {/* Modal de Episodios */}
      <Modal
        visible={modalEpisodios}
        animationType="fade"
        transparent={true}
        onRequestClose={cerrarModalEpisodios}
      >
        <Pressable style={styles.modalEpisodiosOverlayFull} onPress={cerrarModalEpisodios}>
          <Pressable style={styles.modalEpisodiosProfesional} onPress={(e) => e.stopPropagation()}>
            {/* Header con título centrado */}
            <View style={styles.modalEpisodiosHeaderSimple}>
              <View style={styles.modalEpisodiosHeaderContenidoSimple}>
                <View style={styles.modalEpisodiosTituloHeaderSimple}>
                  <Text style={styles.modalEpisodiosTituloTextoSimple}>
                    Episodios ({(episodios[temporadaModal] || []).length})
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={cerrarModalEpisodios} 
                  style={styles.modalEpisodiosBotonCerrarHeaderSimple}
                >
                  <Ionicons name="close" size={32} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Selector de Temporadas */}
            <View style={styles.modalEpisodiosTemporadasContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalEpisodiosTemporadasContent}
              >
                {Object.keys(episodios).sort((a, b) => parseInt(a) - parseInt(b)).map((temp) => (
                  <TouchableOpacity
                    key={temp}
                    style={[
                      styles.modalEpisodiosTemporadaBtnPro,
                      temp === temporadaModal && styles.modalEpisodiosTemporadaBtnProActiva
                    ]}
                    onPress={() => setTemporadaModal(temp)}
                  >
                    <Text style={[
                      styles.modalEpisodiosTemporadaTextoPro,
                      temp === temporadaModal && styles.modalEpisodiosTemporadaTextoProActivo
                    ]}>
                      Temporada {temp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Lista de Episodios Horizontal */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalEpisodiosListaContent}
              scrollEventThrottle={16}
            >
              {(episodios[temporadaModal] || []).map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalEpisodioItemProNuevo,
                      index === 0 && styles.modalEpisodioItemProPrimero,
                      index === (episodios[temporadaModal] || []).length - 1 && styles.modalEpisodioItemProUltimo
                    ]}
                    onPress={() => reproducirEpisodio(item, temporadaModal)}
                    activeOpacity={0.8}
                  >
                    {/* Contenedor de Imagen */}
                    <View style={styles.modalEpisodioImagenProNuevo}>
                      {item.info?.movie_image ? (
                        <Image
                          source={{ uri: item.info.movie_image }}
                          style={styles.modalEpisodioImagenProImgNuevo}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.modalEpisodioImagenProPlaceholderNuevo}>
                          <Ionicons name="film" size={50} color={COLORS.primary} />
                        </View>
                      )}
                      
                      {/* Overlay con Play */}
                      <View style={styles.modalEpisodioImagenProOverlayNuevo}>
                        <View style={styles.modalEpisodioPlayButtonNuevo}>
                          <Ionicons name="play" size={24} color="#000" />
                        </View>
                      </View>

                      {/* Rating en esquina superior izquierda */}
                      {item.info?.rating && (
                        <View style={styles.modalEpisodioRatingBadge}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.modalEpisodioRatingBadgeTexto}>
                            {item.info.rating}
                          </Text>
                        </View>
                      )}

                      {/* Duración en esquina inferior izquierda */}
                      {item.info?.duration && (
                        <View style={styles.modalEpisodioDuracionBadge}>
                          <Text style={styles.modalEpisodioDuracionBadgeTexto}>
                            {item.info.duration}
                          </Text>
                        </View>
                      )}

                      {/* Info del Episodio en la parte inferior */}
                      <View style={styles.modalEpisodioInfoProNuevo}>
                        <Text style={styles.modalEpisodioNumeroProNuevo}>
                          Episodio {item.episode_num}
                        </Text>
                        <Text style={styles.modalEpisodioTituloProNuevo} numberOfLines={1}>
                          {item.title || `Episodio ${item.episode_num}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
  loadingTrailer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 14,
    marginLeft: 10,
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
  botonVerAhora: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botonVerAhoraTextos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botonVerAhoraTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonVerAhoraSubtexto: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  botonVerAhoraContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  generosContainer: {
    marginTop: 10,
  },
  generosLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  generosTexto: {
    color: COLORS.text,
    fontSize: 14,
  },
  temporadasContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  temporadasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  episodiosCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  episodiosCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  episodioImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  episodioImage: {
    width: '100%',
    height: '100%',
  },
  episodioImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodioInfo: {
    flex: 1,
  },
  episodioTitulo: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  episodioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  episodioNumero: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  episodioRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  episodioRatingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  episodioDuracion: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  episodioDescripcion: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  bottomSpace: {
    height: 30,
  },
  // Estilos del Modal de Episodios
  modalEpisodiosOverlayFull: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalEpisodiosProfesional: {
    backgroundColor: 'transparent',
    width: '100%',
    maxHeight: '70%',
  },
  modalEpisodiosHeaderSimple: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  modalEpisodiosHeaderContenidoSimple: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  modalEpisodiosTituloHeaderSimple: {
    alignItems: 'center',
  },
  modalEpisodiosTituloTextoSimple: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  modalEpisodiosSubtituloTextoSimple: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
  modalEpisodiosBotonCerrarHeaderSimple: {
    position: 'absolute',
    right: 0,
    top: -5,
    padding: 8,
  },
  modalEpisodiosTemporadasContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalEpisodiosTemporadasContent: {
    gap: 12,
  },
  modalEpisodiosTemporadaBtnPro: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalEpisodiosTemporadaBtnProActiva: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modalEpisodiosTemporadaTextoPro: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  modalEpisodiosTemporadaTextoProActivo: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalEpisodiosListaContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
    alignItems: 'center',
  },
  modalEpisodioItemProNuevo: {
    width: 280,
    height: 160,
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalEpisodioItemProPrimero: {
    marginLeft: 5,
  },
  modalEpisodioItemProUltimo: {
    marginRight: 5,
  },
  modalEpisodioImagenProNuevo: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  modalEpisodioImagenProImgNuevo: {
    width: '100%',
    height: '100%',
  },
  modalEpisodioImagenProPlaceholderNuevo: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEpisodioImagenProOverlayNuevo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEpisodioPlayButtonNuevo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modalEpisodioDuracionBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 5,
  },
  modalEpisodioDuracionBadgeTexto: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  modalEpisodioRatingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    zIndex: 5,
  },
  modalEpisodioRatingBadgeTexto: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalEpisodioInfoProNuevo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  modalEpisodioNumeroProNuevo: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalEpisodioTituloProNuevo: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalEpisodioDescripcionProNuevo: {
    display: 'none',
  },
});

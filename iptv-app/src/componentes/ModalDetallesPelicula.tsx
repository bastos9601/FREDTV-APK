import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { VodStream } from '../servicios/iptvServicio';
import iptvServicio from '../servicios/iptvServicio';
import tmdbServicio from '../servicios/tmdbServicio';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';

interface ModalDetallesPeliculaProps {
  visible: boolean;
  pelicula: VodStream | null;
  onClose: () => void;
  onReproducir?: (pelicula: VodStream) => void;
  usuarioId?: string;
  perfilId?: string;
}

const { width, height } = Dimensions.get('window');

export const ModalDetallesPelicula: React.FC<ModalDetallesPeliculaProps> = ({
  visible,
  pelicula,
  onClose,
  onReproducir,
  usuarioId,
  perfilId,
}) => {
  const [esFav, setEsFav] = useState(false);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [detallesTMDB, setDetallesTMDB] = useState<any>(null);
  const [peliculasSimilares, setPeliculasSimilares] = useState<VodStream[]>([]);

  useEffect(() => {
    if (visible && pelicula) {
      verificarFavorito();
      cargarDetalles();
    }
  }, [visible, pelicula?.stream_id]);

  const verificarFavorito = async () => {
    if (!pelicula) return;
    const fav = await esFavorito(`pelicula_${pelicula.stream_id}`);
    setEsFav(fav);
  };

  const cargarDetalles = async () => {
    if (!pelicula) return;
    try {
      setCargandoDetalles(true);
      const { pelicula: peliculaTMDB } = await tmdbServicio.buscarPeliculaConTrailer(pelicula.name);
      
      if (peliculaTMDB) {
        setDetallesTMDB(peliculaTMDB);
      }
      
      // Cargar películas similares
      const todasPeliculas = await iptvServicio.getVodStreams();
      const similares = todasPeliculas
        .filter(p => p.stream_id !== pelicula.stream_id && p.category_id === pelicula.category_id)
        .slice(0, 10);
      setPeliculasSimilares(similares);
    } catch (error) {
      console.error('Error cargando detalles:', error);
    } finally {
      setCargandoDetalles(false);
    }
  };

  const manejarFavorito = async () => {
    if (!pelicula) return;
    const favorito: Favorito = {
      id: `pelicula_${pelicula.stream_id}`,
      tipo: 'pelicula',
      nombre: pelicula.name,
      imagen: pelicula.stream_icon,
      streamId: pelicula.stream_id,
      fecha: Date.now(),
      datos: pelicula,
    };

    const nuevoEstado = await toggleFavorito(favorito, usuarioId, perfilId);
    setEsFav(nuevoEstado);
  };

  const reproducirPelicula = () => {
    if (!pelicula || !onReproducir) return;
    onReproducir(pelicula);
    onClose();
  };

  if (!pelicula) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView 
          style={styles.modalContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {/* Header con imagen de fondo */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: pelicula.stream_icon }}
              style={styles.backdropImage}
              resizeMode="cover"
              blurRadius={2}
            />
            
            {/* Gradiente oscuro */}
            <View style={styles.gradientOverlay} />
            
            {/* Botón cerrar */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>

            {/* Título sobre la imagen */}
            <View style={styles.tituloContainer}>
              <Text style={styles.tituloGrande}>{pelicula.name}</Text>
            </View>
          </View>

          {/* Contenido */}
          <View style={styles.contentContainer}>
            {/* Rating, duración y fecha */}
            <View style={styles.metaRow}>
              {/* Estrellas de rating */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= (pelicula.rating_5based || 0) ? 'star' : 'star-outline'}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
              
              {/* Duración */}
              <Text style={styles.metaText}>1h 28m</Text>
              
              {/* Fecha */}
              {pelicula.added && (
                <Text style={styles.metaText}>
                  {new Date(parseInt(pelicula.added.toString()) * 1000).toLocaleDateString('es-ES')}
                </Text>
              )}
              
              {/* Botón favorito */}
              <TouchableOpacity 
                style={styles.favoritoIcono}
                onPress={manejarFavorito}
              >
                <Ionicons
                  name={esFav ? 'heart' : 'heart-outline'}
                  size={28}
                  color={esFav ? COLORS.primary : COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {/* Botón Ver ahora */}
            <TouchableOpacity 
              style={styles.verAhoraButton}
              onPress={reproducirPelicula}
            >
              <Ionicons name="play" size={24} color="#FFF" />
              <Text style={styles.verAhoraText}>Ver ahora</Text>
            </TouchableOpacity>

            {/* Descripción */}
            {cargandoDetalles ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : detallesTMDB?.overview ? (
              <Text style={styles.descripcionText} numberOfLines={3}>
                {detallesTMDB.overview}
              </Text>
            ) : null}

            {/* Género y Director */}
            {detallesTMDB && (
              <View style={styles.infoSection}>
                {detallesTMDB.genres && detallesTMDB.genres.length > 0 && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Género: </Text>
                    {detallesTMDB.genres.map((g: any) => g.name).join(' / ')}
                  </Text>
                )}
                {detallesTMDB.director && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Dirigido por: </Text>
                    {detallesTMDB.director}
                  </Text>
                )}
              </View>
            )}

            {/* Reparto & Equipo */}
            {detallesTMDB?.cast && detallesTMDB.cast.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reparto & Equipo</Text>
                <FlatList
                  horizontal
                  data={detallesTMDB.cast.slice(0, 10)}
                  keyExtractor={(item: any, index: number) => `cast-${index}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }: { item: any }) => (
                    <View style={styles.castItem}>
                      {item.profile_path ? (
                        <Image
                          source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
                          style={styles.castImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.castPlaceholder}>
                          <Ionicons name="person" size={40} color={COLORS.textSecondary} />
                        </View>
                      )}
                      <Text style={styles.castName} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

            {/* Más como esto */}
            {peliculasSimilares.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Más como esto</Text>
                <FlatList
                  horizontal
                  data={peliculasSimilares}
                  keyExtractor={(item: VodStream) => `similar-${item.stream_id}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }: { item: VodStream }) => (
                    <TouchableOpacity
                      style={styles.similarItem}
                      onPress={() => {
                        onClose();
                        setTimeout(() => {
                          if (onReproducir) onReproducir(item);
                        }, 300);
                      }}
                    >
                      {item.stream_icon ? (
                        <Image
                          source={{ uri: item.stream_icon }}
                          style={styles.similarImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.similarPlaceholder}>
                          <Ionicons name="film" size={30} color={COLORS.textSecondary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'transparent',
    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tituloGrande: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  favoritoIcono: {
    marginLeft: 'auto',
  },
  verAhoraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },
  verAhoraText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descripcionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  infoLabel: {
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  castItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  castImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    marginBottom: 8,
  },
  castPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  castName: {
    color: COLORS.text,
    fontSize: 12,
    textAlign: 'center',
  },
  similarItem: {
    width: 120,
    marginRight: 12,
  },
  similarImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  similarPlaceholder: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});

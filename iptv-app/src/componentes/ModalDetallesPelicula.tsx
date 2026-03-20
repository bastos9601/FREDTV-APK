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
  const [cargandoTrailer, setCargandoTrailer] = useState(false);
  const [descripcion, setDescripcion] = useState<string>('');

  useEffect(() => {
    if (visible && pelicula) {
      verificarFavorito();
      buscarDescripcion();
    }
  }, [visible, pelicula?.stream_id]);

  const verificarFavorito = async () => {
    if (!pelicula) return;
    const fav = await esFavorito(`pelicula_${pelicula.stream_id}`);
    setEsFav(fav);
  };

  const buscarDescripcion = async () => {
    if (!pelicula) return;
    try {
      setCargandoTrailer(true);
      const { pelicula: peliculaTMDB } = await tmdbServicio.buscarPeliculaConTrailer(pelicula.name);
      
      if (peliculaTMDB && peliculaTMDB.overview) {
        setDescripcion(peliculaTMDB.overview);
      }
    } catch (error) {
      console.error('Error buscando descripción:', error);
    } finally {
      setCargandoTrailer(false);
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
          {/* Header con imagen */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: pelicula.stream_icon }}
              style={styles.posterImage}
              resizeMode="cover"
            />
            
            {/* Botón cerrar */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          <View style={styles.contentContainer}>
            {/* Título y rating */}
            <Text style={styles.titulo}>{pelicula.name}</Text>
            
            <View style={styles.metaContainer}>
              {pelicula.rating && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{pelicula.rating}</Text>
                </View>
              )}
              {pelicula.added && (
                <Text style={styles.yearText}>
                  {new Date(parseInt(pelicula.added.toString()) * 1000).getFullYear()}
                </Text>
              )}
            </View>

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={reproducirPelicula}
              >
                <Ionicons name="play" size={20} color="#FFF" />
                <Text style={styles.playButtonText}>Reproducir</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.favoritoButton}
                onPress={manejarFavorito}
              >
                <Ionicons
                  name={esFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={esFav ? COLORS.primary : COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {/* Sinopsis */}
            {cargandoTrailer ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : descripcion ? (
              <View style={styles.sinopsisContainer}>
                <Text style={styles.sinopsisTitle}>Sinopsis</Text>
                <Text style={styles.sinopsisText}>{descripcion}</Text>
              </View>
            ) : null}

            {/* Información adicional */}
            <View style={styles.infoContainer}>
              {pelicula.rating_5based && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Rating:</Text>
                  <Text style={styles.infoValue}>{pelicula.rating_5based}/5</Text>
                </View>
              )}
              {pelicula.container_extension && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Formato:</Text>
                  <Text style={styles.infoValue}>{pelicula.container_extension.toUpperCase()}</Text>
                </View>
              )}
            </View>

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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  ratingText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  yearText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritoButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sinopsisContainer: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sinopsisTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sinopsisText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSpace: {
    height: 20,
  },
});

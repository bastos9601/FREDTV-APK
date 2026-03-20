import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { VodStream } from '../servicios/iptvServicio';
import tmdbServicio from '../servicios/tmdbServicio';

interface BannerConTrailerProps {
  pelicula: VodStream;
  onPress: () => void;
  bannerIndex: number;
  totalBanners: number;
}

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

export const BannerConTrailer: React.FC<BannerConTrailerProps> = ({
  pelicula,
  onPress,
  bannerIndex,
  totalBanners,
}) => {
  const [cargandoTrailer, setCargandoTrailer] = useState(false);

  useEffect(() => {
    buscarTrailer();
  }, [pelicula.stream_id]);

  const buscarTrailer = async () => {
    try {
      setCargandoTrailer(true);
      await tmdbServicio.buscarPeliculaConTrailer(pelicula.name);
    } catch (error) {
      console.error('Error buscando trailer:', error);
    } finally {
      setCargandoTrailer(false);
    }
  };

  // Mostrar banner con imagen
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
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

      {/* Overlay oscuro */}
      <View style={styles.bannerGradient}>
        <Text style={styles.bannerTitle}>{pelicula.name}</Text>
        <View style={styles.bannerButtons}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={onPress}
          >
            <Ionicons name="play" size={20} color="#000" />
            <Text style={styles.playButtonText}>Ver Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Indicadores de puntos */}
      <View style={styles.bannerDots}>
        {Array.from({ length: totalBanners }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === bannerIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Indicador de carga de trailer */}
      {cargandoTrailer && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: BANNER_HEIGHT,
    marginBottom: 20,
    position: 'relative',
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
    gap: 10,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  playButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
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
  loadingIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

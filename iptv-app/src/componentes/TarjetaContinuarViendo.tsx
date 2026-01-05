import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { ProgresoVideo } from '../utils/progresoStorage';

interface TarjetaContinuarViendoProps {
  progreso: ProgresoVideo;
  onPress: () => void;
  onRemove: () => void;
}

export const TarjetaContinuarViendo: React.FC<TarjetaContinuarViendoProps> = ({
  progreso,
  onPress,
  onRemove,
}) => {
  // Debug: verificar si la imagen está presente
  console.log(`Tarjeta: ${progreso.titulo}, Imagen: ${progreso.imagen || 'NO TIENE'}`);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
        {progreso.imagen ? (
          <Image
            source={{ uri: progreso.imagen }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.log(`Error cargando imagen para ${progreso.titulo}:`, error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log(`Imagen cargada exitosamente para ${progreso.titulo}`);
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons 
              name={progreso.tipo === 'episodio' ? 'tv' : 'film'} 
              size={40} 
              color={COLORS.textSecondary} 
            />
          </View>
        )}
        
        {/* Overlay oscuro para mejor visibilidad */}
        <View style={styles.overlay} />
        
        {/* Icono de play centrado */}
        <View style={styles.playIconContainer}>
          <Ionicons name="play-circle" size={32} color="rgba(255,255,255,0.9)" />
        </View>
        
        {/* Barra de progreso */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progreso.porcentaje}%` }
            ]} 
          />
        </View>
        
        {/* Badge de porcentaje */}
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>
            {Math.round(progreso.porcentaje)}%
          </Text>
        </View>
        
        {/* Botón X para eliminar */}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <Text style={styles.title} numberOfLines={2}>
        {progreso.titulo}
      </Text>
      
      <Text style={styles.info}>
        {progreso.tipo === 'episodio' 
          ? `T${progreso.temporada} E${progreso.episodio}` 
          : progreso.tipo === 'pelicula' ? 'Película' : 'Serie'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 10,
  },
  imageContainer: {
    width: 160,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  percentageBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  percentageText: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 2,
  },
  info: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});

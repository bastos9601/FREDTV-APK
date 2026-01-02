import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import iptvServicio from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { toggleFavorito, esFavorito, Favorito } from '../utils/favoritosStorage';

const { width } = Dimensions.get('window');

export const DetallesPeliculaPantalla = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { pelicula } = route.params;
  const [esFav, setEsFav] = useState(false);

  useEffect(() => {
    verificarFavorito();
  }, []);

  const verificarFavorito = async () => {
    const fav = await esFavorito(`pelicula_${pelicula.stream_id}`);
    setEsFav(fav);
  };

  const manejarFavorito = async () => {
    const favorito: Favorito = {
      id: `pelicula_${pelicula.stream_id}`,
      tipo: 'pelicula',
      nombre: pelicula.name,
      imagen: pelicula.stream_icon,
      streamId: pelicula.stream_id,
      fecha: Date.now(),
      datos: pelicula,
    };

    const nuevoEstado = await toggleFavorito(favorito);
    setEsFav(nuevoEstado);
  };

  const reproducirPelicula = () => {
    const url = iptvServicio.getVodStreamUrl(
      pelicula.stream_id,
      pelicula.container_extension
    );
    navigation.navigate('Reproductor', {
      url,
      titulo: pelicula.name,
      streamId: pelicula.stream_id,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con Imagen */}
      <View style={styles.header}>
        {pelicula.stream_icon ? (
          <Image
            source={{ uri: pelicula.stream_icon }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="film" size={60} color={COLORS.textSecondary} />
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

      {/* Información de la Película */}
      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{pelicula.name}</Text>
        
        <View style={styles.metaInfo}>
          {pelicula.rating && (
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{pelicula.rating.toString()}</Text>
            </View>
          )}
          {pelicula.added && (
            <Text style={styles.metaText}>
              {new Date(parseInt(pelicula.added.toString()) * 1000).getFullYear()}
            </Text>
          )}
          {pelicula.container_extension && (
            <Text style={styles.metaText}>{pelicula.container_extension.toUpperCase()}</Text>
          )}
        </View>

        {/* Botones de Acción */}
        <View style={styles.botonesAccion}>
          <TouchableOpacity style={styles.playButton} onPress={reproducirPelicula}>
            <Ionicons name="play" size={24} color="#FFF" />
            <Text style={styles.playButtonText}>Reproducir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.favoritoButton} onPress={manejarFavorito}>
            <Ionicons 
              name={esFav ? "heart" : "heart-outline"} 
              size={24} 
              color={esFav ? COLORS.primary : "#FFF"} 
            />
            <Text style={styles.favoritoButtonText}>
              {esFav ? 'En favoritos' : 'Favorito'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información Adicional */}
        <View style={styles.additionalInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Agregado: {pelicula.added ? new Date(parseInt(pelicula.added.toString()) * 1000).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          {pelicula.rating_5based && (
            <View style={styles.infoRow}>
              <Ionicons name="star-half-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>
                Rating: {pelicula.rating_5based.toString()}/5
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="videocam-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Formato: {pelicula.container_extension || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Categoría */}
        {pelicula.category_id && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Categoría</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>ID: {pelicula.category_id.toString()}</Text>
            </View>
          </View>
        )}
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
  header: {
    width: width,
    height: 400,
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
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginLeft: 5,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginRight: 15,
  },
  botonesAccion: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  favoritoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  favoritoButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  additionalInfo: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 15,
  },
  categoryContainer: {
    marginTop: 10,
  },
  categoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: COLORS.text,
    fontSize: 14,
  },
  bottomSpace: {
    height: 30,
  },
});

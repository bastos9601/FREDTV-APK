import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
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

export const DetallesPeliculaPantalla = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { usuarioId } = useSupabase();
  const { perfilActivo } = usePerfilActivo();
  const { obtenerFavoritos: obtenerFavoritosSupabase } = useSupabaseData();
  const { pelicula } = route.params;
  const [esFav, setEsFav] = useState(false);
  const [cargandoTrailer, setCargandoTrailer] = useState(false);
  const [descripcion, setDescripcion] = useState<string>('');
  const [reparto, setReparto] = useState<any[]>([]);
  const [peliculasSimilares, setPeliculasSimilares] = useState<any[]>([]);

  useEffect(() => {
    verificarFavorito();
    buscarDescripcion();
  }, [pelicula.stream_id]);

  const verificarFavorito = async () => {
    const id = `pelicula_${pelicula.stream_id}`;
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
      const { pelicula: peliculaTMDB, reparto: repartoTMDB, similares } = await tmdbServicio.buscarPeliculaConTrailer(pelicula.name);
      
      if (peliculaTMDB && peliculaTMDB.overview) {
        setDescripcion(peliculaTMDB.overview);
      }
      
      if (repartoTMDB && repartoTMDB.length > 0) {
        setReparto(repartoTMDB.slice(0, 4)); // Mostrar solo los primeros 4
      }
      
      if (similares && similares.length > 0) {
        setPeliculasSimilares(similares.slice(0, 3)); // Mostrar solo las primeras 3
      }
    } catch (error) {
      console.error('Error buscando descripción:', error);
    } finally {
      setCargandoTrailer(false);
    }
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

    const nuevoEstado = await toggleFavorito(favorito, usuarioId || undefined, perfilActivo?.id);
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
      imagen: pelicula.stream_icon,
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
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>{pelicula.name}</Text>
          <TouchableOpacity style={styles.favoritoIcono} onPress={manejarFavorito}>
            <Ionicons 
              name={esFav ? "heart" : "heart-outline"} 
              size={32} 
              color={esFav ? COLORS.primary : COLORS.text} 
            />
          </TouchableOpacity>
        </View>
        
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

        {cargandoTrailer && (
          <View style={styles.loadingTrailer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        )}

        {/* Descripción */}
        {descripcion && (
          <Text style={styles.descripcion}>{descripcion}</Text>
        )}

        {/* Géneros */}
        {pelicula.category_id && (
          <View style={styles.generosContainer}>
            <Text style={styles.generosLabel}>Categoría:</Text>
            <Text style={styles.generosTexto}>ID: {pelicula.category_id.toString()}</Text>
          </View>
        )}
      </View>

      {/* Botón Ver Ahora */}
      <View style={styles.botonVerAhoraContainer}>
        <TouchableOpacity
          style={styles.botonVerAhora}
          onPress={reproducirPelicula}
        >
          <Ionicons name="play" size={24} color="#FFF" />
          <Text style={styles.botonVerAhoraTexto}>Ver ahora</Text>
        </TouchableOpacity>
      </View>

      {/* Reparto & Equipo */}
      {reparto.length > 0 && (
        <View style={styles.repartoContainer}>
          <Text style={styles.seccionTitulo}>Reparto & Equipo</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.repartoScroll}
          >
            {reparto.map((actor, index) => (
              <View key={index} style={styles.repartoItem}>
                {actor.profile_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${actor.profile_path}` }}
                    style={styles.repartoImagen}
                  />
                ) : (
                  <View style={styles.repartoImagenPlaceholder}>
                    <Ionicons name="person" size={40} color={COLORS.textSecondary} />
                  </View>
                )}
                <Text style={styles.repartoNombre} numberOfLines={2}>
                  {actor.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Más como esto */}
      {peliculasSimilares.length > 0 && (
        <View style={styles.masComoEstoContainer}>
          <Text style={styles.seccionTitulo}>Más como esto</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.masComoEstoScroll}
          >
            {peliculasSimilares.map((peliSimilar, index) => (
              <TouchableOpacity
                key={index}
                style={styles.masComoEstoItem}
                onPress={() => {
                  // Navegar a detalles de la película similar
                  navigation.push('DetallesPelicula', {
                    pelicula: {
                      stream_id: peliSimilar.id,
                      name: peliSimilar.title,
                      stream_icon: peliSimilar.poster_path ? `https://image.tmdb.org/t/p/w500${peliSimilar.poster_path}` : '',
                    }
                  });
                }}
              >
                <View>
                  {peliSimilar.poster_path ? (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w500${peliSimilar.poster_path}` }}
                      style={styles.masComoEstoImagen}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.masComoEstoImagenPlaceholder}>
                      <Ionicons name="film" size={40} color={COLORS.textSecondary} />
                    </View>
                  )}
                  <Text style={styles.masComoEstoTitulo} numberOfLines={2}>
                    {peliSimilar.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

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
    marginLeft: 5,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginRight: 15,
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
  botonVerAhoraContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  botonVerAhoraTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  repartoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  repartoScroll: {
    paddingRight: 20,
    gap: 15,
  },
  repartoItem: {
    alignItems: 'center',
    width: 100,
  },
  repartoImagen: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  repartoImagenPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  repartoNombre: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  masComoEstoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  masComoEstoScroll: {
    paddingRight: 20,
    gap: 15,
  },
  masComoEstoItem: {
    width: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  masComoEstoImagen: {
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  masComoEstoImagenPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 10,
  },
  masComoEstoTitulo: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomSpace: {
    height: 30,
  },
});

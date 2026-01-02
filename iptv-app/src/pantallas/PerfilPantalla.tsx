import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';
import { obtenerFavoritos, eliminarFavorito, Favorito } from '../utils/favoritosStorage';
import { obtenerTodosLosProgresos, ProgresoVideo, eliminarProgreso } from '../utils/progresoStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import iptvServicio from '../servicios/iptvServicio';

const POSTER_WIDTH = 110;
const POSTER_HEIGHT = 165;

export const PerfilPantalla = () => {
  const { usuario, cerrarSesion } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [continuarViendo, setContinuarViendo] = useState<ProgresoVideo[]>([]);
  const [pestanaActiva, setPestanaActiva] = useState<'favoritos' | 'continuar'>('favoritos');
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    const favs = await obtenerFavoritos();
    setFavoritos(favs.sort((a, b) => b.fecha - a.fecha));

    const progresos = await obtenerTodosLosProgresos();
    setContinuarViendo(progresos.sort((a, b) => b.fecha - a.fecha).slice(0, 20));
  };

  const confirmarEliminarFavorito = (favorito: Favorito) => {
    Alert.alert(
      'Eliminar favorito',
      `¿Deseas eliminar "${favorito.nombre}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarFavorito(favorito.id);
            cargarDatos();
          },
        },
      ]
    );
  };

  const reproducirFavorito = (favorito: Favorito) => {
    if (favorito.tipo === 'pelicula' && favorito.datos) {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.navigate('DetallesPelicula', { pelicula: favorito.datos });
      }
    } else if (favorito.tipo === 'serie' && favorito.datos) {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.navigate('DetallesSerie', { serie: favorito.datos });
      }
    } else if (favorito.tipo === 'canal' && favorito.streamId) {
      const url = iptvServicio.getLiveStreamUrl(favorito.streamId, 'm3u8');
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.navigate('Reproductor', {
          url,
          titulo: favorito.nombre,
          esTvEnVivo: true,
        });
      }
    }
  };

  const continuarReproduccion = (progreso: ProgresoVideo) => {
    const parentNavigation = navigation.getParent();
    if (!parentNavigation) return;

    // Verificar que tengamos la URL guardada
    if (!progreso.url) {
      Alert.alert(
        'Contenido no disponible',
        'Este contenido fue guardado con una versión anterior. Por favor, elimínalo y vuelve a verlo para que se guarde correctamente.',
        [
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              await eliminarProgreso(progreso.id);
              cargarDatos();
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    // Reproducir usando la URL guardada
    parentNavigation.navigate('Reproductor', {
      url: progreso.url,
      titulo: progreso.titulo,
      streamId: progreso.streamId,
      serieId: progreso.serieId,
      temporada: progreso.temporada,
      episodio: progreso.episodio,
      posicionInicial: progreso.posicion,
      esTvEnVivo: false,
    });
  };

  const renderFavorito = ({ item }: { item: Favorito }) => (
    <TouchableOpacity
      style={styles.favoritoItem}
      onPress={() => reproducirFavorito(item)}
    >
      {item.imagen ? (
        <Image
          source={{ uri: item.imagen }}
          style={styles.favoritoImagen}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.favoritoPlaceholder}>
          <Ionicons
            name={item.tipo === 'pelicula' ? 'film' : item.tipo === 'serie' ? 'tv' : 'radio'}
            size={40}
            color={COLORS.textSecondary}
          />
        </View>
      )}
      <View style={styles.favoritoInfo}>
        <Text style={styles.favoritoNombre} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.favoritoTipo}>
          {item.tipo === 'pelicula' ? '🎬 Película' : item.tipo === 'serie' ? '📺 Serie' : '📡 Canal'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={() => confirmarEliminarFavorito(item)}
      >
        <Ionicons name="heart" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const confirmarEliminarProgreso = (progreso: ProgresoVideo) => {
    Alert.alert(
      'Eliminar de continuar viendo',
      `¿Deseas eliminar "${progreso.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await eliminarProgreso(progreso.id);
            cargarDatos();
          },
        },
      ]
    );
  };

  const renderProgreso = ({ item }: { item: ProgresoVideo }) => (
    <TouchableOpacity
      style={styles.progresoItem}
      onPress={() => continuarReproduccion(item)}
    >
      <View style={styles.progresoPlaceholder}>
        <Ionicons name="play-circle" size={40} color={COLORS.primary} />
      </View>
      <View style={styles.progresoInfo}>
        <Text style={styles.progresoTitulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        <View style={styles.progresoBarraContainer}>
          <View style={styles.progresoBarraFondo}>
            <View style={[styles.progresoBarraProgreso, { width: `${item.porcentaje}%` }]} />
          </View>
          <Text style={styles.progresoPorcentaje}>{Math.round(item.porcentaje)}%</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.botonEliminarProgreso}
        onPress={() => confirmarEliminarProgreso(item)}
      >
        <Ionicons name="close-circle" size={24} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FRED TV</Text>
        <Text style={styles.subtitulo}>Mi Perfil</Text>
      </View>

      {/* Info del Usuario */}
      <View style={styles.userCard}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person-circle" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{usuario?.username || 'Usuario'}</Text>
        <Text style={styles.userInfo}>
          Expira: {usuario?.exp_date ? new Date(parseInt(String(usuario.exp_date)) * 1000).toLocaleDateString() : 'N/A'}
        </Text>
        <Text style={styles.userInfo}>
          Conexiones: {usuario?.active_cons || '0'} / {usuario?.max_connections || '0'}
        </Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Pestañas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, pestanaActiva === 'favoritos' && styles.tabActive]}
          onPress={() => setPestanaActiva('favoritos')}
        >
          <Ionicons
            name="heart"
            size={20}
            color={pestanaActiva === 'favoritos' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, pestanaActiva === 'favoritos' && styles.tabTextActive]}>
            Favoritos ({favoritos.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, pestanaActiva === 'continuar' && styles.tabActive]}
          onPress={() => setPestanaActiva('continuar')}
        >
          <Ionicons
            name="play-circle"
            size={20}
            color={pestanaActiva === 'continuar' ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, pestanaActiva === 'continuar' && styles.tabTextActive]}>
            Continuar viendo ({continuarViendo.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {pestanaActiva === 'favoritos' ? (
          favoritos.length > 0 ? (
            <FlatList
              data={favoritos}
              keyExtractor={(item) => item.id}
              renderItem={renderFavorito}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.lista}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={60} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No tienes favoritos</Text>
              <Text style={styles.emptySubtext}>Agrega películas, series o canales a favoritos</Text>
            </View>
          )
        ) : (
          continuarViendo.length > 0 ? (
            <FlatList
              data={continuarViendo}
              keyExtractor={(item) => item.id}
              renderItem={renderProgreso}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.lista}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="play-circle-outline" size={60} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No hay contenido para continuar</Text>
              <Text style={styles.emptySubtext}>Empieza a ver películas o series</Text>
            </View>
          )
        )}
      </View>
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
  userCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  userIconContainer: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  lista: {
    padding: 15,
  },
  favoritoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  favoritoImagen: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  favoritoPlaceholder: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  favoritoNombre: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  favoritoTipo: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  botonEliminar: {
    padding: 8,
  },
  progresoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  progresoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progresoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  progresoTitulo: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progresoBarraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progresoBarraFondo: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 10,
  },
  progresoBarraProgreso: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progresoPorcentaje: {
    color: COLORS.textSecondary,
    fontSize: 12,
    minWidth: 40,
  },
  botonEliminarProgreso: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

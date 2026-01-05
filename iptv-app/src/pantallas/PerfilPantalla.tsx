import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';
import { obtenerFavoritos, eliminarFavorito, Favorito } from '../utils/favoritosStorage';
import { obtenerTodosLosProgresos, ProgresoVideo, eliminarProgreso } from '../utils/progresoStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import iptvServicio from '../servicios/iptvServicio';

const { width } = Dimensions.get('window');

export const PerfilPantalla = () => {
  const { usuario, cerrarSesion } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [continuarViendo, setContinuarViendo] = useState<ProgresoVideo[]>([]);
  const [pestanaActiva, setPestanaActiva] = useState<'favoritos' | 'continuar'>('favoritos');
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
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
      activeOpacity={0.7}
    >
      <View style={styles.favoritoImageContainer}>
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={[
              styles.favoritoImagen,
              item.tipo === 'canal' && styles.canalImagen
            ]}
            resizeMode={item.tipo === 'canal' ? 'contain' : 'cover'}
          />
        ) : (
          <View style={styles.favoritoPlaceholder}>
            <Ionicons
              name={item.tipo === 'pelicula' ? 'film' : item.tipo === 'serie' ? 'tv' : 'radio'}
              size={50}
              color={COLORS.textSecondary}
            />
          </View>
        )}
        <View style={styles.favoritoOverlay}>
          <TouchableOpacity
            style={styles.botonEliminarFavorito}
            onPress={(e) => {
              e.stopPropagation();
              confirmarEliminarFavorito(item);
            }}
          >
            <Ionicons name="heart" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.tipoBadge}>
          <Ionicons
            name={item.tipo === 'pelicula' ? 'film' : item.tipo === 'serie' ? 'tv' : 'radio'}
            size={12}
            color="#FFF"
          />
        </View>
      </View>
      <Text style={styles.favoritoNombre} numberOfLines={2}>
        {item.nombre}
      </Text>
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
      activeOpacity={0.7}
    >
      <View style={styles.progresoImageContainer}>
        {item.imagen ? (
          <Image
            source={{ uri: item.imagen }}
            style={styles.progresoImagen}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.progresoPlaceholder}>
            <Ionicons name="play-circle" size={50} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.progresoOverlay}>
          <TouchableOpacity
            style={styles.botonEliminarProgreso}
            onPress={(e) => {
              e.stopPropagation();
              confirmarEliminarProgreso(item);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.progresoBarraAbsoluta}>
          <View style={[styles.progresoBarraProgreso, { width: `${item.porcentaje}%` }]} />
        </View>
        <View style={styles.porcentajeBadge}>
          <Text style={styles.porcentajeTexto}>{Math.round(item.porcentaje)}%</Text>
        </View>
      </View>
      <Text style={styles.progresoTitulo} numberOfLines={2}>
        {item.titulo}
      </Text>
      {item.tipo === 'episodio' && (
        <Text style={styles.progresoInfo}>
          T{item.temporada} E{item.episodio}
        </Text>
      )}
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
        
        {/* Barra de Conexiones */}
        <View style={styles.conexionesContainer}>
          <View style={styles.conexionesHeader}>
            <Ionicons name="phone-portrait" size={16} color={COLORS.textSecondary} />
            <Text style={styles.conexionesLabel}>Conexiones</Text>
          </View>
          <View style={styles.conexionesBarraContainer}>
            <View style={styles.conexionesBarraFondo}>
              <View 
                style={[
                  styles.conexionesBarraActiva, 
                  { 
                    width: `${Math.max(
                      ((parseInt(String(usuario?.active_cons || 0)) / parseInt(String(usuario?.max_connections || 1))) * 100),
                      (1 / parseInt(String(usuario?.max_connections || 1))) * 100
                    )}%`,
                    backgroundColor: parseInt(String(usuario?.active_cons || 0)) >= parseInt(String(usuario?.max_connections || 1)) 
                      ? '#EF4444' 
                      : COLORS.primary
                  }
                ]} 
              />
            </View>
            <Text style={styles.conexionesTexto}>
              {Math.max(parseInt(String(usuario?.active_cons || 0)), 1)} / {usuario?.max_connections || '0'}
            </Text>
          </View>
          {parseInt(String(usuario?.active_cons || 0)) === 0 && (
            <Text style={styles.conexionesNota}>
              * Mínimo 1 (este dispositivo)
            </Text>
          )}
        </View>
        
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
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridLista}
              columnWrapperStyle={styles.gridRow}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.emptyScrollContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
            >
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={60} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No tienes favoritos</Text>
                <Text style={styles.emptySubtext}>Agrega películas, series o canales a favoritos</Text>
              </View>
            </ScrollView>
          )
        ) : (
          continuarViendo.length > 0 ? (
            <FlatList
              data={continuarViendo}
              keyExtractor={(item) => item.id}
              renderItem={renderProgreso}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridLista}
              columnWrapperStyle={styles.gridRow}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.emptyScrollContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
            >
              <View style={styles.emptyContainer}>
                <Ionicons name="play-circle-outline" size={60} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No hay contenido para continuar</Text>
                <Text style={styles.emptySubtext}>Empieza a ver películas o series</Text>
              </View>
            </ScrollView>
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
    paddingBottom: 15,
    backgroundColor: COLORS.background,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  userCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  userIconContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 3,
  },
  conexionesContainer: {
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  conexionesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conexionesLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  conexionesBarraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conexionesBarraFondo: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  conexionesBarraActiva: {
    height: '100%',
    borderRadius: 4,
  },
  conexionesTexto: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: 'bold',
    minWidth: 50,
  },
  conexionesNota: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
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
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  gridLista: {
    padding: 8,
  },
  gridRow: {
    justifyContent: 'flex-start',
  },
  favoritoItem: {
    width: (width - 32) / 3,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  favoritoImageContainer: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.card,
  },
  favoritoImagen: {
    width: '100%',
    height: '100%',
  },
  canalImagen: {
    backgroundColor: COLORS.card,
    padding: 10,
  },
  favoritoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  favoritoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0,
  },
  botonEliminarFavorito: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 6,
  },
  tipoBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  favoritoNombre: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  progresoItem: {
    width: (width - 32) / 3,
    marginBottom: 8,
    marginHorizontal: 4,
  },
  progresoImageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.card,
  },
  progresoImagen: {
    width: '100%',
    height: '100%',
  },
  progresoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  progresoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: 0,
  },
  botonEliminarProgreso: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  progresoBarraAbsoluta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progresoBarraProgreso: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  porcentajeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  porcentajeTexto: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  progresoTitulo: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  progresoInfo: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyScrollContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

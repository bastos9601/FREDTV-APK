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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';
import { obtenerFavoritos, eliminarFavorito, Favorito } from '../utils/favoritosStorage';
import { obtenerTodosLosProgresos, ProgresoVideo, eliminarProgreso } from '../utils/progresoStorage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import iptvServicio from '../servicios/iptvServicio';
import { SelectorPerfiles } from '../componentes/SelectorPerfiles';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { ModalPIN } from '../componentes/ModalPIN';

const { width } = Dimensions.get('window');

export const PerfilPantalla = () => {
  const { usuario, cerrarSesion } = useAuth();
  const { perfilActivo } = usePerfilActivo();
  const { obtenerFavoritos: obtenerFavoritosSupabase, obtenerTodosProgresos: obtenerProgresosSupabase, usuarioId, actualizarPinPerfil } = useSupabaseData();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [continuarViendo, setContinuarViendo] = useState<ProgresoVideo[]>([]);
  const [pestanaActiva, setPestanaActiva] = useState<'favoritos' | 'continuar'>('favoritos');
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarSelectorPerfiles, setMostrarSelectorPerfiles] = useState(false);
  const [mostrarModalPin, setMostrarModalPin] = useState(false);
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      console.log('PerfilPantalla enfocada, recargando datos...');
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      // Cargar favoritos: primero del local storage, luego de Supabase si hay usuarioId
      let favs = await obtenerFavoritos(perfilActivo?.id);
      console.log('Favoritos locales cargados:', favs.length);
      
      if (usuarioId && perfilActivo?.id) {
        console.log('Cargando favoritos de Supabase para usuarioId:', usuarioId, 'perfilId:', perfilActivo.id);
        const favSupabase = await obtenerFavoritosSupabase(perfilActivo.id);
        console.log('Favoritos de Supabase:', favSupabase.length, favSupabase.map(f => f.canal_id));
        
        // Usar SOLO favoritos de Supabase como fuente de verdad
        const favMap = new Map();
        
        // Agregar todos los favoritos de Supabase
        favSupabase.forEach(f => {
          // Extraer streamId del canal_id (formato: "pelicula_123" o "serie_456")
          const partes = f.canal_id.split('_');
          const streamId = partes.length > 1 ? parseInt(partes[1]) : undefined;
          
          favMap.set(f.canal_id, {
            id: f.canal_id,
            tipo: (f as any).tipo || 'pelicula' as const,
            nombre: f.titulo,
            imagen: f.imagen,
            fecha: new Date(f.fecha_agregado).getTime(),
            streamId: streamId,
            serieId: (f as any).serie_id,
          });
        });
        
        favs = Array.from(favMap.values());
        console.log('Favoritos finales después de sincronizar:', favs.length);
        
        // Actualizar el almacenamiento local con los favoritos de Supabase
        const storageKey = `@favoritos_${perfilActivo.id}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(favs));
        console.log('Almacenamiento local actualizado con favoritos de Supabase');
      }
      
      setFavoritos(favs.sort((a, b) => b.fecha - a.fecha));
    } catch (error) {
      console.error('Error en cargarDatos:', error);
    }

    // Cargar progresos: primero del local storage, luego de Supabase si hay usuarioId
    let progresos = await obtenerTodosLosProgresos(perfilActivo?.id, usuarioId);
    
    if (usuarioId && perfilActivo?.id) {
      const progSupabase = await obtenerProgresosSupabase(perfilActivo.id);
      // Combinar y eliminar duplicados
      const progMap = new Map();
      progresos.forEach(p => progMap.set(p.id, p));
      progSupabase.forEach(p => {
        if (!progMap.has(p.capitulo_id)) {
          // Reconstruir URL si no está disponible
          let url = (p as any).url || '';
          if (!url && (p as any).streamId) {
            if ((p as any).tipo === 'pelicula') {
              url = `http://zgazy.com:8880/movie/${(p as any).streamId}.${(p as any).extension || 'mp4'}`;
            } else if (((p as any).tipo === 'serie' || (p as any).tipo === 'episodio') && (p as any).temporada && (p as any).episodio) {
              url = `http://zgazy.com:8880/series/${(p as any).serieId}/${(p as any).temporada}/${(p as any).episodio}.${(p as any).extension || 'mp4'}`;
            }
          }
          
          progMap.set(p.capitulo_id, {
            id: p.capitulo_id,
            titulo: p.titulo,
            url: url,
            posicion: p.tiempo_actual,
            duracion: p.duracion,
            porcentaje: p.duracion > 0 ? (p.tiempo_actual / p.duracion) * 100 : 0,
            fecha: new Date(p.fecha_actualizacion).getTime(),
            tipo: (p as any).tipo || 'episodio' as const,
            streamId: (p as any).streamId,
            serieId: (p as any).serieId,
            temporada: (p as any).temporada,
            episodio: (p as any).episodio,
            extension: (p as any).extension,
            imagen: (p as any).imagen,
          });
        }
      });
      progresos = Array.from(progMap.values());
    }
    
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
            await eliminarFavorito(favorito.id, usuarioId || undefined, perfilActivo?.id);
            cargarDatos();
          },
        },
      ]
    );
  };

  const reproducirFavorito = async (favorito: Favorito) => {
    const parentNavigation = navigation.getParent();
    if (!parentNavigation) return;

    try {
      // Si ya tiene datos, usarlos directamente
      if (favorito.datos) {
        if (favorito.tipo === 'pelicula') {
          parentNavigation.navigate('DetallesPelicula', { pelicula: favorito.datos });
        } else if (favorito.tipo === 'serie') {
          parentNavigation.navigate('DetallesSerie', { serie: favorito.datos });
        } else if (favorito.tipo === 'canal') {
          const url = iptvServicio.getLiveStreamUrl(favorito.streamId || 0, 'm3u8');
          parentNavigation.navigate('Reproductor', {
            url,
            titulo: favorito.nombre,
            esTvEnVivo: true,
          });
        }
        return;
      }

      // Si no tiene datos, intentar recuperarlos
      if (favorito.tipo === 'pelicula' && favorito.streamId) {
        // Buscar la película en el servicio IPTV
        const peliculas = await iptvServicio.getVodStreams();
        const pelicula = peliculas.find(p => p.stream_id === favorito.streamId);
        
        if (pelicula) {
          parentNavigation.navigate('DetallesPelicula', { pelicula });
        } else {
          Alert.alert('Error', 'No se pudo encontrar la película');
        }
      } else if (favorito.tipo === 'serie' && favorito.streamId) {
        // Buscar la serie en el servicio IPTV
        const series = await iptvServicio.getSeries();
        const serie = series.find(s => s.series_id === favorito.streamId);
        
        if (serie) {
          parentNavigation.navigate('DetallesSerie', { serie });
        } else {
          Alert.alert('Error', 'No se pudo encontrar la serie');
        }
      } else if (favorito.tipo === 'canal' && favorito.streamId) {
        const url = iptvServicio.getLiveStreamUrl(favorito.streamId, 'm3u8');
        parentNavigation.navigate('Reproductor', {
          url,
          titulo: favorito.nombre,
          esTvEnVivo: true,
        });
      } else {
        Alert.alert(
          'Información incompleta',
          'No hay suficiente información para reproducir este contenido. Por favor, accede desde la pantalla de detalles.',
          [{ text: 'OK', style: 'cancel' }]
        );
      }
    } catch (error) {
      console.error('Error al reproducir favorito:', error);
      Alert.alert('Error', 'No se pudo reproducir el contenido');
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
              await eliminarProgreso(progreso.id, undefined, perfilActivo?.id);
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
            await eliminarProgreso(progreso.id, undefined, perfilActivo?.id);
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
        <Text style={styles.userName}>{perfilActivo?.nombre || usuario?.username || 'Usuario'}</Text>
        <Text style={styles.userInfo}>
          Expira: {usuario?.exp_date ? new Date(parseInt(String(usuario.exp_date)) * 1000).toLocaleDateString() : 'N/A'}
        </Text>
        
        {/* Perfil Activo */}
        {perfilActivo && (
          <View style={styles.perfilActivoContainer}>
            <MaterialCommunityIcons name="account-check" size={16} color={COLORS.primary} />
            <Text style={styles.perfilActivoTexto}>{perfilActivo.nombre}</Text>
          </View>
        )}
        
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
        
        <View style={styles.botonesContainer}>
          <TouchableOpacity 
            style={[styles.boton, styles.botonPerfiles]} 
            onPress={() => setMostrarSelectorPerfiles(true)}
          >
            <MaterialCommunityIcons name="account-multiple" size={18} color="#FFF" />
            <Text style={styles.botonTexto}>Mis Perfiles</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.boton, styles.botonPin]} 
            onPress={() => setMostrarModalPin(true)}
          >
            <MaterialCommunityIcons name={perfilActivo?.pin ? "lock" : "lock-open"} size={18} color="#FFF" />
            <Text style={styles.botonTexto}>PIN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.boton, styles.logoutButton]} onPress={cerrarSesion}>
            <Ionicons name="log-out-outline" size={18} color="#FFF" />
            <Text style={styles.botonTexto}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
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

      {/* Modal Selector de Perfiles */}
      <SelectorPerfiles 
        visible={mostrarSelectorPerfiles} 
        onClose={() => setMostrarSelectorPerfiles(false)} 
      />

      {/* Modal PIN */}
      <ModalPIN
        visible={mostrarModalPin}
        perfilNombre={perfilActivo?.nombre || 'Perfil'}
        modo="crear"
        onConfirm={async (pin) => {
          try {
            const actualizado = await actualizarPinPerfil(perfilActivo?.id || '', pin);
            if (actualizado) {
              setMostrarModalPin(false);
              Alert.alert('Éxito', 'PIN actualizado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo guardar el PIN');
            }
          } catch (error) {
            Alert.alert('Error', 'Error al guardar el PIN');
          }
        }}
        onCancel={() => setMostrarModalPin(false)}
      />
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
  perfilActivoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  perfilActivoTexto: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 6,
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
  botonesContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  boton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  botonPerfiles: {
    backgroundColor: COLORS.primary,
  },
  botonPin: {
    backgroundColor: '#FFD700',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  botonTexto: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import supabaseServicio from '../servicios/supabaseServicio';

export interface Favorito {
  id: string;
  tipo: 'pelicula' | 'serie' | 'canal';
  nombre: string;
  imagen?: string;
  streamId?: number;
  serieId?: number;
  fecha: number;
  datos?: any; // Para guardar datos adicionales del item
}

const getStorageKey = (perfilId?: string) => {
  return perfilId ? `@favoritos_${perfilId}` : '@favoritos';
};

export const agregarFavorito = async (favorito: Favorito, usuarioId?: string, perfilId?: string): Promise<void> => {
  try {
    const favoritos = await obtenerFavoritos(perfilId);
    
    // Verificar si ya existe
    const existe = favoritos.some(f => f.id === favorito.id);
    if (existe) {
      return;
    }

    favoritos.push(favorito);
    const storageKey = getStorageKey(perfilId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(favoritos));
    
    // Guardar en Supabase si hay usuarioId
    if (usuarioId) {
      console.log('Guardando favorito en Supabase:', { usuarioId, perfilId, favorito });
      await supabaseServicio.agregarFavorito({
        usuario_id: usuarioId,
        perfil_id: perfilId,
        canal_id: favorito.id,
        titulo: favorito.nombre,
        imagen: favorito.imagen,
        fecha_agregado: new Date().toISOString(),
      });
    } else {
      console.log('No se guardó en Supabase porque usuarioId es undefined');
    }
  } catch (error) {
    console.error('Error al agregar favorito:', error);
  }
};

export const eliminarFavorito = async (id: string, usuarioId?: string, perfilId?: string): Promise<void> => {
  try {
    console.log('Eliminando favorito:', { id, usuarioId, perfilId });
    const favoritos = await obtenerFavoritos(perfilId);
    const nuevosFavoritos = favoritos.filter(f => f.id !== id);
    const storageKey = getStorageKey(perfilId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(nuevosFavoritos));
    console.log('Favorito eliminado del almacenamiento local');
    
    // Eliminar de Supabase si hay usuarioId
    if (usuarioId) {
      console.log('Eliminando favorito de Supabase:', { usuarioId, id, perfilId });
      await supabaseServicio.eliminarFavorito(usuarioId, id, perfilId);
      console.log('Favorito eliminado de Supabase');
    } else {
      console.log('No se eliminó de Supabase porque usuarioId es undefined');
    }
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
  }
};

export const esFavorito = async (id: string, perfilId?: string): Promise<boolean> => {
  try {
    const favoritos = await obtenerFavoritos(perfilId);
    return favoritos.some(f => f.id === id);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

export const obtenerFavoritos = async (perfilId?: string): Promise<Favorito[]> => {
  try {
    const storageKey = getStorageKey(perfilId);
    const data = await AsyncStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
};

export const obtenerFavoritosPorTipo = async (tipo: 'pelicula' | 'serie' | 'canal', perfilId?: string): Promise<Favorito[]> => {
  try {
    const favoritos = await obtenerFavoritos(perfilId);
    return favoritos.filter(f => f.tipo === tipo);
  } catch (error) {
    console.error('Error al obtener favoritos por tipo:', error);
    return [];
  }
};

export const toggleFavorito = async (favorito: Favorito, usuarioId?: string, perfilId?: string): Promise<boolean> => {
  try {
    const esFav = await esFavorito(favorito.id, perfilId);
    
    if (esFav) {
      await eliminarFavorito(favorito.id, usuarioId, perfilId);
      return false;
    } else {
      await agregarFavorito(favorito, usuarioId, perfilId);
      return true;
    }
  } catch (error) {
    console.error('Error al toggle favorito:', error);
    return false;
  }
};

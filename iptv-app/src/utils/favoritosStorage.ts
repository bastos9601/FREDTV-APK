import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = '@favoritos';

export const agregarFavorito = async (favorito: Favorito): Promise<void> => {
  try {
    const favoritos = await obtenerFavoritos();
    
    // Verificar si ya existe
    const existe = favoritos.some(f => f.id === favorito.id);
    if (existe) {
      return;
    }

    favoritos.push(favorito);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  } catch (error) {
    console.error('Error al agregar favorito:', error);
  }
};

export const eliminarFavorito = async (id: string): Promise<void> => {
  try {
    const favoritos = await obtenerFavoritos();
    const nuevosFavoritos = favoritos.filter(f => f.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosFavoritos));
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
  }
};

export const esFavorito = async (id: string): Promise<boolean> => {
  try {
    const favoritos = await obtenerFavoritos();
    return favoritos.some(f => f.id === id);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

export const obtenerFavoritos = async (): Promise<Favorito[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
};

export const obtenerFavoritosPorTipo = async (tipo: 'pelicula' | 'serie' | 'canal'): Promise<Favorito[]> => {
  try {
    const favoritos = await obtenerFavoritos();
    return favoritos.filter(f => f.tipo === tipo);
  } catch (error) {
    console.error('Error al obtener favoritos por tipo:', error);
    return [];
  }
};

export const toggleFavorito = async (favorito: Favorito): Promise<boolean> => {
  try {
    const esFav = await esFavorito(favorito.id);
    
    if (esFav) {
      await eliminarFavorito(favorito.id);
      return false;
    } else {
      await agregarFavorito(favorito);
      return true;
    }
  } catch (error) {
    console.error('Error al toggle favorito:', error);
    return false;
  }
};

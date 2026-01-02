export interface Favorito {
  id: string;
  tipo: 'pelicula' | 'serie' | 'canal';
  nombre: string;
  imagen?: string;
  fecha: number;
  datos: any;
}

const STORAGE_KEY = '@favoritos';

export const obtenerFavoritos = (): Favorito[] => {
  try {
    const favoritosJSON = localStorage.getItem(STORAGE_KEY);
    return favoritosJSON ? JSON.parse(favoritosJSON) : [];
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
};

export const guardarFavoritos = (favoritos: Favorito[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  } catch (error) {
    console.error('Error al guardar favoritos:', error);
  }
};

export const agregarFavorito = (favorito: Favorito): boolean => {
  try {
    const favoritos = obtenerFavoritos();
    const existe = favoritos.some(f => f.id === favorito.id);
    
    if (!existe) {
      favoritos.unshift(favorito);
      guardarFavoritos(favoritos);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return false;
  }
};

export const eliminarFavorito = (id: string): boolean => {
  try {
    const favoritos = obtenerFavoritos();
    const nuevosFavoritos = favoritos.filter(f => f.id !== id);
    guardarFavoritos(nuevosFavoritos);
    return true;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return false;
  }
};

export const esFavorito = (id: string): boolean => {
  try {
    const favoritos = obtenerFavoritos();
    return favoritos.some(f => f.id === id);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
};

export const toggleFavorito = (favorito: Favorito): boolean => {
  if (esFavorito(favorito.id)) {
    eliminarFavorito(favorito.id);
    return false;
  } else {
    agregarFavorito(favorito);
    return true;
  }
};

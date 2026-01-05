import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Perfil {
  id: string;
  nombre: string;
  avatar: string; // Nombre del icono de Ionicons
  esInfantil: boolean;
  pin?: string; // PIN opcional para proteger el perfil
  fechaCreacion: number;
}

const STORAGE_KEY = '@perfiles';
const PERFIL_ACTIVO_KEY = '@perfil_activo';

// Avatares disponibles
export const AVATARES_DISPONIBLES = [
  'person-circle',
  'happy',
  'heart-circle',
  'star',
  'rocket',
  'game-controller',
  'pizza',
  'ice-cream',
  'football',
  'basketball',
  'musical-notes',
  'camera',
  'airplane',
  'car-sport',
  'boat',
  'bicycle',
  'flower',
  'leaf',
  'paw',
  'fish',
  'bug',
  'planet',
  'moon',
  'sunny',
];

/**
 * Obtener todos los perfiles
 */
export const obtenerPerfiles = async (): Promise<Perfil[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    
    // Si no hay perfiles, crear uno por defecto
    const perfilDefault: Perfil = {
      id: 'default',
      nombre: 'Principal',
      avatar: 'person-circle',
      esInfantil: false,
      fechaCreacion: Date.now(),
    };
    await guardarPerfiles([perfilDefault]);
    return [perfilDefault];
  } catch (error) {
    console.error('Error al obtener perfiles:', error);
    return [];
  }
};

/**
 * Guardar lista de perfiles
 */
export const guardarPerfiles = async (perfiles: Perfil[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
  } catch (error) {
    console.error('Error al guardar perfiles:', error);
  }
};

/**
 * Crear un nuevo perfil
 */
export const crearPerfil = async (perfil: Omit<Perfil, 'id' | 'fechaCreacion'>): Promise<Perfil> => {
  try {
    const perfiles = await obtenerPerfiles();
    
    const nuevoPerfil: Perfil = {
      ...perfil,
      id: `perfil_${Date.now()}`,
      fechaCreacion: Date.now(),
    };
    
    perfiles.push(nuevoPerfil);
    await guardarPerfiles(perfiles);
    
    return nuevoPerfil;
  } catch (error) {
    console.error('Error al crear perfil:', error);
    throw error;
  }
};

/**
 * Actualizar un perfil existente
 */
export const actualizarPerfil = async (id: string, datos: Partial<Perfil>): Promise<void> => {
  try {
    const perfiles = await obtenerPerfiles();
    const index = perfiles.findIndex(p => p.id === id);
    
    if (index >= 0) {
      perfiles[index] = { ...perfiles[index], ...datos };
      await guardarPerfiles(perfiles);
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
  }
};

/**
 * Eliminar un perfil
 */
export const eliminarPerfil = async (id: string): Promise<void> => {
  try {
    const perfiles = await obtenerPerfiles();
    
    // No permitir eliminar si es el único perfil
    if (perfiles.length <= 1) {
      throw new Error('No puedes eliminar el único perfil');
    }
    
    // No permitir eliminar el perfil por defecto
    if (id === 'default') {
      throw new Error('No puedes eliminar el perfil principal');
    }
    
    const nuevosPerfiles = perfiles.filter(p => p.id !== id);
    await guardarPerfiles(nuevosPerfiles);
    
    // Si el perfil eliminado era el activo, cambiar al primero
    const perfilActivo = await obtenerPerfilActivo();
    if (perfilActivo?.id === id) {
      await establecerPerfilActivo(nuevosPerfiles[0].id);
    }
  } catch (error) {
    console.error('Error al eliminar perfil:', error);
    throw error;
  }
};

/**
 * Obtener el perfil activo
 */
export const obtenerPerfilActivo = async (): Promise<Perfil | null> => {
  try {
    const perfilId = await AsyncStorage.getItem(PERFIL_ACTIVO_KEY);
    if (!perfilId) return null;
    
    const perfiles = await obtenerPerfiles();
    return perfiles.find(p => p.id === perfilId) || null;
  } catch (error) {
    console.error('Error al obtener perfil activo:', error);
    return null;
  }
};

/**
 * Establecer el perfil activo
 */
export const establecerPerfilActivo = async (perfilId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PERFIL_ACTIVO_KEY, perfilId);
  } catch (error) {
    console.error('Error al establecer perfil activo:', error);
  }
};

/**
 * Verificar PIN de un perfil
 */
export const verificarPIN = (perfil: Perfil, pin: string): boolean => {
  if (!perfil.pin) return true;
  return perfil.pin === pin;
};

/**
 * Obtener un perfil por ID
 */
export const obtenerPerfilPorId = async (id: string): Promise<Perfil | null> => {
  try {
    const perfiles = await obtenerPerfiles();
    return perfiles.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error al obtener perfil por ID:', error);
    return null;
  }
};

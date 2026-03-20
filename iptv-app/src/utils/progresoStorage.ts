import AsyncStorage from '@react-native-async-storage/async-storage';
import supabaseServicio from '../servicios/supabaseServicio';

export interface ProgresoVideo {
  id: string;
  titulo: string;
  posicion: number;
  duracion: number;
  porcentaje: number;
  fecha: number;
  tipo: 'pelicula' | 'serie' | 'episodio';
  streamId?: number;
  serieId?: number;
  temporada?: number;
  episodio?: number;
  extension?: string; // Extensión del archivo (mp4, mkv, etc.)
  url?: string; // URL completa del video
  imagen?: string; // URL de la imagen/poster del contenido
}

const getStorageKey = (perfilId?: string) => {
  return perfilId ? `@progreso_videos_${perfilId}` : '@progreso_videos';
};

export const guardarProgreso = async (progreso: ProgresoVideo, usuarioId?: string, perfilId?: string): Promise<void> => {
  try {
    // Solo guardar si ha visto más del 5% y menos del 95%
    if (progreso.porcentaje < 5 || progreso.porcentaje > 95) {
      return;
    }

    const progresosGuardados = await obtenerTodosLosProgresos(perfilId);
    
    // Actualizar o agregar el progreso
    const index = progresosGuardados.findIndex(p => p.id === progreso.id);
    if (index >= 0) {
      progresosGuardados[index] = progreso;
    } else {
      progresosGuardados.push(progreso);
    }

    // Mantener solo los últimos 50 progresos
    const progresosOrdenados = progresosGuardados
      .sort((a, b) => b.fecha - a.fecha)
      .slice(0, 50);

    const storageKey = getStorageKey(perfilId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(progresosOrdenados));
    
    // Guardar en Supabase si hay usuarioId
    if (usuarioId) {
      await supabaseServicio.guardarProgreso({
        usuario_id: usuarioId,
        perfil_id: perfilId,
        canal_id: progreso.streamId?.toString() || progreso.id,
        capitulo_id: progreso.id,
        titulo: progreso.titulo,
        progreso: progreso.porcentaje,
        duracion: progreso.duracion,
        tiempo_actual: progreso.posicion,
        fecha_actualizacion: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error al guardar progreso:', error);
  }
};

export const obtenerProgreso = async (id: string, perfilId?: string): Promise<ProgresoVideo | null> => {
  try {
    const progresos = await obtenerTodosLosProgresos(perfilId);
    return progresos.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return null;
  }
};

export const obtenerTodosLosProgresos = async (perfilId?: string): Promise<ProgresoVideo[]> => {
  try {
    const storageKey = getStorageKey(perfilId);
    const data = await AsyncStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener progresos:', error);
    return [];
  }
};

export const eliminarProgreso = async (id: string, usuarioId?: string, perfilId?: string): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos(perfilId);
    const progreso = progresos.find(p => p.id === id);
    const nuevosProg = progresos.filter(p => p.id !== id);
    const storageKey = getStorageKey(perfilId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(nuevosProg));
    
    // Eliminar de Supabase si hay usuarioId y encontramos el progreso
    if (usuarioId && progreso) {
      await supabaseServicio.eliminarProgreso(
        usuarioId,
        progreso.streamId?.toString() || progreso.id,
        perfilId
      );
    }
  } catch (error) {
    console.error('Error al eliminar progreso:', error);
  }
};

export const limpiarProgresosAntiguos = async (diasMaximos: number = 30, perfilId?: string): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos(perfilId);
    const ahora = Date.now();
    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    
    const progresosActuales = progresos.filter(p => {
      const diasTranscurridos = (ahora - p.fecha) / milisegundosPorDia;
      return diasTranscurridos <= diasMaximos;
    });

    const storageKey = getStorageKey(perfilId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(progresosActuales));
  } catch (error) {
    console.error('Error al limpiar progresos antiguos:', error);
  }
};

/**
 * Actualiza un progreso existente con nueva información (como la imagen)
 */
export const actualizarProgreso = async (id: string, actualizacion: Partial<ProgresoVideo>, usuarioId?: string, perfilId?: string): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos(perfilId);
    const index = progresos.findIndex(p => p.id === id);
    
    if (index >= 0) {
      progresos[index] = { ...progresos[index], ...actualizacion };
      const storageKey = getStorageKey(perfilId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(progresos));
      
      // Actualizar en Supabase si hay usuarioId
      if (usuarioId) {
        const progreso = progresos[index];
        await supabaseServicio.guardarProgreso({
          usuario_id: usuarioId,
          perfil_id: perfilId,
          canal_id: progreso.streamId?.toString() || progreso.id,
          capitulo_id: progreso.id,
          titulo: progreso.titulo,
          progreso: progreso.porcentaje,
          duracion: progreso.duracion,
          tiempo_actual: progreso.posicion,
          fecha_actualizacion: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
  }
};

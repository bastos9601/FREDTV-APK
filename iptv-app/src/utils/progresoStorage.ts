import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = '@progreso_videos';

export const guardarProgreso = async (progreso: ProgresoVideo): Promise<void> => {
  try {
    // Solo guardar si ha visto más del 5% y menos del 95%
    if (progreso.porcentaje < 5 || progreso.porcentaje > 95) {
      return;
    }

    const progresosGuardados = await obtenerTodosLosProgresos();
    
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

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progresosOrdenados));
  } catch (error) {
    console.error('Error al guardar progreso:', error);
  }
};

export const obtenerProgreso = async (id: string): Promise<ProgresoVideo | null> => {
  try {
    const progresos = await obtenerTodosLosProgresos();
    return progresos.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return null;
  }
};

export const obtenerTodosLosProgresos = async (): Promise<ProgresoVideo[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener progresos:', error);
    return [];
  }
};

export const eliminarProgreso = async (id: string): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos();
    const nuevosProg = progresos.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosProg));
  } catch (error) {
    console.error('Error al eliminar progreso:', error);
  }
};

export const limpiarProgresosAntiguos = async (diasMaximos: number = 30): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos();
    const ahora = Date.now();
    const milisegundosPorDia = 24 * 60 * 60 * 1000;
    
    const progresosActuales = progresos.filter(p => {
      const diasTranscurridos = (ahora - p.fecha) / milisegundosPorDia;
      return diasTranscurridos <= diasMaximos;
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progresosActuales));
  } catch (error) {
    console.error('Error al limpiar progresos antiguos:', error);
  }
};

/**
 * Actualiza un progreso existente con nueva información (como la imagen)
 */
export const actualizarProgreso = async (id: string, actualizacion: Partial<ProgresoVideo>): Promise<void> => {
  try {
    const progresos = await obtenerTodosLosProgresos();
    const index = progresos.findIndex(p => p.id === id);
    
    if (index >= 0) {
      progresos[index] = { ...progresos[index], ...actualizacion };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progresos));
    }
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
  }
};

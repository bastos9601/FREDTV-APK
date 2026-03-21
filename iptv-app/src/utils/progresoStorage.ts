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

    const progresosGuardados = await obtenerTodosLosProgresos(perfilId, usuarioId);
    
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
      // Asegurar que la URL esté disponible
      let url = progreso.url;
      if (!url && progreso.streamId) {
        if (progreso.tipo === 'pelicula') {
          url = `http://zgazy.com:8880/movie/${progreso.streamId}.${progreso.extension || 'mp4'}`;
        } else if ((progreso.tipo === 'serie' || progreso.tipo === 'episodio') && progreso.temporada && progreso.episodio) {
          url = `http://zgazy.com:8880/series/${progreso.serieId}/${progreso.temporada}/${progreso.episodio}.${progreso.extension || 'mp4'}`;
        }
      }

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
        url: url, // Guardar URL
        tipo: progreso.tipo,
        temporada: progreso.temporada,
        episodio: progreso.episodio,
        serie_id: progreso.serieId,
        extension: progreso.extension,
        imagen: progreso.imagen,
      } as any);
    }
  } catch (error) {
    console.error('Error al guardar progreso:', error);
  }
};

export const obtenerProgreso = async (id: string, perfilId?: string): Promise<ProgresoVideo | null> => {
  try {
    const progresos = await obtenerTodosLosProgresos(perfilId);
    const progreso = progresos.find(p => p.id === id);
    
    if (progreso && !progreso.url && progreso.streamId) {
      // Reconstruir URL para películas
      if (progreso.tipo === 'pelicula') {
        progreso.url = `http://zgazy.com:8880/movie/${progreso.streamId}.${progreso.extension || 'mp4'}`;
      }
      // Reconstruir URL para series/episodios
      else if ((progreso.tipo === 'serie' || progreso.tipo === 'episodio') && progreso.temporada && progreso.episodio) {
        progreso.url = `http://zgazy.com:8880/series/${progreso.serieId}/${progreso.temporada}/${progreso.episodio}.${progreso.extension || 'mp4'}`;
      }
    }
    
    return progreso || null;
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return null;
  }
};

export const obtenerTodosLosProgresos = async (perfilId?: string, usuarioId?: string): Promise<ProgresoVideo[]> => {
  try {
    // Primero intentar obtener desde Supabase si hay usuarioId
    if (usuarioId && perfilId) {
      try {
        const progresosSupabase = await supabaseServicio.obtenerTodosProgresos(usuarioId, perfilId);
        
        if (progresosSupabase && progresosSupabase.length > 0) {
          // Convertir datos de Supabase al formato ProgresoVideo
          const progresosConvertidos = progresosSupabase.map((p: any) => ({
            id: p.capitulo_id || p.canal_id,
            titulo: p.titulo,
            posicion: p.tiempo_actual || 0,
            duracion: p.duracion || 0,
            porcentaje: p.progreso || 0,
            fecha: new Date(p.fecha_actualizacion).getTime(),
            tipo: p.tipo || 'pelicula',
            streamId: parseInt(p.canal_id),
            serieId: p.serie_id,
            temporada: p.temporada,
            episodio: p.episodio,
            extension: p.extension || 'mp4',
            url: p.url, // Supabase debería tener la URL
            imagen: p.imagen,
          }));
          
          // Guardar en AsyncStorage para caché local
          const storageKey = getStorageKey(perfilId);
          await AsyncStorage.setItem(storageKey, JSON.stringify(progresosConvertidos));
          
          return progresosConvertidos;
        }
      } catch (error) {
        console.log('No se pudo obtener de Supabase, usando AsyncStorage:', error);
      }
    }
    
    // Fallback: obtener desde AsyncStorage
    const storageKey = getStorageKey(perfilId);
    const data = await AsyncStorage.getItem(storageKey);
    const progresos = data ? JSON.parse(data) : [];
    
    // Reconstruir URLs faltantes
    return progresos.map((progreso: ProgresoVideo) => {
      if (!progreso.url && progreso.streamId) {
        // Reconstruir URL para películas
        if (progreso.tipo === 'pelicula') {
          progreso.url = `http://zgazy.com:8880/movie/${progreso.streamId}.${progreso.extension || 'mp4'}`;
        }
        // Reconstruir URL para series/episodios
        else if ((progreso.tipo === 'serie' || progreso.tipo === 'episodio') && progreso.temporada && progreso.episodio) {
          progreso.url = `http://zgazy.com:8880/series/${progreso.serieId}/${progreso.temporada}/${progreso.episodio}.${progreso.extension || 'mp4'}`;
        }
      }
      return progreso;
    });
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
    const progresos = await obtenerTodosLosProgresos(perfilId, usuarioId);
    const index = progresos.findIndex(p => p.id === id);
    
    if (index >= 0) {
      progresos[index] = { ...progresos[index], ...actualizacion };
      const storageKey = getStorageKey(perfilId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(progresos));
      
      // Actualizar en Supabase si hay usuarioId
      if (usuarioId) {
        const progreso = progresos[index];
        
        // Asegurar que la URL esté disponible
        let url = progreso.url;
        if (!url && progreso.streamId) {
          if (progreso.tipo === 'pelicula') {
            url = `http://zgazy.com:8880/movie/${progreso.streamId}.${progreso.extension || 'mp4'}`;
          } else if ((progreso.tipo === 'serie' || progreso.tipo === 'episodio') && progreso.temporada && progreso.episodio) {
            url = `http://zgazy.com:8880/series/${progreso.serieId}/${progreso.temporada}/${progreso.episodio}.${progreso.extension || 'mp4'}`;
          }
        }

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
          url: url,
          tipo: progreso.tipo,
          temporada: progreso.temporada,
          episodio: progreso.episodio,
          serie_id: progreso.serieId,
          extension: progreso.extension,
          imagen: progreso.imagen,
        } as any);
      }
    }
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
  }
};

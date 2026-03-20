import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ttevigqoymqdoogkcjjm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXZpZ3FveW1xZG9vZ2tjamptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NjE0MDYsImV4cCI6MjA4OTUzNzQwNn0.7kimTokB5pax1lcf-NLMsTpbovssznZ4heEC_REgNS0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ProgresoCap {
  id?: string;
  usuario_id: string;
  perfil_id?: string;
  canal_id: string;
  capitulo_id: string;
  titulo: string;
  progreso: number; // 0-100
  duracion: number; // segundos
  tiempo_actual: number; // segundos
  fecha_actualizacion: string;
}

interface Favorito {
  id?: string;
  usuario_id: string;
  perfil_id?: string;
  canal_id: string;
  titulo: string;
  imagen?: string;
  fecha_agregado: string;
}

interface Perfil {
  id?: string;
  usuario_id: string;
  nombre: string;
  avatar?: string;
  pin?: string;
  fecha_creacion: string;
}

interface UsuarioIPTV {
  id?: string;
  usuario_id: string;
  username: string;
  password: string;
  datos_usuario?: any;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

class SupabaseServicio {
  /**
   * Guardar credenciales del usuario IPTV
   */
  async guardarCredenciales(usuarioId: string, username: string, password: string, datosUsuario: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios_iptv')
        .upsert(
          {
            usuario_id: usuarioId,
            username,
            password,
            datos_usuario: datosUsuario,
            fecha_actualizacion: new Date().toISOString(),
          },
          { onConflict: 'usuario_id' }
        );

      if (error) {
        console.error('Error guardando credenciales:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en guardarCredenciales:', error);
      return false;
    }
  }

  /**
   * Obtener credenciales del usuario IPTV
   */
  async obtenerCredenciales(usuarioId: string): Promise<UsuarioIPTV | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios_iptv')
        .select('*')
        .eq('usuario_id', usuarioId)
        .single();

      if (error) {
        console.log('No hay credenciales guardadas');
        return null;
      }

      return data as UsuarioIPTV;
    } catch (error) {
      console.error('Error obteniendo credenciales:', error);
      return null;
    }
  }
  /**
   * Guardar progreso de un capítulo
   */
  async guardarProgreso(progreso: ProgresoCap): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('progreso_capitulos')
        .upsert(
          {
            usuario_id: progreso.usuario_id,
            perfil_id: progreso.perfil_id,
            canal_id: progreso.canal_id,
            capitulo_id: progreso.capitulo_id,
            titulo: progreso.titulo,
            progreso: Math.round(progreso.progreso),
            duracion: Math.floor(progreso.duracion),
            tiempo_actual: Math.floor(progreso.tiempo_actual),
            fecha_actualizacion: new Date().toISOString(),
          },
          { onConflict: 'usuario_id,perfil_id,canal_id,capitulo_id' }
        );

      if (error) {
        console.error('Error guardando progreso:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en guardarProgreso:', error);
      return false;
    }
  }

  /**
   * Obtener progreso de un capítulo
   */
  async obtenerProgreso(usuarioId: string, canalId: string): Promise<ProgresoCap | null> {
    try {
      const { data, error } = await supabase
        .from('progreso_capitulos')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('canal_id', canalId)
        .single();

      if (error) {
        console.log('No hay progreso guardado');
        return null;
      }

      return data as ProgresoCap;
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      return null;
    }
  }

  /**
   * Obtener todos los progresos del usuario (filtrado por perfil si se proporciona)
   */
  async obtenerTodosProgresos(usuarioId: string, perfilId?: string): Promise<ProgresoCap[]> {
    try {
      let query = supabase
        .from('progreso_capitulos')
        .select('*')
        .eq('usuario_id', usuarioId);

      if (perfilId) {
        query = query.eq('perfil_id', perfilId);
      }

      const { data, error } = await query.order('fecha_actualizacion', { ascending: false });

      if (error) {
        console.error('Error obteniendo progresos:', error);
        return [];
      }

      return data as ProgresoCap[];
    } catch (error) {
      console.error('Error en obtenerTodosProgresos:', error);
      return [];
    }
  }

  /**
   * Eliminar progreso de Supabase
   */
  async eliminarProgreso(usuarioId: string, canalId: string, perfilId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('progreso_capitulos')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('canal_id', canalId);

      if (perfilId) {
        query = query.eq('perfil_id', perfilId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error eliminando progreso:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en eliminarProgreso:', error);
      return false;
    }
  }

  /**
   * Agregar a favoritos
   */
  async agregarFavorito(favorito: Favorito): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favoritos')
        .upsert(
          {
            usuario_id: favorito.usuario_id,
            perfil_id: favorito.perfil_id,
            canal_id: favorito.canal_id,
            titulo: favorito.titulo,
            imagen: favorito.imagen,
            fecha_agregado: new Date().toISOString(),
          },
          { onConflict: 'usuario_id,perfil_id,canal_id' }
        );

      if (error) {
        console.error('Error agregando favorito:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en agregarFavorito:', error);
      return false;
    }
  }

  /**
   * Eliminar de favoritos
   */
  async eliminarFavorito(usuarioId: string, canalId: string, perfilId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('canal_id', canalId);

      if (perfilId) {
        query = query.eq('perfil_id', perfilId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error eliminando favorito:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en eliminarFavorito:', error);
      return false;
    }
  }

  /**
   * Obtener favoritos del usuario (filtrado por perfil si se proporciona)
   */
  async obtenerFavoritos(usuarioId: string, perfilId?: string): Promise<Favorito[]> {
    try {
      let query = supabase
        .from('favoritos')
        .select('*')
        .eq('usuario_id', usuarioId);

      if (perfilId) {
        query = query.eq('perfil_id', perfilId);
      }

      const { data, error } = await query.order('fecha_agregado', { ascending: false });

      if (error) {
        console.error('Error obteniendo favoritos:', error);
        return [];
      }

      return data as Favorito[];
    } catch (error) {
      console.error('Error en obtenerFavoritos:', error);
      return [];
    }
  }

  /**
   * Verificar si es favorito
   */
  async esFavorito(usuarioId: string, canalId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('canal_id', canalId)
        .single();

      if (error) {
        return false;
      }

      return !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Crear perfil
   */
  async crearPerfil(perfil: Perfil): Promise<Perfil | null> {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .insert([
          {
            usuario_id: perfil.usuario_id,
            nombre: perfil.nombre,
            avatar: perfil.avatar,
            pin: perfil.pin || null,
            fecha_creacion: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creando perfil:', error);
        return null;
      }

      return data as Perfil;
    } catch (error) {
      console.error('Error en crearPerfil:', error);
      return null;
    }
  }

  /**
   * Actualizar PIN del perfil
   */
  async actualizarPinPerfil(perfilId: string, pin: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ pin })
        .eq('id', perfilId);

      if (error) {
        console.error('Error actualizando PIN:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en actualizarPinPerfil:', error);
      return false;
    }
  }

  /**
   * Verificar PIN del perfil
   */
  async verificarPinPerfil(perfilId: string, pin: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('pin')
        .eq('id', perfilId)
        .single();

      if (error) {
        console.error('Error verificando PIN:', error);
        return false;
      }

      return data?.pin === pin;
    } catch (error) {
      console.error('Error en verificarPinPerfil:', error);
      return false;
    }
  }

  /**
   * Obtener perfiles del usuario
   */
  async obtenerPerfiles(usuarioId: string): Promise<Perfil[]> {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('fecha_creacion', { ascending: true });

      if (error) {
        console.error('Error obteniendo perfiles:', error);
        return [];
      }

      return data as Perfil[];
    } catch (error) {
      console.error('Error en obtenerPerfiles:', error);
      return [];
    }
  }

  /**
   * Actualizar nombre del perfil
   */
  async actualizarNombrePerfil(perfilId: string, nombre: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ nombre })
        .eq('id', perfilId);

      if (error) {
        console.error('Error actualizando nombre del perfil:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en actualizarNombrePerfil:', error);
      return false;
    }
  }

  /**
   * Eliminar perfil
   */
  async eliminarPerfil(perfilId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('perfiles')
        .delete()
        .eq('id', perfilId);

      if (error) {
        console.error('Error eliminando perfil:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en eliminarPerfil:', error);
      return false;
    }
  }
}

export default new SupabaseServicio();

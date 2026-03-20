import { useState, useCallback } from 'react';
import supabaseServicio from '../servicios/supabaseServicio';
import { useSupabase } from '../contexto/SupabaseContext';

export const useSupabaseData = () => {
  const { usuarioId } = useSupabase();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progreso
  const guardarProgreso = useCallback(
    async (canalId: string, capituloId: string, titulo: string, progreso: number, duracion: number, tiempoActual: number) => {
      if (!usuarioId) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setCargando(true);
        setError(null);
        const resultado = await supabaseServicio.guardarProgreso({
          usuario_id: usuarioId,
          canal_id: canalId,
          capitulo_id: capituloId,
          titulo,
          progreso,
          duracion,
          tiempo_actual: tiempoActual,
          fecha_actualizacion: new Date().toISOString(),
        });
        return resultado;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error guardando progreso';
        setError(mensaje);
        return false;
      } finally {
        setCargando(false);
      }
    },
    [usuarioId]
  );

  const obtenerProgreso = useCallback(
    async (canalId: string) => {
      if (!usuarioId) {
        setError('Usuario no autenticado');
        return null;
      }

      try {
        setCargando(true);
        setError(null);
        const progreso = await supabaseServicio.obtenerProgreso(usuarioId, canalId);
        return progreso;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error obteniendo progreso';
        setError(mensaje);
        return null;
      } finally {
        setCargando(false);
      }
    },
    [usuarioId]
  );

  const obtenerTodosProgresos = useCallback(async () => {
    if (!usuarioId) {
      setError('Usuario no autenticado');
      return [];
    }

    try {
      setCargando(true);
      setError(null);
      const progresos = await supabaseServicio.obtenerTodosProgresos(usuarioId);
      return progresos;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error obteniendo progresos';
      setError(mensaje);
      return [];
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  // Favoritos
  const agregarFavorito = useCallback(
    async (canalId: string, titulo: string, imagen?: string) => {
      if (!usuarioId) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setCargando(true);
        setError(null);
        const resultado = await supabaseServicio.agregarFavorito({
          usuario_id: usuarioId,
          canal_id: canalId,
          titulo,
          imagen,
          fecha_agregado: new Date().toISOString(),
        });
        return resultado;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error agregando favorito';
        setError(mensaje);
        return false;
      } finally {
        setCargando(false);
      }
    },
    [usuarioId]
  );

  const eliminarFavorito = useCallback(
    async (canalId: string) => {
      if (!usuarioId) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setCargando(true);
        setError(null);
        const resultado = await supabaseServicio.eliminarFavorito(usuarioId, canalId);
        return resultado;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error eliminando favorito';
        setError(mensaje);
        return false;
      } finally {
        setCargando(false);
      }
    },
    [usuarioId]
  );

  const obtenerFavoritos = useCallback(async () => {
    if (!usuarioId) {
      setError('Usuario no autenticado');
      return [];
    }

    try {
      setCargando(true);
      setError(null);
      const favoritos = await supabaseServicio.obtenerFavoritos(usuarioId);
      return favoritos;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error obteniendo favoritos';
      setError(mensaje);
      return [];
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  const esFavorito = useCallback(
    async (canalId: string) => {
      if (!usuarioId) {
        return false;
      }

      try {
        const resultado = await supabaseServicio.esFavorito(usuarioId, canalId);
        return resultado;
      } catch (err) {
        console.error('Error verificando favorito:', err);
        return false;
      }
    },
    [usuarioId]
  );

  // Perfiles
  const crearPerfil = useCallback(
    async (nombre: string, avatar?: string) => {
      if (!usuarioId) {
        setError('Usuario no autenticado');
        return null;
      }

      try {
        setCargando(true);
        setError(null);
        const perfil = await supabaseServicio.crearPerfil({
          usuario_id: usuarioId,
          nombre,
          avatar,
          fecha_creacion: new Date().toISOString(),
        });
        return perfil;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error creando perfil';
        setError(mensaje);
        return null;
      } finally {
        setCargando(false);
      }
    },
    [usuarioId]
  );

  const obtenerPerfiles = useCallback(async () => {
    if (!usuarioId) {
      setError('Usuario no autenticado');
      return [];
    }

    try {
      setCargando(true);
      setError(null);
      const perfiles = await supabaseServicio.obtenerPerfiles(usuarioId);
      return perfiles;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error obteniendo perfiles';
      setError(mensaje);
      return [];
    } finally {
      setCargando(false);
    }
  }, [usuarioId]);

  const eliminarPerfil = useCallback(
    async (perfilId: string) => {
      try {
        setCargando(true);
        setError(null);
        const resultado = await supabaseServicio.eliminarPerfil(perfilId);
        return resultado;
      } catch (err) {
        const mensaje = err instanceof Error ? err.message : 'Error eliminando perfil';
        setError(mensaje);
        return false;
      } finally {
        setCargando(false);
      }
    },
    []
  );

  return {
    usuarioId,
    cargando,
    error,
    // Progreso
    guardarProgreso,
    obtenerProgreso,
    obtenerTodosProgresos,
    // Favoritos
    agregarFavorito,
    eliminarFavorito,
    obtenerFavoritos,
    esFavorito,
    // Perfiles
    crearPerfil,
    obtenerPerfiles,
    eliminarPerfil,
  };
};

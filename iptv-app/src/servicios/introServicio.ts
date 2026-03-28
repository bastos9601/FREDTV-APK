import { supabase } from './supabaseServicio';

export interface IntroData {
  id?: string;
  usuario_id: string;
  serie_id: number;
  episodio: number;
  temporada: number;
  inicio: number; // segundos
  fin: number; // segundos
  detectado_automaticamente: boolean;
  fecha_creacion: string;
}

class IntroServicio {
  /**
   * Guardar intro manualmente
   */
  async guardarIntro(
    usuarioId: string,
    serieId: number,
    temporada: number,
    episodio: number,
    inicio: number,
    fin: number,
    automatico: boolean = false
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intros')
        .upsert(
          {
            usuario_id: usuarioId,
            serie_id: serieId,
            temporada,
            episodio,
            inicio: Math.round(inicio),
            fin: Math.round(fin),
            detectado_automaticamente: automatico,
            fecha_creacion: new Date().toISOString(),
          },
          { onConflict: 'usuario_id,serie_id,temporada,episodio' }
        );

      if (error) {
        console.error('Error guardando intro:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en guardarIntro:', error);
      return false;
    }
  }

  /**
   * Obtener intro de un episodio
   */
  async obtenerIntro(
    usuarioId: string,
    serieId: number,
    temporada: number,
    episodio: number
  ): Promise<IntroData | null> {
    try {
      const { data, error } = await supabase
        .from('intros')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('serie_id', serieId)
        .eq('temporada', temporada)
        .eq('episodio', episodio)
        .single();

      if (error) {
        console.log('No hay intro guardado para este episodio');
        return null;
      }

      return data as IntroData;
    } catch (error) {
      console.error('Error obteniendo intro:', error);
      return null;
    }
  }

  /**
   * Obtener todos los intros de una serie
   */
  async obtenerIntrosSerie(usuarioId: string, serieId: number): Promise<IntroData[]> {
    try {
      const { data, error } = await supabase
        .from('intros')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('serie_id', serieId)
        .order('temporada,episodio', { ascending: true });

      if (error) {
        console.error('Error obteniendo intros:', error);
        return [];
      }

      return data as IntroData[];
    } catch (error) {
      console.error('Error en obtenerIntrosSerie:', error);
      return [];
    }
  }

  /**
   * Eliminar intro
   */
  async eliminarIntro(
    usuarioId: string,
    serieId: number,
    temporada: number,
    episodio: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intros')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('serie_id', serieId)
        .eq('temporada', temporada)
        .eq('episodio', episodio);

      if (error) {
        console.error('Error eliminando intro:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en eliminarIntro:', error);
      return false;
    }
  }

  /**
   * Detectar intro automáticamente analizando audio
   * (Versión simplificada - detecta silencio)
   */
  async detectarIntroAutomatico(
    videoElement: HTMLVideoElement,
    duracionMaxima: number = 120 // máximo 2 minutos de intro
  ): Promise<{ inicio: number; fin: number } | null> {
    try {
      // Crear contexto de audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      // Conectar video a analyser
      const source = audioContext.createMediaElementAudioSource(videoElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let introInicio = 0;
      let introFin = 0;
      let silencioDetectado = false;

      // Analizar primeros 2 minutos
      return new Promise((resolve) => {
        const intervalo = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);

          // Calcular promedio de frecuencias
          const promedio = dataArray.reduce((a, b) => a + b) / dataArray.length;

          // Si el promedio es bajo, es silencio
          if (promedio < 30 && !silencioDetectado) {
            silencioDetectado = true;
            introInicio = videoElement.currentTime;
          }

          // Si el promedio es alto después del silencio, fin del intro
          if (promedio > 50 && silencioDetectado) {
            introFin = videoElement.currentTime;
            clearInterval(intervalo);
            resolve({ inicio: introInicio, fin: introFin });
          }

          // Si pasó el tiempo máximo, detener
          if (videoElement.currentTime > duracionMaxima) {
            clearInterval(intervalo);
            resolve(null);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error detectando intro:', error);
      return null;
    }
  }

  /**
   * Detectar intro por frames repetidos (más preciso)
   */
  async detectarIntroPorFrames(
    videoElement: HTMLVideoElement,
    duracionMaxima: number = 120
  ): Promise<{ inicio: number; fin: number } | null> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = 160;
      canvas.height = 90;

      let frameAnterior: ImageData | null = null;
      let framesIguales = 0;
      let introInicio = 0;
      let introFin = 0;
      let introDetectado = false;

      return new Promise((resolve) => {
        const intervalo = setInterval(() => {
          // Dibujar frame actual
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const frameActual = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Comparar con frame anterior
          if (frameAnterior) {
            const diferencia = this.calcularDiferenciaFrames(frameAnterior, frameActual);

            // Si frames son muy similares (intro estática)
            if (diferencia < 5) {
              framesIguales++;

              if (framesIguales > 5 && !introDetectado) {
                introInicio = videoElement.currentTime;
                introDetectado = true;
              }
            } else {
              // Si hay cambio significativo después del intro
              if (introDetectado && framesIguales > 5) {
                introFin = videoElement.currentTime;
                clearInterval(intervalo);
                resolve({ inicio: introInicio, fin: introFin });
              }
              framesIguales = 0;
            }
          }

          frameAnterior = frameActual;

          // Si pasó el tiempo máximo
          if (videoElement.currentTime > duracionMaxima) {
            clearInterval(intervalo);
            resolve(null);
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Error detectando intro por frames:', error);
      return null;
    }
  }

  /**
   * Calcular diferencia entre dos frames
   */
  private calcularDiferenciaFrames(frame1: ImageData, frame2: ImageData): number {
    let diferencia = 0;
    const data1 = frame1.data;
    const data2 = frame2.data;

    for (let i = 0; i < data1.length; i += 4) {
      const r1 = data1[i];
      const g1 = data1[i + 1];
      const b1 = data1[i + 2];

      const r2 = data2[i];
      const g2 = data2[i + 1];
      const b2 = data2[i + 2];

      diferencia += Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }

    return diferencia / (data1.length * 3);
  }
}

export default new IntroServicio();

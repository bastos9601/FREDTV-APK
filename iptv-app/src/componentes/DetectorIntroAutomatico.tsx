import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import introServicio from '../servicios/introServicio';

interface DetectorIntroAutomaticoProps {
  videoElement: HTMLVideoElement | null;
  usuarioId: string;
  serieId: number;
  temporada: number;
  episodio: number;
  onDetectado?: (inicio: number, fin: number) => void;
}

export const DetectorIntroAutomatico: React.FC<DetectorIntroAutomaticoProps> = ({
  videoElement,
  usuarioId,
  serieId,
  temporada,
  episodio,
  onDetectado,
}) => {
  const [detectando, setDetectando] = useState(false);
  const [introDetectado, setIntroDetectado] = useState<{ inicio: number; fin: number } | null>(null);

  const detectarIntro = async (metodo: 'audio' | 'frames' = 'frames') => {
    if (!videoElement) return;

    setDetectando(true);
    try {
      let resultado;

      if (metodo === 'audio') {
        resultado = await introServicio.detectarIntroAutomatico(videoElement);
      } else {
        resultado = await introServicio.detectarIntroPorFrames(videoElement);
      }

      if (resultado) {
        setIntroDetectado(resultado);

        // Guardar en Supabase
        await introServicio.guardarIntro(
          usuarioId,
          serieId,
          temporada,
          episodio,
          resultado.inicio,
          resultado.fin,
          true // detectado automáticamente
        );

        onDetectado?.(resultado.inicio, resultado.fin);
      }
    } catch (error) {
      console.error('Error detectando intro:', error);
    } finally {
      setDetectando(false);
    }
  };

  return (
    <View style={styles.container}>
      {detectando && (
        <View style={styles.cargando}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.textoDetectando}>Detectando intro...</Text>
        </View>
      )}

      {!detectando && !introDetectado && (
        <View style={styles.botones}>
          <TouchableOpacity
            style={styles.boton}
            onPress={() => detectarIntro('frames')}
          >
            <Text style={styles.textoBoton}>Detectar por frames</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonAudio]}
            onPress={() => detectarIntro('audio')}
          >
            <Text style={styles.textoBoton}>Detectar por audio</Text>
          </TouchableOpacity>
        </View>
      )}

      {introDetectado && (
        <View style={styles.resultado}>
          <Text style={styles.textoResultado}>
            Intro detectado: {Math.round(introDetectado.inicio)}s - {Math.round(introDetectado.fin)}s
          </Text>
          <TouchableOpacity
            style={styles.botonLimpiar}
            onPress={() => setIntroDetectado(null)}
          >
            <Text style={styles.textoBoton}>Detectar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    marginVertical: 8,
  },
  cargando: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  textoDetectando: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  botones: {
    flexDirection: 'row',
    gap: 8,
  },
  boton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  botonAudio: {
    backgroundColor: '#34C759',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultado: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  textoResultado: {
    color: '#34C759',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  botonLimpiar: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

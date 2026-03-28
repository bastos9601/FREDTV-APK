import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { Video } from 'expo-av';
import introServicio, { IntroData } from '../servicios/introServicio';

interface ReproductorConIntroProps {
  url: string;
  usuarioId: string;
  serieId: number;
  temporada: number;
  episodio: number;
  onProgress?: (progreso: number) => void;
  onFinish?: () => void;
}

export const ReproductorConIntro: React.FC<ReproductorConIntroProps> = ({
  url,
  usuarioId,
  serieId,
  temporada,
  episodio,
  onProgress,
  onFinish,
}) => {
  const videoRef = useRef<Video>(null);
  const [intro, setIntro] = useState<IntroData | null>(null);
  const [mostrarBotonSaltar, setMostrarBotonSaltar] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Cargar intro al montar
  useEffect(() => {
    cargarIntro();
  }, [usuarioId, serieId, temporada, episodio]);

  const cargarIntro = async () => {
    const introData = await introServicio.obtenerIntro(
      usuarioId,
      serieId,
      temporada,
      episodio
    );
    setIntro(introData);
  };

  // Monitorear progreso del video
  const handleProgress = (status: any) => {
    const tiempoActualVideo = status.positionMillis / 1000;
    setTiempoActual(tiempoActualVideo);

    // Mostrar botón de saltar intro
    if (intro && tiempoActualVideo >= intro.inicio && tiempoActualVideo < intro.fin) {
      if (!mostrarBotonSaltar) {
        setMostrarBotonSaltar(true);
        animarBoton();
      }
    } else {
      if (mostrarBotonSaltar) {
        setMostrarBotonSaltar(false);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }

    onProgress?.(tiempoActualVideo);
  };

  // Animar botón (fade in)
  const animarBoton = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Saltar intro
  const saltarIntro = async () => {
    if (intro && videoRef.current) {
      await videoRef.current.setPositionAsync(intro.fin * 1000);
      setMostrarBotonSaltar(false);
    }
  };

  // Guardar intro manualmente
  const guardarIntroManual = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      const tiempoActual = status.positionMillis / 1000;

      // Asumir que el intro termina en 90 segundos (ajustable)
      const introFin = tiempoActual + 90;

      await introServicio.guardarIntro(
        usuarioId,
        serieId,
        temporada,
        episodio,
        tiempoActual,
        introFin,
        false
      );

      await cargarIntro();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
        onPlaybackStatusUpdate={handleProgress}
        onPlaybackStatusUpdate={handleProgress}
      />

      {/* Botón para saltar intro */}
      {mostrarBotonSaltar && (
        <Animated.View
          style={[
            styles.botonSaltarContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.botonSaltar} onPress={saltarIntro}>
            <Text style={styles.textoBoton}>Saltar intro</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Botón para guardar intro (solo en desarrollo) */}
      {__DEV__ && (
        <TouchableOpacity style={styles.botonGuardar} onPress={guardarIntroManual}>
          <Text style={styles.textoBoton}>Guardar intro aquí</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  botonSaltarContainer: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  botonSaltar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  botonGuardar: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: 'rgba(255, 100, 100, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  textoBoton: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

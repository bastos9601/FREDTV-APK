import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';

interface SplashPantallaProps {
  onFinish: () => void;
}

export const SplashPantalla: React.FC<SplashPantallaProps> = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const rotateAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);
  const glowAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua para el logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animación de pulso para el efecto de glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de brillo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Terminar después de 8 segundos
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo con efecto de video en movimiento */}
        <View style={styles.logoContainer}>
          {/* Glow externo animado */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          
          {/* Logo principal */}
          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Image 
              source={require('../../assets/icon.png')}
              style={styles.logoImagen}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>FRED TV</Text>
        <Text style={styles.subtitulo}>Tu entretenimiento sin límites</Text>

        {/* Loader */}
        <View style={styles.loaderContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Zona593</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </Animated.View>

      {/* Efectos de fondo */}
      <View style={styles.backgroundEffect1} />
      <View style={styles.backgroundEffect2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoImagen: {
    width: 200,
    height: 200,
  },
  rotatingRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.4,
  },
  titulo: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 4,
    textShadowColor: 'rgba(229, 9, 20, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitulo: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 60,
    fontStyle: 'italic',
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.6,
  },
  backgroundEffect1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
    top: -100,
    left: -100,
  },
  backgroundEffect2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    opacity: 0.03,
    bottom: -150,
    right: -150,
  },
});

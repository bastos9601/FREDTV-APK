import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';

interface SplashPantallaProps {
  onFinish: () => void;
}

export const SplashPantalla: React.FC<SplashPantallaProps> = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const rotateAnim = new Animated.Value(0);

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

    // Animación de rotación continua para el loader
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Terminar después de 3 segundos
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="tv" size={80} color={COLORS.primary} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>FRED TV</Text>
        <Text style={styles.subtitulo}>Tu entretenimiento sin límites</Text>

        {/* Loader */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={[
              styles.loader,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Ionicons name="sync" size={40} color={COLORS.primary} />
          </Animated.View>
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
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
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
  loader: {
    marginBottom: 15,
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

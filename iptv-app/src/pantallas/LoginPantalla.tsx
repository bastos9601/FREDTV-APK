import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Input } from '../componentes/Input';
import { Boton } from '../componentes/Boton';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';
import { Ionicons } from '@expo/vector-icons';

export const LoginPantalla = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();

  const manejarLogin = async () => {
    if (!usuario || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    setCargando(true);
    try {
      await iniciarSesion(usuario, contrasena);
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200' }}
      style={styles.contenedor}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contenido}>
              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Ionicons name="tv" size={60} color={COLORS.primary} />
                </View>
                <Text style={styles.titulo}>FRED TV</Text>
                <Text style={styles.subtitulo}>Tu entretenimiento sin límites</Text>
              </View>
              
              {/* Formulario */}
              <View style={styles.formulario}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Iniciar Sesión</Text>
                  
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                    </View>
                    <Input
                      placeholder="Usuario"
                      value={usuario}
                      onChangeText={setUsuario}
                      autoCapitalize="none"
                    />
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                    </View>
                    <Input
                      placeholder="Contraseña"
                      value={contrasena}
                      onChangeText={setContrasena}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </View>
                  
                  <View style={styles.botonContainer}>
                    <Boton
                      titulo="Iniciar Sesión"
                      onPress={manejarLogin}
                      cargando={cargando}
                    />
                  </View>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>FRED TV</Text>
                <Text style={styles.footerSubtext}>Versión 2.0.0</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  titulo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 2,
    textShadowColor: 'rgba(229, 9, 20, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  formulario: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.3)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  botonContainer: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
});

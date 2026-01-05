import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';

const { width, height } = Dimensions.get('window');

interface ModalDescargaAPKProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalDescargaAPK: React.FC<ModalDescargaAPKProps> = ({ visible, onClose }) => {
  const [versionDisponible, setVersionDisponible] = React.useState('2.0.4');
  const [urlDescarga, setUrlDescarga] = React.useState('https://github.com/bastos9601/FREDTV-APK/releases/download/v2.0.4/app.apk');

  React.useEffect(() => {
    if (visible) {
      cargarInfoActualizacion();
    }
  }, [visible]);

  const cargarInfoActualizacion = async () => {
    try {
      const actualizacionServicio = (await import('../servicios/actualizacionServicio')).default;
      const info = await actualizacionServicio.verificarActualizacion();
      setVersionDisponible(info.versionDisponible);
      setUrlDescarga(info.urlDescarga);
    } catch (error) {
      console.error('Error cargando info de actualización:', error);
    }
  };

  const descargarAPK = () => {
    Linking.canOpenURL(urlDescarga)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(urlDescarga);
        } else {
          console.error('No se puede abrir el enlace');
        }
      })
      .catch((err) => console.error('Error al abrir enlace:', err));
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Botón de cerrar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={32} color="#FFF" />
          </TouchableOpacity>

          {/* Contenido del modal */}
          <View style={styles.content}>
            {/* Imagen/Icono principal */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="tv" size={40} color="#FFF" />
              </View>
              <Text style={styles.logoText}>FRED TV</Text>
            </View>

            {/* Título principal */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Descarga la</Text>
              <Text style={styles.highlightText}>ÚLTIMA VERSIÓN</Text>
            </View>

            {/* Características compactas */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <Ionicons name="tv" size={18} color="#4CAF50" />
                <Text style={styles.featureText}>+1000 Canales</Text>
              </View>
              <View style={styles.featureRow}>
                <Ionicons name="film" size={18} color="#4CAF50" />
                <Text style={styles.featureText}>+10000 Películas</Text>
              </View>
            </View>

            {/* Botón de descarga */}
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={descargarAPK}
              activeOpacity={0.8}
            >
              <Ionicons name="download" size={22} color="#FFF" />
              <Text style={styles.downloadText}>INSTALAR AHORA</Text>
            </TouchableOpacity>

            {/* Versión */}
            <Text style={styles.versionText}>v{versionDisponible} - Gratis</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.75,
    maxWidth: 320,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  featuresContainer: {
    marginBottom: 18,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#FFF',
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    width: '100%',
  },
  downloadText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  versionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';

const { width, height } = Dimensions.get('window');

interface ModalAnuncioProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalAnuncio: React.FC<ModalAnuncioProps> = ({ visible, onClose }) => {
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (visible) {
      setCountdown(8);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  // Efecto separado para cerrar el modal
  useEffect(() => {
    if (countdown === 0 && visible) {
      onClose();
    }
  }, [countdown, visible, onClose]);

  const abrirWhatsApp = () => {
    const numero = '51936185088';
    const mensaje = encodeURIComponent('Hola! Me interesa FRED TV 📺');
    const url = `whatsapp://send?phone=${numero}&text=${mensaje}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const webUrl = `https://wa.me/${numero}?text=${mensaje}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => console.error('Error al abrir WhatsApp:', err));
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Fondo con gradiente simulado */}
        <View style={styles.gradientBackground}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Botón de cerrar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>{countdown}s skip</Text>
            </TouchableOpacity>

            {/* Decoraciones navideñas */}
            <View style={styles.decorations}>
              <Text style={styles.decoration}>🎄</Text>
              <Text style={styles.decoration}>🎁</Text>
              <Text style={styles.decoration}>⭐</Text>
            </View>

            {/* Logo y título principal */}
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="tv" size={50} color="#FFF" />
              </View>
              <Text style={styles.brandName}>FRED TV</Text>
            </View>

            {/* Título festivo */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>CELEBRA ESTAS FIESTAS</Text>
              <Text style={styles.mainTitleBig}>CON FRED TV</Text>
            </View>

            {/* Banner verde */}
            <View style={styles.bannerContainer}>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>TELEVISIÓN Y CONTENIDO NAVIDEÑO</Text>
                <Text style={styles.bannerSubtext}>PARA TODA LA FAMILIA</Text>
              </View>
            </View>

            {/* Características en grid */}
            <View style={styles.featuresGrid}>
              {/* Fila 1 */}
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="tv" size={32} color="#FFF" />
                  </View>
                  <Text style={styles.featureNumber}>+1000</Text>
                  <Text style={styles.featureLabel}>CANALES</Text>
                  <Text style={styles.featureSubLabel}>EN VIVO Y HD</Text>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="film" size={32} color="#FFF" />
                  </View>
                  <Text style={styles.featureNumber}>+10000</Text>
                  <Text style={styles.featureLabel}>SERIES</Text>
                  <Text style={styles.featureSubLabel}>Y PELÍCULAS</Text>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIconBox}>
                    <Ionicons name="football" size={32} color="#FFF" />
                  </View>
                  <Text style={styles.featureLabel}>DEPORTES</Text>
                </View>
              </View>

              {/* Fila 2 */}
              <View style={styles.featureRow}>
                <View style={styles.featureItemSmall}>
                  <Ionicons name="happy" size={28} color="#FFF" />
                  <Text style={styles.featureLabelSmall}>INFANTIL</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.featureItemSmall}>
                  <Ionicons name="game-controller" size={28} color="#FFF" />
                  <Text style={styles.featureLabelSmall}>ANIME</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.featureItemSmall}>
                  <Ionicons name="musical-notes" size={28} color="#FFF" />
                  <Text style={styles.featureLabelSmall}>MÚSICA</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.featureItemSmall}>
                  <Ionicons name="flame" size={28} color="#FFF" />
                  <Text style={styles.featureLabelSmall}>HOT</Text>
                </View>
              </View>
            </View>

            {/* Botón de WhatsApp - MOVIDO ARRIBA */}
            <TouchableOpacity 
              style={styles.whatsappButton} 
              onPress={abrirWhatsApp}
              activeOpacity={0.9}
            >
              <View style={styles.whatsappContent}>
                <Ionicons name="logo-whatsapp" size={36} color="#FFF" />
                <View style={styles.whatsappTextContainer}>
                  <Text style={styles.whatsappTitle}>Contáctanos por WhatsApp</Text>
                  <Text style={styles.whatsappNumber}>+51 936 185 088</Text>
                </View>
                <Ionicons name="chevron-forward" size={28} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Preview de la app (simulado) */}
            <View style={styles.appPreview}>
              <View style={styles.tvFrame}>
                <View style={styles.tvScreen}>
                  <Ionicons name="play-circle" size={60} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.tvText}>FRED TV</Text>
                </View>
              </View>
            </View>

            {/* Footer festivo */}
            <View style={styles.footer}>
              <Text style={styles.footerTitle}>Feliz Navidad y Próspero</Text>
              <View style={styles.footerYearContainer}>
                <Text style={styles.footerStar}>⭐</Text>
                <Text style={styles.footerYear}>Año Nuevo 2026</Text>
              </View>
              <Text style={styles.versionText}>v.0.2.1</Text>
            </View>

            {/* Decoraciones inferiores */}
            <View style={styles.bottomDecorations}>
              <Text style={styles.decoration}>🎅</Text>
              <Text style={styles.decoration}>🎄</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c62828', // Rojo oscuro base
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#d32f2f', // Rojo más claro
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  decorations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginTop: 50,
    marginBottom: 10,
  },
  decoration: {
    fontSize: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 3,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
  mainTitleBig: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 5,
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: '#2e7d32',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 3,
    borderTopColor: '#FFD700',
    borderBottomColor: '#c62828',
    borderLeftColor: '#2e7d32',
    borderRightColor: '#2e7d32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bannerSubtext: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 3,
  },
  featuresGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    width: 100,
  },
  featureIconBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  featureSubLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  featureItemSmall: {
    alignItems: 'center',
    flex: 1,
  },
  featureLabelSmall: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 5,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  appPreview: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  tvFrame: {
    width: width * 0.85,
    height: 180,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 10,
    borderWidth: 8,
    borderColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  tvScreen: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tvText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  whatsappButton: {
    marginHorizontal: 20,
    backgroundColor: '#25D366',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    marginBottom: 20,
    marginTop: 5,
  },
  whatsappContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whatsappTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  whatsappTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  whatsappNumber: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 18,
    color: '#90caf9',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footerYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerStar: {
    fontSize: 24,
    marginRight: 8,
  },
  footerYear: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  versionText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  bottomDecorations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    marginTop: 10,
  },
});

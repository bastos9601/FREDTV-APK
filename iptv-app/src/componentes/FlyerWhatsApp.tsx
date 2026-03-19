import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FlyerWhatsAppProps {
  numeroWhatsApp?: string;
  onClose?: () => void;
}

export const FlyerWhatsApp: React.FC<FlyerWhatsAppProps> = ({
  numeroWhatsApp = '+51936185088',
  onClose,
}) => {
  const abrirWhatsApp = () => {
    const mensaje = encodeURIComponent('Hola, me interesa FRED TV');
    const url = `https://wa.me/${numeroWhatsApp.replace(/\D/g, '')}?text=${mensaje}`;
    Linking.openURL(url).catch(() => {
      console.log('No se pudo abrir WhatsApp');
    });
  };

  return (
    <View style={styles.container}>
      {/* Fondo degradado rojo */}
      <View style={styles.card}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="television" size={40} color="#fff" />
          </View>
          <Text style={styles.titulo}>FRED TV</Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          <Text style={styles.subtitulo}>Entretenimiento sin límites</Text>
          
          <View style={styles.beneficios}>
            <View style={styles.beneficio}>
              <MaterialCommunityIcons name="play-circle" size={24} color="#FFD700" />
              <Text style={styles.beneficioTexto}>+1000 Canales</Text>
            </View>
            <View style={styles.beneficio}>
              <MaterialCommunityIcons name="movie" size={24} color="#FFD700" />
              <Text style={styles.beneficioTexto}>+10000 Series</Text>
            </View>
            <View style={styles.beneficio}>
              <MaterialCommunityIcons name="soccer" size={24} color="#FFD700" />
              <Text style={styles.beneficioTexto}>Deportes</Text>
            </View>
          </View>

          <View style={styles.descripcion}>
            <Text style={styles.descripcionTexto}>
              Televisión y contenido de calidad para toda la familia
            </Text>
          </View>
        </View>

        {/* Botón WhatsApp */}
        <TouchableOpacity 
          style={styles.botonWhatsApp}
          onPress={abrirWhatsApp}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="whatsapp" size={24} color="#fff" />
          <View style={styles.botonTexto}>
            <Text style={styles.botonTitulo}>Contactanos por WhatsApp</Text>
            <Text style={styles.botonNumero}>{numeroWhatsApp}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Botón cerrar */}
        {onClose && (
          <TouchableOpacity 
            style={styles.botonCerrar}
            onPress={onClose}
          >
            <MaterialCommunityIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#DC143C',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  content: {
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  beneficios: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  beneficio: {
    alignItems: 'center',
  },
  beneficioTexto: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  descripcion: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  descripcionTexto: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  botonWhatsApp: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  botonTexto: {
    flex: 1,
    marginLeft: 12,
  },
  botonTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  botonNumero: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  botonCerrar: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

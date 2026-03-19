import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { FlyerWhatsApp } from './FlyerWhatsApp';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModalFlyerInicioProps {
  numeroWhatsApp?: string;
}

export const ModalFlyerInicio: React.FC<ModalFlyerInicioProps> = ({
  numeroWhatsApp = '+51936185088',
}) => {
  const [mostrarFlyer, setMostrarFlyer] = useState(false);

  useEffect(() => {
    verificarMostrarFlyer();
  }, []);

  const verificarMostrarFlyer = async () => {
    try {
      // Verificar si ya se mostró hoy
      const ultimaVez = await AsyncStorage.getItem('ultimaVezFlyerWhatsApp');
      const hoy = new Date().toDateString();

      if (ultimaVez !== hoy) {
        // Esperar 1 segundo antes de mostrar
        setTimeout(() => {
          setMostrarFlyer(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error verificando flyer:', error);
    }
  };

  const cerrarFlyer = async () => {
    setMostrarFlyer(false);
    // Guardar que se mostró hoy
    const hoy = new Date().toDateString();
    await AsyncStorage.setItem('ultimaVezFlyerWhatsApp', hoy);
  };

  return (
    <Modal
      visible={mostrarFlyer}
      transparent={true}
      animationType="fade"
      onRequestClose={cerrarFlyer}
    >
      <View style={styles.container}>
        <FlyerWhatsApp 
          numeroWhatsApp={numeroWhatsApp}
          onClose={cerrarFlyer}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';

const { width } = Dimensions.get('window');

interface ModalPINProps {
  visible: boolean;
  perfilNombre: string;
  onConfirm: (pin: string) => void;
  onCancel: () => void;
  modo?: 'verificar' | 'crear'; // verificar = ingresar PIN existente, crear = crear nuevo PIN
}

export const ModalPIN: React.FC<ModalPINProps> = ({
  visible,
  perfilNombre,
  onConfirm,
  onCancel,
  modo = 'verificar',
}) => {
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [mostrarPin, setMostrarPin] = useState(false);

  const handleNumero = (numero: string) => {
    if (modo === 'crear' && pin.length < 4 && pinConfirm.length === 0) {
      setPin(pin + numero);
    } else if (modo === 'crear' && pinConfirm.length < 4 && pin.length === 4) {
      setPinConfirm(pinConfirm + numero);
    } else if (modo === 'verificar' && pin.length < 4) {
      setPin(pin + numero);
    }
  };

  const handleBorrar = () => {
    if (modo === 'crear' && pinConfirm.length > 0) {
      setPinConfirm(pinConfirm.slice(0, -1));
    } else if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleConfirmar = () => {
    if (modo === 'verificar') {
      if (pin.length !== 4) {
        Alert.alert('Error', 'El PIN debe tener 4 dígitos');
        return;
      }
      onConfirm(pin);
      setPin('');
    } else {
      if (pin.length !== 4) {
        Alert.alert('Error', 'El PIN debe tener 4 dígitos');
        return;
      }
      if (pinConfirm.length !== 4) {
        Alert.alert('Error', 'Confirma el PIN');
        return;
      }
      if (pin !== pinConfirm) {
        Alert.alert('Error', 'Los PINs no coinciden');
        setPin('');
        setPinConfirm('');
        return;
      }
      onConfirm(pin);
      setPin('');
      setPinConfirm('');
    }
  };

  const handleCancelar = () => {
    setPin('');
    setPinConfirm('');
    onCancel();
  };

  const isConfirmDisabled = () => {
    if (modo === 'verificar') {
      return pin.length !== 4;
    } else {
      return pin.length !== 4 || pinConfirm.length !== 4;
    }
  };

  const renderPinDots = (pinValue: string) => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < pinValue.length && styles.dotFilled,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancelar}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancelar}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.titulo}>
              {modo === 'verificar' ? 'Ingresa tu PIN' : 'Crea un PIN'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Nombre del perfil */}
          <Text style={styles.perfilNombre}>{perfilNombre}</Text>

          {/* PIN Input */}
          <View style={styles.pinContainer}>
            {modo === 'crear' && pin.length === 4 && pinConfirm.length === 0 ? (
              <>
                <Text style={styles.labelPin}>Confirma tu PIN</Text>
                {renderPinDots(pinConfirm)}
              </>
            ) : (
              <>
                <Text style={styles.labelPin}>
                  {modo === 'verificar' ? 'PIN' : 'Nuevo PIN'}
                </Text>
                {renderPinDots(pin)}
              </>
            )}
          </View>

          {/* Teclado numérico */}
          <View style={styles.teclado}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((numero) => (
              <TouchableOpacity
                key={numero}
                style={styles.botonNumero}
                onPress={() => handleNumero(numero.toString())}
              >
                <Text style={styles.textoNumero}>{numero}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.botonNumero}
              onPress={() => handleNumero('0')}
            >
              <Text style={styles.textoNumero}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonBorrar}
              onPress={handleBorrar}
            >
              <Ionicons name="backspace" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Botón Confirmar */}
          <TouchableOpacity
            style={[
              styles.botonConfirmar,
              isConfirmDisabled() && styles.botonConfirmarDisabled,
            ]}
            onPress={handleConfirmar}
            disabled={isConfirmDisabled()}
          >
            <Text style={styles.textoConfirmar}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  perfilNombre: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  labelPin: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
  },
  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  botonNumero: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textoNumero: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  botonBorrar: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  botonConfirmar: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonConfirmarDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  textoConfirmar: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

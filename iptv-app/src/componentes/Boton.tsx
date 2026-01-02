import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constantes';

interface BotonProps {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  disabled?: boolean;
}

export const Boton: React.FC<BotonProps> = ({ titulo, onPress, cargando, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.boton, disabled && styles.botonDeshabilitado]}
      onPress={onPress}
      disabled={disabled || cargando}
    >
      {cargando ? (
        <ActivityIndicator color={COLORS.text} />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  texto: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

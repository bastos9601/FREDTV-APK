import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { COLORS } from '../utils/constantes';

interface TarjetaCanalProps {
  nombre: string;
  logo?: string;
  onPress: () => void;
}

export const TarjetaCanal: React.FC<TarjetaCanalProps> = ({ nombre, logo, onPress }) => {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress} activeOpacity={0.7}>
      {logo && logo.length > 0 ? (
        <Image 
          source={{ uri: logo }} 
          style={styles.logo} 
          resizeMode="contain"
        />
      ) : (
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoTexto}>{nombre.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.nombre} numberOfLines={2} ellipsizeMode="tail">
        {nombre}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: 150,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: 'bold',
  },
  nombre: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

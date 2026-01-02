import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';
import { Boton } from '../componentes/Boton';

export const InicioPantalla = () => {
  const { usuario, cerrarSesion } = useAuth();

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: cerrarSesion, style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Bienvenido</Text>
        <Text style={styles.usuario}>{usuario?.username}</Text>
        
        <View style={styles.info}>
          <Text style={styles.infoTexto}>Estado: {usuario?.status}</Text>
          <Text style={styles.infoTexto}>
            Fecha de expiración: {usuario?.exp_date ? new Date(parseInt(usuario.exp_date) * 1000).toLocaleDateString() : 'N/A'}
          </Text>
          <Text style={styles.infoTexto}>
            Conexiones activas: {usuario?.active_cons}
          </Text>
          <Text style={styles.infoTexto}>
            Máximo de conexiones: {usuario?.max_connections}
          </Text>
        </View>

        <View style={styles.instrucciones}>
          <Text style={styles.instruccionesTexto}>
            Usa las pestañas de abajo para navegar entre:
          </Text>
          <Text style={styles.instruccionesItem}>• TV en Vivo</Text>
          <Text style={styles.instruccionesItem}>• Películas</Text>
          <Text style={styles.instruccionesItem}>• Series</Text>
        </View>

        <Boton titulo="Cerrar Sesión" onPress={manejarCerrarSesion} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contenido: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  usuario: {
    fontSize: 24,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  info: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoTexto: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 10,
  },
  instrucciones: {
    marginBottom: 30,
  },
  instruccionesTexto: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 10,
  },
  instruccionesItem: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
});

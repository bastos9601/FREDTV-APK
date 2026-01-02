import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TarjetaCanal } from '../componentes/TarjetaCanal';
import iptvServicio, { LiveStream } from '../servicios/iptvServicio';
import { COLORS } from '../utils/constantes';
import { useNavigation } from '@react-navigation/native';

export const TvEnVivoPantalla = () => {
  const [canales, setCanales] = useState<LiveStream[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    cargarCanales();
  }, []);

  const cargarCanales = async () => {
    try {
      const data = await iptvServicio.getLiveStreams();
      setCanales(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los canales');
    } finally {
      setCargando(false);
    }
  };

  const reproducirCanal = (canal: LiveStream) => {
    const url = iptvServicio.getLiveStreamUrl(canal.stream_id, 'm3u8');
    navigation.navigate('Reproductor', {
      url,
      titulo: canal.name,
    });
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={canales}
        keyExtractor={(item) => item.stream_id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TarjetaCanal
            nombre={item.name}
            logo={item.stream_icon}
            onPress={() => reproducirCanal(item)}
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  lista: {
    padding: 10,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { COLORS } from '../utils/constantes';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const ReproductorPantalla = () => {
  const route = useRoute<any>();
  const { url, titulo } = route.params;
  
  const player = useVideoPlayer(url, player => {
    player.play();
  });

  return (
    <View style={styles.contenedor}>
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
          nativeControls={true}
        />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoContainer: {
    width: width,
    height: height * 0.3,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 20,
  },
  titulo: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

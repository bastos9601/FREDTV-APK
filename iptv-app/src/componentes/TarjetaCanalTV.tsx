import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { LiveStream } from '../servicios/iptvServicio';

interface TarjetaCanalTVProps {
  canal: LiveStream;
  onPress: () => void;
}

export const TarjetaCanalTV: React.FC<TarjetaCanalTVProps> = ({
  canal,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {canal.stream_icon ? (
          <Image
            source={{ uri: canal.stream_icon }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="tv" size={30} color={COLORS.textSecondary} />
          </View>
        )}
        
        {/* Badge de EN VIVO */}
        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>EN VIVO</Text>
        </View>
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {canal.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 10,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  liveBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginRight: 4,
  },
  liveText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  title: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
});

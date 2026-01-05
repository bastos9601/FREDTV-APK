import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { Perfil, obtenerPerfiles } from '../utils/perfilesStorage';
import { usePerfil } from '../contexto/PerfilContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 100;

export const SeleccionPerfilPantalla = () => {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [modalPIN, setModalPIN] = useState(false);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<Perfil | null>(null);
  const [pin, setPin] = useState('');
  const { cambiarPerfil } = usePerfil();
  const navigation = useNavigation<any>();

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    const lista = await obtenerPerfiles();
    setPerfiles(lista);
  };

  const seleccionarPerfil = async (perfil: Perfil) => {
    if (perfil.pin) {
      setPerfilSeleccionado(perfil);
      setModalPIN(true);
    } else {
      await cambiarPerfil(perfil.id);
      navigation.navigate('MainTabs');
    }
  };

  const verificarPIN = async () => {
    if (perfilSeleccionado && perfilSeleccionado.pin === pin) {
      await cambiarPerfil(perfilSeleccionado.id);
      setModalPIN(false);
      setPin('');
      navigation.navigate('MainTabs');
    } else {
      Alert.alert('Error', 'PIN incorrecto');
      setPin('');
    }
  };

  const irAGestionPerfiles = () => {
    navigation.navigate('GestionPerfiles');
  };

  const renderPerfil = ({ item }: { item: Perfil }) => (
    <TouchableOpacity
      style={styles.perfilCard}
      onPress={() => seleccionarPerfil(item)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.avatarContainer,
        item.esInfantil && styles.avatarInfantil
      ]}>
        <Ionicons 
          name={item.avatar as any} 
          size={AVATAR_SIZE} 
          color={item.esInfantil ? '#FCD34D' : COLORS.primary} 
        />
        {item.pin && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={16} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={styles.perfilNombre}>{item.nombre}</Text>
      {item.esInfantil && (
        <View style={styles.infantilBadge}>
          <Ionicons name="happy" size={14} color="#FCD34D" />
          <Text style={styles.infantilText}>Niños</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>FRED TV</Text>
        <Text style={styles.titulo}>¿Quién está viendo?</Text>
      </View>

      {/* Lista de Perfiles */}
      <FlatList
        data={perfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderPerfil}
        numColumns={2}
        contentContainerStyle={styles.lista}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.agregarCard}
            onPress={irAGestionPerfiles}
          >
            <View style={styles.agregarIconContainer}>
              <Ionicons name="add-circle" size={AVATAR_SIZE} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.agregarTexto}>Gestionar Perfiles</Text>
          </TouchableOpacity>
        }
      />

      {/* Modal de PIN */}
      <Modal
        visible={modalPIN}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalPIN(false);
          setPin('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Ingresa el PIN</Text>
            <Text style={styles.modalSubtitulo}>
              Perfil: {perfilSeleccionado?.nombre}
            </Text>
            
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              placeholder="••••"
              placeholderTextColor={COLORS.textSecondary}
              autoFocus
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonCancelar]}
                onPress={() => {
                  setModalPIN(false);
                  setPin('');
                }}
              >
                <Text style={styles.modalBotonTexto}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalBoton, styles.modalBotonConfirmar]}
                onPress={verificarPIN}
              >
                <Text style={styles.modalBotonTexto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  perfilCard: {
    alignItems: 'center',
    width: (width - 60) / 2,
  },
  avatarContainer: {
    width: AVATAR_SIZE + 20,
    height: AVATAR_SIZE + 20,
    borderRadius: (AVATAR_SIZE + 20) / 2,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarInfantil: {
    borderColor: '#FCD34D',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 4,
  },
  perfilNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  infantilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCD34D' + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infantilText: {
    fontSize: 12,
    color: '#FCD34D',
    marginLeft: 4,
    fontWeight: '600',
  },
  agregarCard: {
    alignItems: 'center',
    width: (width - 60) / 2,
    marginTop: 10,
  },
  agregarIconContainer: {
    width: AVATAR_SIZE + 20,
    height: AVATAR_SIZE + 20,
    borderRadius: (AVATAR_SIZE + 20) / 2,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  agregarTexto: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  // Modal de PIN
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 30,
    width: width - 60,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  modalSubtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 25,
  },
  pinInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 25,
  },
  modalBotones: {
    flexDirection: 'row',
    width: '100%',
  },
  modalBoton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalBotonCancelar: {
    backgroundColor: COLORS.background,
  },
  modalBotonConfirmar: {
    backgroundColor: COLORS.primary,
  },
  modalBotonTexto: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

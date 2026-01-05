import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import {
  Perfil,
  obtenerPerfiles,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil,
  AVATARES_DISPONIBLES,
} from '../utils/perfilesStorage';
import { useNavigation } from '@react-navigation/native';
import { usePerfil } from '../contexto/PerfilContext';

export const GestionPerfilesPantalla = () => {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState<Perfil | null>(null);
  const [nombre, setNombre] = useState('');
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('person-circle');
  const [esInfantil, setEsInfantil] = useState(false);
  const [pin, setPin] = useState('');
  const [usarPIN, setUsarPIN] = useState(false);
  const navigation = useNavigation();
  const { recargarPerfiles } = usePerfil();

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    const lista = await obtenerPerfiles();
    setPerfiles(lista);
  };

  const abrirModalCrear = () => {
    setPerfilEditando(null);
    setNombre('');
    setAvatarSeleccionado('person-circle');
    setEsInfantil(false);
    setPin('');
    setUsarPIN(false);
    setModalEdicion(true);
  };

  const abrirModalEditar = (perfil: Perfil) => {
    setPerfilEditando(perfil);
    setNombre(perfil.nombre);
    setAvatarSeleccionado(perfil.avatar);
    setEsInfantil(perfil.esInfantil);
    setPin(perfil.pin || '');
    setUsarPIN(!!perfil.pin);
    setModalEdicion(true);
  };

  const guardarPerfil = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (usarPIN && pin.length !== 4) {
      Alert.alert('Error', 'El PIN debe tener 4 dígitos');
      return;
    }

    try {
      if (perfilEditando) {
        // Editar perfil existente
        await actualizarPerfil(perfilEditando.id, {
          nombre: nombre.trim(),
          avatar: avatarSeleccionado,
          esInfantil,
          pin: usarPIN ? pin : undefined,
        });
      } else {
        // Crear nuevo perfil
        await crearPerfil({
          nombre: nombre.trim(),
          avatar: avatarSeleccionado,
          esInfantil,
          pin: usarPIN ? pin : undefined,
        });
      }

      await cargarPerfiles();
      await recargarPerfiles();
      setModalEdicion(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil');
    }
  };

  const confirmarEliminar = (perfil: Perfil) => {
    if (perfil.id === 'default') {
      Alert.alert('Error', 'No puedes eliminar el perfil principal');
      return;
    }

    Alert.alert(
      'Eliminar Perfil',
      `¿Estás seguro de eliminar el perfil "${perfil.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarPerfil(perfil.id);
              await cargarPerfiles();
              await recargarPerfiles();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderPerfil = ({ item }: { item: Perfil }) => (
    <View style={styles.perfilItem}>
      <View style={styles.perfilInfo}>
        <View style={[
          styles.avatarSmall,
          item.esInfantil && styles.avatarInfantil
        ]}>
          <Ionicons 
            name={item.avatar as any} 
            size={40} 
            color={item.esInfantil ? '#FCD34D' : COLORS.primary} 
          />
        </View>
        <View style={styles.perfilTexto}>
          <Text style={styles.perfilNombre}>{item.nombre}</Text>
          <View style={styles.perfilBadges}>
            {item.esInfantil && (
              <View style={styles.badge}>
                <Ionicons name="happy" size={12} color="#FCD34D" />
                <Text style={styles.badgeText}>Niños</Text>
              </View>
            )}
            {item.pin && (
              <View style={styles.badge}>
                <Ionicons name="lock-closed" size={12} color={COLORS.primary} />
                <Text style={styles.badgeText}>PIN</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.perfilAcciones}>
        <TouchableOpacity
          style={styles.botonAccion}
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="create" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        {item.id !== 'default' && (
          <TouchableOpacity
            style={styles.botonAccion}
            onPress={() => confirmarEliminar(item)}
          >
            <Ionicons name="trash" size={24} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Gestionar Perfiles</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Lista de Perfiles */}
      <FlatList
        data={perfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderPerfil}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.botonAgregar}
            onPress={abrirModalCrear}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.botonAgregarTexto}>Crear Nuevo Perfil</Text>
          </TouchableOpacity>
        }
      />

      {/* Modal de Edición/Creación */}
      <Modal
        visible={modalEdicion}
        animationType="slide"
        onRequestClose={() => setModalEdicion(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalEdicion(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitulo}>
              {perfilEditando ? 'Editar Perfil' : 'Nuevo Perfil'}
            </Text>
            <TouchableOpacity onPress={guardarPerfil}>
              <Text style={styles.guardarTexto}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Nombre */}
            <View style={styles.campo}>
              <Text style={styles.campoLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Juan, María, Niños..."
                placeholderTextColor={COLORS.textSecondary}
                maxLength={20}
              />
            </View>

            {/* Avatar */}
            <View style={styles.campo}>
              <Text style={styles.campoLabel}>Avatar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.avatarLista}
              >
                {AVATARES_DISPONIBLES.map((avatar) => (
                  <TouchableOpacity
                    key={avatar}
                    style={[
                      styles.avatarOpcion,
                      avatarSeleccionado === avatar && styles.avatarSeleccionado,
                    ]}
                    onPress={() => setAvatarSeleccionado(avatar)}
                  >
                    <Ionicons
                      name={avatar as any}
                      size={40}
                      color={avatarSeleccionado === avatar ? COLORS.primary : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Perfil Infantil */}
            <View style={styles.campo}>
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.campoLabel}>Perfil para Niños</Text>
                  <Text style={styles.campoDescripcion}>
                    Filtra contenido no apto para menores
                  </Text>
                </View>
                <Switch
                  value={esInfantil}
                  onValueChange={setEsInfantil}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
                  thumbColor={esInfantil ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
            </View>

            {/* PIN */}
            <View style={styles.campo}>
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.campoLabel}>Proteger con PIN</Text>
                  <Text style={styles.campoDescripcion}>
                    Requiere PIN para acceder al perfil
                  </Text>
                </View>
                <Switch
                  value={usarPIN}
                  onValueChange={setUsarPIN}
                  trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
                  thumbColor={usarPIN ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              {usarPIN && (
                <TextInput
                  style={[styles.input, styles.pinInput]}
                  value={pin}
                  onChangeText={setPin}
                  placeholder="PIN de 4 dígitos"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              )}
            </View>
          </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
  },
  botonVolver: {
    padding: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  lista: {
    padding: 15,
  },
  botonAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  botonAgregarTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 10,
  },
  perfilItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  perfilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarInfantil: {
    borderColor: '#FCD34D',
  },
  perfilTexto: {
    flex: 1,
  },
  perfilNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  perfilBadges: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  perfilAcciones: {
    flexDirection: 'row',
  },
  botonAccion: {
    padding: 10,
    marginLeft: 5,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  guardarTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  campo: {
    marginBottom: 25,
  },
  campoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  campoDescripcion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  pinInput: {
    marginTop: 10,
    letterSpacing: 5,
    textAlign: 'center',
  },
  avatarLista: {
    paddingVertical: 10,
  },
  avatarOpcion: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSeleccionado: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

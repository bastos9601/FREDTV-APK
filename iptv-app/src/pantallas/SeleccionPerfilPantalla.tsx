import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useSupabase } from '../contexto/SupabaseContext';
import { useNavigation } from '@react-navigation/native';
import { ModalPIN } from '../componentes/ModalPIN';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 100;
const CARD_SIZE = (width - 60) / 3;

export const SeleccionPerfilPantalla = () => {
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [mostrarModalPin, setMostrarModalPin] = useState(false);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<any>(null);
  const [modoPin, setModoPin] = useState<'verificar' | 'crear'>('verificar');
  const { cambiarPerfil } = usePerfilActivo();
  const { obtenerPerfiles, crearPerfil, verificarPinPerfil, actualizarPinPerfil } = useSupabaseData();
  const { usuarioId } = useSupabase();
  const navigation = useNavigation<any>();

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    try {
      setCargando(true);
      const lista = await obtenerPerfiles();
      setPerfiles(lista);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      Alert.alert('Error', 'No se pudieron cargar los perfiles');
    } finally {
      setCargando(false);
    }
  };

  const seleccionarPerfil = async (perfil: any) => {
    setPerfilSeleccionado(perfil);
    
    // Si el perfil tiene PIN, pedir que lo ingrese
    if (perfil.pin) {
      setModoPin('verificar');
      setMostrarModalPin(true);
    } else {
      // Si no tiene PIN, entrar directamente
      await entrarPerfil(perfil);
    }
  };

  const entrarPerfil = async (perfil: any) => {
    try {
      await cambiarPerfil({
        id: perfil.id,
        nombre: perfil.nombre,
        avatar: perfil.avatar,
      });
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el perfil');
    }
  };

  const handleConfirmarPin = async (pin: string) => {
    if (modoPin === 'verificar') {
      // Verificar que el PIN sea correcto
      const pinCorrecto = await verificarPinPerfil(perfilSeleccionado.id, pin);
      if (pinCorrecto) {
        setMostrarModalPin(false);
        await entrarPerfil(perfilSeleccionado);
      } else {
        Alert.alert('Error', 'PIN incorrecto');
      }
    } else {
      // Crear nuevo PIN
      const actualizado = await actualizarPinPerfil(perfilSeleccionado.id, pin);
      if (actualizado) {
        setMostrarModalPin(false);
        Alert.alert('Éxito', 'PIN creado correctamente');
        await cargarPerfiles();
      } else {
        Alert.alert('Error', 'No se pudo crear el PIN');
      }
    }
  };

  const crearNuevoPerfil = async () => {
    if (!nombreNuevo.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el perfil');
      return;
    }

    try {
      const nuevoPerfil = await crearPerfil(nombreNuevo);
      if (nuevoPerfil) {
        setNombreNuevo('');
        setMostrarFormulario(false);
        await cargarPerfiles();
        Alert.alert('Éxito', 'Perfil creado correctamente');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el perfil');
    }
  };

  const renderPerfil = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.perfilCard}
      onPress={() => seleccionarPerfil(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <MaterialCommunityIcons 
          name={item.avatar || 'account'} 
          size={AVATAR_SIZE} 
          color={COLORS.primary} 
        />
        {item.pin && (
          <View style={styles.pinBadge}>
            <Ionicons name="lock" size={12} color="#FFF" />
          </View>
        )}
      </View>
      <Text style={styles.perfilNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  if (cargando) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.cargandoTexto}>Cargando perfiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <View style={styles.fondoGradiente} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Logo */}
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>FRED TV</Text>
        </View>

        {/* Icono de Bloqueo */}
        <View style={styles.lockContainer}>
          <View style={styles.lockShield}>
            <MaterialCommunityIcons name="lock" size={60} color="#FFF" />
          </View>
          <Text style={styles.lockText}>Bloqueo de perfil ACTIVADO</Text>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>Elige tu perfil</Text>

        {/* Grid de Perfiles */}
        {perfiles.length > 0 ? (
          <View style={styles.gridContainer}>
            {perfiles.map((perfil) => (
              <TouchableOpacity
                key={perfil.id}
                style={styles.perfilCard}
                onPress={() => seleccionarPerfil(perfil)}
                activeOpacity={0.8}
              >
                <View style={[styles.perfilCardContent, { backgroundColor: perfil.avatar ? '#' + Math.floor(Math.random()*16777215).toString(16) : COLORS.primary }]}>
                  <MaterialCommunityIcons 
                    name={perfil.avatar || 'account'} 
                    size={50} 
                    color="#FFF" 
                  />
                  {perfil.pin && (
                    <View style={styles.lockBadge}>
                      <MaterialCommunityIcons name="lock" size={14} color="#FFF" />
                    </View>
                  )}
                </View>
                <Text style={styles.perfilNombre}>{perfil.nombre}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Botón Crear Perfil */}
            {perfiles.length < 6 && (
              <TouchableOpacity
                style={styles.perfilCard}
                onPress={() => setMostrarFormulario(true)}
                activeOpacity={0.8}
              >
                <View style={styles.perfilCardCrear}>
                  <MaterialCommunityIcons name="plus" size={40} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.perfilNombre}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-multiple" size={80} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No hay perfiles creados</Text>
            <TouchableOpacity
              style={styles.crearBoton}
              onPress={() => setMostrarFormulario(true)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              <Text style={styles.crearBotonTexto}>Crear primer perfil</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Formulario crear perfil */}
      {mostrarFormulario && (
        <View style={styles.formularioContainer}>
          <View style={styles.formulario}>
            <Text style={styles.formularioTitulo}>Crear nuevo perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del perfil"
              placeholderTextColor={COLORS.textSecondary}
              value={nombreNuevo}
              onChangeText={setNombreNuevo}
              maxLength={20}
            />
            <View style={styles.botonesFormulario}>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={() => {
                  setMostrarFormulario(false);
                  setNombreNuevo('');
                }}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.botonCrear]}
                onPress={crearNuevoPerfil}
              >
                <Text style={styles.textoBoton}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal PIN */}
      <ModalPIN
        visible={mostrarModalPin}
        perfilNombre={perfilSeleccionado?.nombre || ''}
        modo={modoPin}
        onConfirm={handleConfirmarPin}
        onCancel={() => {
          setMostrarModalPin(false);
          setPerfilSeleccionado(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fondoGradiente: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#1a0a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  lockContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  lockShield: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  lockText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 15,
    gap: 15,
  },
  perfilCard: {
    width: CARD_SIZE,
    alignItems: 'center',
    marginBottom: 10,
  },
  perfilCardContent: {
    width: CARD_SIZE - 10,
    height: CARD_SIZE - 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  perfilCardCrear: {
    width: CARD_SIZE - 10,
    height: CARD_SIZE - 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 6,
  },
  perfilNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: '600',
  },
  crearBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  crearBotonTexto: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  formularioContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    height: '100%',
  },
  formulario: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  formularioTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    marginBottom: 16,
    fontSize: 14,
  },
  botonesFormulario: {
    flexDirection: 'row',
    gap: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: COLORS.background,
  },
  botonCrear: {
    backgroundColor: COLORS.primary,
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

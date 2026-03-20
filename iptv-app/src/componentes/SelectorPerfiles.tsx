import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';

interface SelectorPerfilesProps {
  visible: boolean;
  onClose: () => void;
}

export const SelectorPerfiles: React.FC<SelectorPerfilesProps> = ({ visible, onClose }) => {
  const { obtenerPerfiles, crearPerfil, eliminarPerfil, cargando } = useSupabaseData();
  const { perfilActivo, cambiarPerfil } = usePerfilActivo();
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [cargandoPerfiles, setCargandoPerfiles] = useState(false);

  useEffect(() => {
    if (visible) {
      cargarPerfiles();
    }
  }, [visible]);

  const cargarPerfiles = async () => {
    try {
      setCargandoPerfiles(true);
      const perfilesObtenidos = await obtenerPerfiles();
      setPerfiles(perfilesObtenidos);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setCargandoPerfiles(false);
    }
  };

  const handleCrearPerfil = async () => {
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

  const handleSeleccionarPerfil = async (perfil: any) => {
    try {
      await cambiarPerfil({
        id: perfil.id,
        nombre: perfil.nombre,
        avatar: perfil.avatar,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el perfil');
    }
  };

  const handleEliminarPerfil = (perfilId: string) => {
    Alert.alert('Eliminar perfil', '¿Estás seguro de que deseas eliminar este perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const resultado = await eliminarPerfil(perfilId);
            if (resultado) {
              await cargarPerfiles();
              Alert.alert('Éxito', 'Perfil eliminado correctamente');
            }
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el perfil');
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Mis Perfiles</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
          {cargandoPerfiles ? (
            <View style={styles.cargando}>
              <ActivityIndicator size="large" color="#DC143C" />
              <Text style={styles.textoCargando}>Cargando perfiles...</Text>
            </View>
          ) : perfiles.length === 0 ? (
            <View style={styles.vacio}>
              <MaterialCommunityIcons name="account-multiple" size={64} color="#666" />
              <Text style={styles.textoVacio}>No hay perfiles creados</Text>
              <Text style={styles.textoVacioSub}>Crea tu primer perfil para comenzar</Text>
            </View>
          ) : (
            <View style={styles.listaPerfiles}>
              {perfiles.map((perfil) => (
                <TouchableOpacity
                  key={perfil.id}
                  style={[
                    styles.perfilItem,
                    perfilActivo?.id === perfil.id && styles.perfilItemActivo,
                  ]}
                  onPress={() => handleSeleccionarPerfil(perfil)}
                >
                  <View style={styles.perfilContenido}>
                    <View style={styles.avatarCirculo}>
                      <MaterialCommunityIcons
                        name={perfil.avatar || 'account'}
                        size={32}
                        color="#fff"
                      />
                    </View>
                    <View style={styles.perfilInfo}>
                      <Text style={styles.perfilNombre}>{perfil.nombre}</Text>
                      <Text style={styles.perfilFecha}>
                        Creado: {new Date(perfil.fecha_creacion).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {perfilActivo?.id === perfil.id && (
                    <View style={styles.checkmark}>
                      <MaterialCommunityIcons name="check-circle" size={24} color="#25D366" />
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => handleEliminarPerfil(perfil.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#DC143C" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Formulario crear perfil */}
          {mostrarFormulario && (
            <View style={styles.formulario}>
              <Text style={styles.formularioTitulo}>Crear nuevo perfil</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del perfil"
                placeholderTextColor="#999"
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
                  onPress={handleCrearPerfil}
                  disabled={cargando}
                >
                  {cargando ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.textoBoton}>Crear</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botón crear perfil */}
        {!mostrarFormulario && (
          <TouchableOpacity
            style={styles.botonCrearPerfil}
            onPress={() => setMostrarFormulario(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            <Text style={styles.textoBotonCrear}>Crear nuevo perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contenido: {
    flex: 1,
    padding: 16,
  },
  cargando: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  textoCargando: {
    color: '#999',
    marginTop: 12,
    fontSize: 14,
  },
  vacio: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  textoVacio: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  textoVacioSub: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  listaPerfiles: {
    gap: 12,
  },
  perfilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  perfilItemActivo: {
    borderColor: '#DC143C',
    backgroundColor: '#2a1a1a',
  },
  perfilContenido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCirculo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  perfilInfo: {
    flex: 1,
  },
  perfilNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  perfilFecha: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkmark: {
    marginRight: 12,
  },
  botonEliminar: {
    padding: 8,
  },
  formulario: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  formularioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
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
    backgroundColor: '#333',
  },
  botonCrear: {
    backgroundColor: '#DC143C',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  botonCrearPerfil: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  textoBotonCrear: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

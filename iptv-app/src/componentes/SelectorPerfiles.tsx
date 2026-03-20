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
import { ModalPIN } from './ModalPIN';

interface SelectorPerfilesProps {
  visible: boolean;
  onClose: () => void;
}

export const SelectorPerfiles: React.FC<SelectorPerfilesProps> = ({ visible, onClose }) => {
  const { obtenerPerfiles, crearPerfil, eliminarPerfil, actualizarPinPerfil, verificarPinPerfil, cargando } = useSupabaseData();
  const { perfilActivo, cambiarPerfil } = usePerfilActivo();
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [cargandoPerfiles, setCargandoPerfiles] = useState(false);
  const [mostrarModalPin, setMostrarModalPin] = useState(false);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<any>(null);
  const [modoPin, setModoPin] = useState<'verificar' | 'crear'>('verificar');
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);
  const [nombreEditado, setNombreEditado] = useState('');
  const [mostrarAdministrar, setMostrarAdministrar] = useState(false);

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
      } else {
        Alert.alert('Error', 'No se pudo crear el perfil. Intenta de nuevo.');
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo crear el perfil: ${mensaje}`);
      console.error('Error en handleCrearPerfil:', error);
    }
  };

  const handleSeleccionarPerfil = async (perfil: any) => {
    // Si el perfil tiene PIN, pedir que lo ingrese
    if (perfil.pin) {
      setPerfilSeleccionado(perfil);
      setModoPin('verificar');
      setMostrarModalPin(true);
    } else {
      // Si no tiene PIN, cambiar directamente
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

  const handleAbrirModalPin = (perfil: any) => {
    setPerfilSeleccionado(perfil);
    setModoPin('crear');
    setMostrarModalPin(true);
  };

  const handleConfirmarPin = async (pin: string) => {
    if (modoPin === 'verificar') {
      // Verificar que el PIN sea correcto
      const pinCorrecto = await verificarPinPerfil(perfilSeleccionado.id, pin);
      if (pinCorrecto) {
        // PIN correcto, cambiar de perfil
        try {
          await cambiarPerfil({
            id: perfilSeleccionado.id,
            nombre: perfilSeleccionado.nombre,
            avatar: perfilSeleccionado.avatar,
          });
          setMostrarModalPin(false);
          onClose();
        } catch (error) {
          Alert.alert('Error', 'No se pudo cambiar el perfil');
        }
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
        Alert.alert('Error', 'No se pudo guardar el PIN');
      }
    }
  };

  const handleAbrirEditarPerfil = (perfil: any) => {
    setPerfilSeleccionado(perfil);
    setNombreEditado(perfil.nombre);
    setMostrarEditarPerfil(true);
  };

  const handleGuardarNombrePerfil = async () => {
    if (!nombreEditado.trim()) {
      Alert.alert('Error', 'El nombre del perfil no puede estar vacío');
      return;
    }

    try {
      // Actualizar el perfil en Supabase
      const supabaseServicio = (await import('../servicios/supabaseServicio')).default;
      const actualizado = await supabaseServicio.actualizarNombrePerfil(perfilSeleccionado.id, nombreEditado);

      if (!actualizado) {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
        return;
      }

      setMostrarEditarPerfil(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      await cargarPerfiles();
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el perfil');
    }
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

        {/* Botones de acción */}
        {!mostrarFormulario && (
          <View style={styles.botonesAccion}>
            <TouchableOpacity
              style={styles.botonAdministrar}
              onPress={() => setMostrarAdministrar(true)}
            >
              <MaterialCommunityIcons name="cog" size={20} color="#fff" />
              <Text style={styles.textoBotonAccion}>Administrar Perfiles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonCrearPerfil}
              onPress={() => setMostrarFormulario(true)}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
              <Text style={styles.textoBotonCrear}>Crear nuevo perfil</Text>
            </TouchableOpacity>
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

        {/* Modal Editar Perfil */}
        <Modal visible={mostrarEditarPerfil} transparent animationType="fade" onRequestClose={() => setMostrarEditarPerfil(false)}>
          <View style={styles.modalEditarContainer}>
            <View style={styles.modalEditarContenido}>
              <Text style={styles.modalEditarTitulo}>Editar Perfil</Text>
              <TextInput
                style={styles.inputEditar}
                placeholder="Nombre del perfil"
                placeholderTextColor="#999"
                value={nombreEditado}
                onChangeText={setNombreEditado}
                maxLength={20}
              />
              <View style={styles.botonesEditar}>
                <TouchableOpacity
                  style={[styles.botonEditar2, styles.botonCancelar2]}
                  onPress={() => setMostrarEditarPerfil(false)}
                >
                  <Text style={styles.textoBoton2}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonEditar2, styles.botonGuardar]}
                  onPress={handleGuardarNombrePerfil}
                >
                  <Text style={styles.textoBoton2}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Administrar Perfiles */}
        <Modal visible={mostrarAdministrar} transparent animationType="slide" onRequestClose={() => setMostrarAdministrar(false)}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titulo}>Administrar Perfiles</Text>
              <TouchableOpacity onPress={() => setMostrarAdministrar(false)}>
                <MaterialCommunityIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
              <View style={styles.listaPerfiles}>
                {perfiles.map((perfil) => (
                  <View key={perfil.id} style={styles.perfilItemAdmin}>
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

                    <TouchableOpacity
                      style={styles.botonPin}
                      onPress={() => {
                        setMostrarAdministrar(false);
                        handleAbrirModalPin(perfil);
                      }}
                    >
                      <MaterialCommunityIcons 
                        name={perfil.pin ? "lock" : "lock-open"} 
                        size={20} 
                        color={perfil.pin ? "#FFD700" : "#999"} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botonEditar}
                      onPress={() => {
                        setMostrarAdministrar(false);
                        handleAbrirEditarPerfil(perfil);
                      }}
                    >
                      <MaterialCommunityIcons name="pencil" size={20} color="#4A90E2" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botonEliminar}
                      onPress={() => {
                        setMostrarAdministrar(false);
                        handleEliminarPerfil(perfil.id);
                      }}
                    >
                      <MaterialCommunityIcons name="delete" size={20} color="#DC143C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.botonCerrarAdmin}
              onPress={() => setMostrarAdministrar(false)}
            >
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  botonPin: {
    padding: 8,
    marginRight: 4,
  },
  botonEditar: {
    padding: 8,
    marginRight: 4,
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
  botonesAccion: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  botonAdministrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  textoBotonAccion: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  perfilItemAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  modalEditarContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalEditarContenido: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  modalEditarTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  inputEditar: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 16,
    fontSize: 14,
  },
  botonesEditar: {
    flexDirection: 'row',
    gap: 12,
  },
  botonEditar2: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCancelar2: {
    backgroundColor: '#333',
  },
  botonGuardar: {
    backgroundColor: '#DC143C',
  },
  textoBoton2: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  botonCerrarAdmin: {
    backgroundColor: '#333',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotonCerrar: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

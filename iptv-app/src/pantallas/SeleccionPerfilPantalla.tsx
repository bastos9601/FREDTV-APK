import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/constantes';
import { usePerfilActivo } from '../contexto/PerfilActivoContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useSupabase } from '../contexto/SupabaseContext';
import { useAuth } from '../contexto/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ModalPIN } from '../componentes/ModalPIN';
import iptvServicio from '../servicios/iptvServicio';
import supabaseServicio from '../servicios/supabaseServicio';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const AVATAR_SIZE = 100;
const CARD_SIZE = (width - 60) / 3;

export const SeleccionPerfilPantalla = () => {
  const [perfiles, setPerfiles] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [servidorURL, setServidorURL] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargandoLogin, setCargandoLogin] = useState(false);
  const [mostrarModalPin, setMostrarModalPin] = useState(false);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<any>(null);
  const [modoPin, setModoPin] = useState<'verificar' | 'crear'>('verificar');
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);
  const [perfilMenuActivo, setPerfilMenuActivo] = useState<any>(null);
  const [animandoTransicion, setAnimandoTransicion] = useState(false);
  const timerLongPressRef = useRef<NodeJS.Timeout | null>(null);
  const longPressActivadoRef = useRef(false);
  const animacionNombre = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animacionIcono = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animacionEscala = useRef(new Animated.Value(1)).current;
  const animacionOpacidad = useRef(new Animated.Value(1)).current;
  const { cambiarPerfil } = usePerfilActivo();
  const { obtenerPerfiles, crearPerfil, verificarPinPerfil, actualizarPinPerfil, eliminarPerfil } = useSupabaseData();
  const { usuarioId } = useSupabase();
  const navigation = useNavigation<any>();
  const { iniciarSesion } = useAuth();

  useEffect(() => {
    cargarPerfiles();
  }, []);

  useEffect(() => {
    // Resetear la bandera cuando se cierre el menú
    if (!mostrarMenuPerfil) {
      longPressActivadoRef.current = false;
    }
  }, [mostrarMenuPerfil]);

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
      // Iniciar animación de transición
      setAnimandoTransicion(true);
      
      // Cambiar de pantalla primero (sin esperar)
      cambiarPerfil({
        id: perfil.id,
        nombre: perfil.nombre,
        avatar: perfil.avatar,
      });
      
      // Navegar después de un pequeño delay para que se vea el inicio de la animación
      setTimeout(() => {
        navigation.navigate('MainTabs');
        
        // Resetear animaciones después de navegar
        setTimeout(() => {
          animacionNombre.setValue({ x: 0, y: 0 });
          animacionIcono.setValue({ x: 0, y: 0 });
          animacionEscala.setValue(1);
          animacionOpacidad.setValue(1);
          setAnimandoTransicion(false);
        }, 100);
      }, 300);
      
      // Ejecutar animación en paralelo
      Animated.sequence([
        // Fase 1: Zoom in del perfil (0.2s)
        Animated.timing(animacionEscala, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        // Fase 2: Mover hacia las posiciones finales mientras hace zoom out (0.5s)
        Animated.parallel([
          Animated.timing(animacionNombre, {
            toValue: { x: -width / 2 + 80, y: -height / 2 + 80 },
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animacionIcono, {
            toValue: { x: width / 2 - 60, y: -height / 2 + 80 },
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animacionEscala, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true,
          }),
          // Desvanecer otros perfiles
          Animated.timing(animacionOpacidad, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el perfil');
      setAnimandoTransicion(false);
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
    if (!nombreNuevo.trim() || !usuario.trim() || !contrasena.trim() || !servidorURL.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setCargandoLogin(true);
      
      // Configurar el servidor IPTV con la URL proporcionada
      iptvServicio.setBaseURL(servidorURL);
      
      // Intentar iniciar sesión con las credenciales IPTV
      await iniciarSesion(usuario, contrasena);
      
      // Crear un perfil automáticamente con el nombre de la lista de reproducción
      const nuevoPerfil = await supabaseServicio.crearPerfil({
        usuario_id: usuario,
        nombre: nombreNuevo,
        avatar: 'account',
        fecha_creacion: new Date().toISOString(),
      });
      
      if (nuevoPerfil && nuevoPerfil.id) {
        // Seleccionar el perfil creado
        await cambiarPerfil({
          id: nuevoPerfil.id,
          nombre: nuevoPerfil.nombre,
          avatar: nuevoPerfil.avatar || 'account',
        });
        
        // Cerrar el formulario
        setMostrarFormulario(false);
        setNombreNuevo('');
        setUsuario('');
        setContrasena('');
        setServidorURL('');
        
        // Navegar a la pantalla principal
        navigation.navigate('MainTabs');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión. Verifica tus credenciales y servidor');
    } finally {
      setCargandoLogin(false);
    }
  };

  const handlePressPerfil = (perfil: any) => {
    seleccionarPerfil(perfil);
  };

  const cargarListaReproduccion = () => {
    setMostrarMenuPerfil(false);
    setMostrarFormulario(true);
  };

  const eliminarPerfilConfirm = async () => {
    if (!perfilMenuActivo) return;
    
    Alert.alert(
      'Eliminar perfil',
      `¿Estás seguro de que deseas eliminar el perfil "${perfilMenuActivo.nombre}"?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const resultado = await eliminarPerfil(perfilMenuActivo.id);
              if (resultado) {
                setMostrarMenuPerfil(false);
                await cargarPerfiles();
                Alert.alert('Éxito', 'Perfil eliminado correctamente');
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el perfil');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderPerfil = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.perfilCard}
      onPress={() => seleccionarPerfil(item)}
      activeOpacity={0.7}
      disabled={animandoTransicion}
    >
      <View style={styles.avatarContainer}>
        <MaterialCommunityIcons 
          name={item.avatar || 'account'} 
          size={AVATAR_SIZE} 
          color={COLORS.primary} 
        />
        {item.pin && (
          <View style={styles.pinBadge}>
            <Ionicons name="lock-closed" size={12} color="#FFF" />
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
          <Image 
            source={require('../../assets/icon.png')}
            style={styles.logoImagen}
            resizeMode="contain"
          />
        </View>

        {/* Icono de Bloqueo */}
        {/* Removido: Sección de bloqueo de perfil */}

        {/* Título */}
        <Text style={styles.titulo}>Elige tu perfil</Text>

        {/* Grid de Perfiles */}
        {perfiles.length > 0 ? (
          <View style={styles.gridContainer}>
            {perfiles.map((perfil) => {
              const esPerfilSeleccionado = perfilSeleccionado?.id === perfil.id && animandoTransicion;
              
              return (
                <TouchableOpacity
                  key={perfil.id}
                  style={styles.perfilCard}
                  onPress={() => handlePressPerfil(perfil)}
                  onLongPress={() => {
                    setPerfilMenuActivo(perfil);
                    setMostrarMenuPerfil(true);
                  }}
                  delayLongPress={5000}
                  activeOpacity={0.8}
                  disabled={animandoTransicion}
                >
                  <Animated.View 
                    style={[
                      styles.perfilCardContent, 
                      { backgroundColor: perfil.avatar ? '#' + Math.floor(Math.random()*16777215).toString(16) : COLORS.primary },
                      esPerfilSeleccionado && {
                        transform: [
                          { translateX: animacionIcono.x },
                          { translateY: animacionIcono.y },
                          { scale: animacionEscala },
                        ],
                      },
                      !esPerfilSeleccionado && animandoTransicion && {
                        opacity: animacionOpacidad,
                      },
                    ]}
                  >
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
                  </Animated.View>
                  <Animated.Text 
                    style={[
                      styles.perfilNombre,
                      esPerfilSeleccionado && {
                        transform: [
                          { translateX: animacionNombre.x },
                          { translateY: animacionNombre.y },
                          { scale: animacionEscala },
                        ],
                      },
                      !esPerfilSeleccionado && animandoTransicion && {
                        opacity: animacionOpacidad,
                      },
                    ]}
                  >
                    {perfil.nombre}
                  </Animated.Text>
                </TouchableOpacity>
              );
            })}
            
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
                <Text style={styles.perfilNombre}>Agregar perfil</Text>
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
              <Text style={styles.crearBotonTexto}>Agregar perfil</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Formulario crear perfil */}
      {mostrarFormulario && (
        <View style={styles.formularioContainer}>
          <ScrollView 
            style={styles.formulario}
            contentContainerStyle={styles.formularioContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo en el formulario */}
            <View style={styles.formularioHeader}>
              <Image 
                source={require('../../assets/icon.png')}
                style={styles.logoImagenFormulario}
                resizeMode="contain"
              />
            </View>

            {/* Campo: Nombre de la lista de reproducción */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="menu" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.inputField}
                placeholder="Nombre de la lista de reproducción"
                placeholderTextColor={COLORS.textSecondary}
                value={nombreNuevo}
                onChangeText={setNombreNuevo}
                maxLength={30}
              />
            </View>

            {/* Campo: Nombre de usuario */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.inputField}
                placeholder="Nombre de usuario"
                placeholderTextColor={COLORS.textSecondary}
                value={usuario}
                onChangeText={setUsuario}
              />
            </View>

            {/* Campo: Contraseña */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.inputField}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textSecondary}
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!mostrarContrasena}
              />
              <TouchableOpacity onPress={() => setMostrarContrasena(!mostrarContrasena)}>
                <MaterialCommunityIcons 
                  name={mostrarContrasena ? "eye" : "eye-off"} 
                  size={20} 
                  color={COLORS.primary} 
                />
              </TouchableOpacity>
            </View>

            {/* Campo: Dirección del servidor */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="web" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.inputField}
                placeholder="Dirección del servidor"
                placeholderTextColor={COLORS.textSecondary}
                value={servidorURL}
                onChangeText={setServidorURL}
              />
            </View>

            {/* Botón Add Playlist */}
            <TouchableOpacity
              style={[styles.botonAgregar, cargandoLogin && styles.botonDeshabilitado]}
              onPress={crearNuevoPerfil}
              disabled={cargandoLogin}
            >
              {cargandoLogin ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.botonAgregarTexto}>Add Playlist</Text>
              )}
            </TouchableOpacity>

            {/* Separador */}
            <Text style={styles.separador}>O</Text>

            {/* Botón Lista de Reproducción */}
            <TouchableOpacity
              style={styles.botonSecundario}
              onPress={() => {
                setMostrarFormulario(false);
                setNombreNuevo('');
              }}
            >
              <MaterialCommunityIcons name="playlist-music" size={20} color={COLORS.primary} />
              <Text style={styles.botonSecundarioTexto}>Lista de Reproducción</Text>
            </TouchableOpacity>

            {/* Texto de términos */}
            <Text style={styles.terminosTexto}>
              Al usar esta aplicación, acepto Términos y condiciones
            </Text>
          </ScrollView>
        </View>
      )}

      {/* Menú de opciones del perfil (Long Press) */}
      {mostrarMenuPerfil && perfilMenuActivo && (
        <TouchableOpacity 
          style={styles.menuContainer}
          activeOpacity={1}
          onPress={() => setMostrarMenuPerfil(false)}
        >
          <View 
            style={styles.menu}
          >
            <TouchableOpacity
              style={styles.menuOpcion}
              onPress={() => {
                cargarListaReproduccion();
                setMostrarMenuPerfil(false);
              }}
            >
              <MaterialCommunityIcons name="reload" size={20} color={COLORS.primary} />
              <Text style={styles.menuTexto}>Cargar lista de reproducción</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivisor} />
            
            <TouchableOpacity
              style={styles.menuOpcion}
              onPress={() => {
                eliminarPerfilConfirm();
                setMostrarMenuPerfil(false);
              }}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#FF6B6B" />
              <Text style={[styles.menuTexto, { color: '#FF6B6B' }]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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

      {/* Overlay de transición */}
      {animandoTransicion && (
        <Animated.View 
          style={[
            styles.transicionOverlay,
            {
              opacity: animacionOpacidad.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fondoGradiente: {
    display: 'none',
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
  logoImagen: {
    width: 10500,
    height: 150,
  },
  logoImagenFormulario: {
    width: 140,
    height: 140,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tvIconContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  antennaLeft: {
    position: 'absolute',
    top: -8,
    left: 8,
    width: 3,
    height: 20,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: '-45deg' }],
  },
  antennaRight: {
    position: 'absolute',
    top: -8,
    right: 8,
    width: 3,
    height: 20,
    backgroundColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoPro: {
    fontSize: 28,
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
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  formularioContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  formularioHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 12,
  },
  inputField: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  botonAgregar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  botonAgregarTexto: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  separador: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
    marginVertical: 16,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  botonSecundarioTexto: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  terminosTexto: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 20,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  menu: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 12,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  menuOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuTexto: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivisor: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  transicionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    zIndex: 999,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    color: COLORS.text,
    marginTop: 15,
    fontSize: 16,
  },
});

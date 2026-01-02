# 🎨 Guía de Personalización - IPTV App

## 🌈 Cambiar Colores

### Editar Paleta de Colores

Archivo: `src/utils/constantes.ts`

```typescript
export const COLORS = {
  primary: '#E50914',      // Color principal (botones, acentos)
  background: '#141414',   // Fondo de la app
  card: '#2F2F2F',        // Fondo de tarjetas
  text: '#FFFFFF',        // Texto principal
  textSecondary: '#B3B3B3', // Texto secundario
  border: '#404040',      // Bordes
};
```

### Ejemplos de Paletas

#### Tema Azul
```typescript
export const COLORS = {
  primary: '#1E90FF',
  background: '#0A0E27',
  card: '#1A1F3A',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  border: '#2D3748',
};
```

#### Tema Verde
```typescript
export const COLORS = {
  primary: '#10B981',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
};
```

#### Tema Morado
```typescript
export const COLORS = {
  primary: '#8B5CF6',
  background: '#1A1625',
  card: '#2D2438',
  text: '#FFFFFF',
  textSecondary: '#C4B5FD',
  border: '#4C3A6D',
};
```

---

## 🖼️ Cambiar Logo e Iconos

### Icono de la App

1. Crea un icono de 1024x1024 px
2. Guárdalo como `assets/icon.png`
3. Ejecuta:
```bash
npx expo prebuild --clean
```

### Splash Screen

1. Crea una imagen de 1242x2436 px
2. Guárdala como `assets/splash.png`
3. Edita `app.json`:
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#141414"
    }
  }
}
```

### Adaptive Icon (Android)

1. Crea un icono de 1024x1024 px
2. Guárdalo como `assets/adaptive-icon.png`
3. Configura en `app.json`:
```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#141414"
      }
    }
  }
}
```

---

## 📝 Cambiar Nombre de la App

### Editar app.json

```json
{
  "expo": {
    "name": "Mi IPTV App",
    "slug": "mi-iptv-app",
    "android": {
      "package": "com.miempresa.iptv"
    }
  }
}
```

### Cambiar Título en Pantallas

Archivo: `src/navegacion/NavegacionPrincipal.tsx`

```typescript
<Tab.Screen
  name="Inicio"
  component={InicioPantalla}
  options={{
    title: "Mi Inicio", // Cambia aquí
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
  }}
/>
```

---

## 🔗 Cambiar Servidor IPTV

### Editar Configuración

Archivo: `src/utils/constantes.ts`

```typescript
export const IPTV_CONFIG = {
  HOST: 'https://tu-servidor.com:8080', // Cambia aquí
  ENDPOINTS: {
    LOGIN: '/player_api.php',
    // ... resto de endpoints
  }
};
```

---

## 🎭 Personalizar Componentes

### Cambiar Estilo de Botones

Archivo: `src/componentes/Boton.tsx`

```typescript
const styles = StyleSheet.create({
  boton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10, // Cambia el radio de borde
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    // Agrega sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // ...
});
```

### Cambiar Estilo de Tarjetas

Archivo: `src/componentes/TarjetaCanal.tsx`

```typescript
const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORS.card,
    borderRadius: 12, // Más redondeado
    padding: 15,
    margin: 8,
    width: 160, // Más ancho
    alignItems: 'center',
    // Agrega borde
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // ...
});
```

---

## 📱 Personalizar Navegación

### Cambiar Iconos de Pestañas

Archivo: `src/navegacion/NavegacionPrincipal.tsx`

```typescript
<Tab.Screen
  name="TV"
  component={TvEnVivoPantalla}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="tv-outline" size={size} color={color} /> // Cambia el icono
    ),
  }}
/>
```

### Iconos Disponibles

Busca iconos en: https://icons.expo.fyi/

Ejemplos:
- `home`, `home-outline`
- `tv`, `tv-outline`
- `film`, `film-outline`
- `play-circle`, `play-circle-outline`
- `person`, `person-outline`
- `search`, `search-outline`
- `heart`, `heart-outline`
- `star`, `star-outline`

### Cambiar Posición de Pestañas

```typescript
<Tab.Navigator
  screenOptions={{
    tabBarPosition: 'top', // Pestañas arriba
    // o 'bottom' para abajo (default)
  }}
>
```

---

## 🖥️ Personalizar Pantallas

### Agregar Imagen de Fondo

Archivo: `src/pantallas/LoginPantalla.tsx`

```typescript
import { ImageBackground } from 'react-native';

return (
  <ImageBackground
    source={require('../../assets/background.jpg')}
    style={styles.contenedor}
  >
    {/* Contenido */}
  </ImageBackground>
);
```

### Cambiar Fuente

1. Descarga fuentes (ej: Roboto, OpenSans)
2. Colócalas en `assets/fonts/`
3. Carga las fuentes:

```typescript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return <AuthProvider>...</AuthProvider>;
}
```

4. Usa en estilos:

```typescript
const styles = StyleSheet.create({
  texto: {
    fontFamily: 'Roboto-Regular',
  },
});
```

---

## 🎬 Personalizar Reproductor

### Cambiar Controles

Archivo: `src/pantallas/ReproductorPantalla.tsx`

```typescript
<Video
  ref={videoRef}
  source={{ uri: url }}
  style={styles.video}
  useNativeControls={false} // Desactiva controles nativos
  resizeMode={ResizeMode.COVER} // Cambia modo de ajuste
  shouldPlay
  isLooping // Agrega loop
  volume={1.0} // Volumen inicial
/>
```

### Agregar Controles Personalizados

```typescript
<View style={styles.controles}>
  <TouchableOpacity onPress={toggleReproduccion}>
    <Ionicons 
      name={estado.reproduciendo ? "pause" : "play"} 
      size={50} 
      color="white" 
    />
  </TouchableOpacity>
</View>
```

---

## 📊 Personalizar Listas

### Cambiar Número de Columnas

Archivo: `src/pantallas/TvEnVivoPantalla.tsx`

```typescript
<FlatList
  data={canales}
  numColumns={3} // Cambia de 2 a 3 columnas
  // ...
/>
```

### Agregar Separadores

```typescript
<FlatList
  data={canales}
  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
  // ...
/>
```

### Cambiar Orientación

```typescript
<FlatList
  data={canales}
  horizontal // Lista horizontal
  showsHorizontalScrollIndicator={false}
  // ...
/>
```

---

## 🔔 Agregar Notificaciones

### Instalar Dependencia

```bash
npx expo install expo-notifications
```

### Configurar

```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Enviar notificación
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Nuevo contenido",
    body: "¡Hay nuevas películas disponibles!",
  },
  trigger: null,
});
```

---

## 🌐 Agregar Idiomas (i18n)

### Instalar Dependencia

```bash
npm install i18n-js
```

### Configurar

```typescript
import { I18n } from 'i18n-js';

const i18n = new I18n({
  es: {
    welcome: 'Bienvenido',
    login: 'Iniciar Sesión',
  },
  en: {
    welcome: 'Welcome',
    login: 'Login',
  },
});

i18n.locale = 'es';

// Usar
<Text>{i18n.t('welcome')}</Text>
```

---

## 🎯 Agregar Búsqueda

### Crear Componente de Búsqueda

```typescript
// src/componentes/BarraBusqueda.tsx
import { TextInput, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const BarraBusqueda = ({ value, onChangeText }) => {
  return (
    <View style={styles.contenedor}>
      <Ionicons name="search" size={20} color="#888" />
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
```

### Usar en Pantalla

```typescript
const [busqueda, setBusqueda] = useState('');

const canalesFiltrados = canales.filter(canal =>
  canal.name.toLowerCase().includes(busqueda.toLowerCase())
);

return (
  <View>
    <BarraBusqueda value={busqueda} onChangeText={setBusqueda} />
    <FlatList data={canalesFiltrados} ... />
  </View>
);
```

---

## ⭐ Agregar Favoritos

### Crear Context de Favoritos

```typescript
// src/contexto/FavoritosContext.tsx
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritosContext = createContext({});

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const agregarFavorito = async (item) => {
    const nuevos = [...favoritos, item];
    setFavoritos(nuevos);
    await AsyncStorage.setItem('@favoritos', JSON.stringify(nuevos));
  };

  const eliminarFavorito = async (id) => {
    const nuevos = favoritos.filter(f => f.id !== id);
    setFavoritos(nuevos);
    await AsyncStorage.setItem('@favoritos', JSON.stringify(nuevos));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, eliminarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
```

---

## 🎨 Temas Dinámicos

### Crear Sistema de Temas

```typescript
// src/contexto/TemaContext.tsx
import React, { createContext, useState, useContext } from 'react';

const temas = {
  oscuro: {
    primary: '#E50914',
    background: '#141414',
    card: '#2F2F2F',
    text: '#FFFFFF',
  },
  claro: {
    primary: '#E50914',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
  },
};

const TemaContext = createContext({});

export const TemaProvider = ({ children }) => {
  const [tema, setTema] = useState('oscuro');

  return (
    <TemaContext.Provider value={{ colores: temas[tema], cambiarTema: setTema }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTema = () => useContext(TemaContext);
```

---

## 💡 Tips de Personalización

1. **Mantén consistencia**: Usa los mismos colores y estilos en toda la app
2. **Prueba en dispositivos reales**: Los colores se ven diferente en cada pantalla
3. **Accesibilidad**: Asegura buen contraste entre texto y fondo
4. **Performance**: No abuses de sombras y efectos visuales
5. **Responsive**: Prueba en diferentes tamaños de pantalla

---

## 🔧 Herramientas Útiles

- **Paletas de colores**: https://coolors.co
- **Iconos**: https://icons.expo.fyi
- **Fuentes**: https://fonts.google.com
- **Generador de splash**: https://www.appicon.co
- **Gradientes**: https://uigradients.com

---

**¡Haz que la app sea tuya!** 🎨✨

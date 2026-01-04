# IPTV Zona593 - Aplicación React Native + Expo

Aplicación móvil IPTV desarrollada con React Native y Expo para acceder a contenidos de TV en vivo, películas y series.

## 🚀 Características

- ✅ Autenticación con usuario y contraseña (Xtream Codes API)
- ✅ TV en vivo con streaming M3U8/TS
- ✅ Películas VOD
- ✅ Series con temporadas y episodios
- ✅ Reproductor de video nativo con controles
- ✅ Diseño estilo Netflix con tema oscuro
- ✅ Navegación por pestañas (Bottom Tabs)
- ✅ Persistencia de sesión local

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para emulador Android) o dispositivo físico
- Cuenta IPTV válida en http://gzytv.vip:8880

## 🛠️ Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## 📱 Ejecutar la Aplicación

### Modo Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# O directamente en Android
npm run android

# O en iOS (requiere macOS)
npm run ios
```

### Escanear QR con Expo Go

1. Instala Expo Go en tu dispositivo móvil
2. Ejecuta `npm start`
3. Escanea el código QR con la app Expo Go

## 📦 Generar APK para Android

### Opción 1: Build con EAS (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar el proyecto
eas build:configure

# Generar APK
eas build --platform android --profile preview
```

### Opción 2: Build Local

```bash
# Generar APK local
npx expo run:android --variant release
```

El APK se generará en: `android/app/build/outputs/apk/release/app-release.apk`

## 🏗️ Estructura del Proyecto

```
src/
├── pantallas/          # Pantallas de la app
│   ├── LoginPantalla.tsx
│   ├── InicioPantalla.tsx
│   ├── TvEnVivoPantalla.tsx
│   ├── PeliculasPantalla.tsx
│   ├── SeriesPantalla.tsx
│   └── ReproductorPantalla.tsx
├── componentes/        # Componentes reutilizables
│   ├── Boton.tsx
│   ├── Input.tsx
│   └── TarjetaCanal.tsx
├── servicios/          # Servicios API
│   └── iptvServicio.ts
├── navegacion/         # Configuración de navegación
│   └── NavegacionPrincipal.tsx
├── contexto/           # Context API
│   └── AuthContext.tsx
└── utils/              # Utilidades y constantes
    └── constantes.ts
```

## 🔐 Uso de la Aplicación

1. **Login**: Ingresa tu usuario y contraseña de Zona593
2. **Inicio**: Visualiza información de tu cuenta
3. **TV**: Navega por los canales en vivo y reproduce
4. **Películas**: Explora el catálogo de películas
5. **Series**: Accede a series con temporadas y episodios

## 🎨 Personalización

### Cambiar Colores

Edita `src/utils/constantes.ts`:

```typescript
export const COLORS = {
  primary: '#E50914',      // Color principal
  background: '#141414',   // Fondo
  card: '#2F2F2F',        // Tarjetas
  text: '#FFFFFF',        // Texto
  textSecondary: '#B3B3B3', // Texto secundario
  border: '#404040',      // Bordes
};
```

### Cambiar Servidor IPTV

Edita `src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: 'https://tu-servidor.com:puerto',
};
```

## 🐛 Solución de Problemas

### Error de conexión SSL
Si tienes problemas con certificados SSL, verifica que el servidor IPTV tenga un certificado válido.

### Video no reproduce
- Verifica que la URL del stream sea correcta
- Asegúrate de tener conexión a internet estable
- Algunos streams pueden requerir formatos específicos (m3u8, ts, mp4)

### App no compila
```bash
# Limpiar caché
npm start -- --clear

# Reinstalar dependencias
rm -rf node_modules
npm install
```

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👨‍💻 Desarrollado con

- React Native
- Expo SDK
- TypeScript
- React Navigation
- Expo Video
- Axios
- AsyncStorage

## 🌐 API Xtream Codes

La aplicación utiliza la API estándar de Xtream Codes:

- `/player_api.php` - Autenticación y listados
- `/live/` - Streams en vivo
- `/movie/` - Películas VOD
- `/series/` - Series

## 📞 Soporte

Para problemas con credenciales IPTV, contacta a tu proveedor de servicio Zona593.

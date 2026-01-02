# 📱 IPTV Zona593 - Aplicación Móvil

> Aplicación IPTV completa desarrollada en React Native + Expo para Android

## ⚡ Inicio Rápido

```bash
# 1. Entrar al proyecto
cd iptv-app

# 2. Iniciar la app
npm start

# 3. Escanear QR con Expo Go desde tu teléfono
```

## 📦 Generar APK

```bash
# Instalar EAS CLI (solo primera vez)
npm install -g eas-cli

# Login en Expo
eas login

# Generar APK
eas build --platform android --profile preview
```

## ✨ Características

- ✅ Login con usuario y contraseña
- ✅ TV en vivo (canales M3U8/TS)
- ✅ Películas VOD
- ✅ Series con temporadas y episodios
- ✅ Reproductor de video nativo
- ✅ Diseño estilo Netflix
- ✅ Tema oscuro
- ✅ Persistencia de sesión

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** | Guía de inicio en 3 pasos ⚡ |
| **[GUIA_USO.md](GUIA_USO.md)** | Manual de usuario completo 📖 |
| **[INSTRUCCIONES_APK.md](INSTRUCCIONES_APK.md)** | Cómo generar APK 📦 |
| **[README.md](README.md)** | Documentación técnica 👨‍💻 |
| **[PERSONALIZACION.md](PERSONALIZACION.md)** | Personalizar la app 🎨 |
| **[API_XTREAM_CODES.md](API_XTREAM_CODES.md)** | Documentación de API 🔌 |
| **[COMANDOS_RAPIDOS.md](COMANDOS_RAPIDOS.md)** | Referencia de comandos ⚡ |
| **[RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md)** | Resumen ejecutivo 📊 |
| **[INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)** | Índice completo 📚 |

## 🏗️ Estructura del Proyecto

```
src/
├── pantallas/          # 6 pantallas (Login, Inicio, TV, Películas, Series, Reproductor)
├── componentes/        # 3 componentes (Botón, Input, TarjetaCanal)
├── servicios/          # Cliente API Xtream Codes
├── navegacion/         # Configuración de navegación
├── contexto/           # Context de autenticación
└── utils/              # Constantes y configuración
```

## 🔧 Tecnologías

- React Native
- Expo SDK
- TypeScript
- React Navigation
- Expo Video
- Axios
- AsyncStorage

## 📱 Requisitos

- Node.js 16+
- Expo Go (para desarrollo)
- Credenciales IPTV de Zona593
- Android 5.0+ (para APK)

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm start              # Iniciar servidor
npm run android        # Ejecutar en Android
npm start -- --clear   # Limpiar caché

# Generar APK
eas build --platform android --profile preview

# Debug
npx react-native log-android  # Ver logs
```

## 🎨 Personalización

### Cambiar Colores
Edita `src/utils/constantes.ts`:
```typescript
export const COLORS = {
  primary: '#E50914',      // Tu color
  background: '#141414',
  // ...
};
```

### Cambiar Servidor
Edita `src/utils/constantes.ts`:
```typescript
export const IPTV_CONFIG = {
  HOST: 'https://tu-servidor.com:8080',
};
```

## 📞 Soporte

- **Documentación**: Lee los archivos .md en este directorio
- **Problemas técnicos**: Revisa GUIA_USO.md → Solución de Problemas
- **Credenciales IPTV**: Contacta a Zona593

## 📄 Licencia

Código abierto para fines educativos.

---

## 🎯 Próximos Pasos

1. **Para usuarios**: Lee [INICIO_RAPIDO.md](INICIO_RAPIDO.md)
2. **Para desarrolladores**: Lee [README.md](README.md)
3. **Para generar APK**: Lee [INSTRUCCIONES_APK.md](INSTRUCCIONES_APK.md)

---

**¡Disfruta tu app IPTV!** 🎉📺

**Versión**: 1.0.0 | **Fecha**: Enero 2, 2026

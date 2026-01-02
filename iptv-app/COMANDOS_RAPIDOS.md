# ⚡ Comandos Rápidos - IPTV Zona593

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (requiere macOS)
npm run ios

# Ejecutar en Web
npm run web

# Limpiar caché
npm start -- --clear
```

## 📦 Generar APK

### Método Rápido (EAS Build)
```bash
# Instalar EAS CLI (solo primera vez)
npm install -g eas-cli

# Login
eas login

# Generar APK
eas build --platform android --profile preview
```

### Método Local
```bash
# Preparar proyecto
npx expo prebuild

# Generar APK (Linux/Mac)
cd android && ./gradlew assembleRelease

# Generar APK (Windows)
cd android && gradlew.bat assembleRelease
```

## 🔧 Mantenimiento

```bash
# Actualizar dependencias
npm update

# Verificar dependencias desactualizadas
npm outdated

# Reinstalar dependencias
rm -rf node_modules && npm install

# Limpiar todo
rm -rf node_modules android ios .expo
npm install
```

## 🐛 Debug

```bash
# Ver logs de Android
npx react-native log-android

# Ver logs de iOS
npx react-native log-ios

# Inspeccionar con React DevTools
npm install -g react-devtools
react-devtools
```

## 📱 Instalación en Dispositivo

```bash
# Instalar APK vía ADB
adb install android/app/build/outputs/apk/release/app-release.apk

# Ver dispositivos conectados
adb devices

# Desinstalar app
adb uninstall com.zona593.iptv
```

## 🎨 Personalización

```bash
# Cambiar icono y splash screen
# 1. Reemplaza archivos en /assets
# 2. Ejecuta:
npx expo prebuild --clean
```

## 📊 Análisis

```bash
# Analizar tamaño del bundle
npx expo export --platform android
npx react-native-bundle-visualizer

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 🔄 Git

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit: IPTV App"

# Conectar con GitHub
git remote add origin https://github.com/tu-usuario/iptv-zona593.git
git push -u origin main
```

## 📝 Notas Importantes

- Siempre prueba en dispositivo real antes de distribuir
- Guarda tu keystore en lugar seguro
- Incrementa versionCode en cada build
- Usa `--clear` si hay problemas de caché

## 🆘 Comandos de Emergencia

```bash
# Si nada funciona, resetea todo:
rm -rf node_modules
rm -rf .expo
rm -rf android
rm -rf ios
npm install
npm start -- --clear
```

## 📞 Ayuda Rápida

```bash
# Ver ayuda de Expo
npx expo --help

# Ver ayuda de EAS
eas --help

# Ver versión de Expo
npx expo --version
```

---

**Tip**: Guarda este archivo como referencia rápida durante el desarrollo.

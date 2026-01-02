# 📱 Guía Completa para Generar APK

## Método 1: EAS Build (Más Fácil - Recomendado)

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Iniciar Sesión en Expo
```bash
eas login
```
Si no tienes cuenta, créala en: https://expo.dev/signup

### Paso 3: Configurar el Proyecto
```bash
eas build:configure
```

### Paso 4: Generar APK
```bash
eas build --platform android --profile preview
```

Este comando:
- Sube tu código a los servidores de Expo
- Compila la aplicación en la nube
- Genera un APK descargable
- Te proporciona un link para descargar el APK

⏱️ **Tiempo estimado**: 10-20 minutos

### Paso 5: Descargar APK
Una vez completado el build, recibirás un enlace para descargar el APK. También puedes verlo en:
https://expo.dev/accounts/[tu-usuario]/projects/iptv-zona593/builds

---

## Método 2: Build Local (Requiere Android Studio)

### Requisitos Previos
1. Instalar Android Studio
2. Configurar Android SDK
3. Configurar variables de entorno ANDROID_HOME

### Paso 1: Preparar el Proyecto
```bash
npx expo prebuild
```

### Paso 2: Generar APK
```bash
cd android
./gradlew assembleRelease
```

En Windows:
```bash
cd android
gradlew.bat assembleRelease
```

### Paso 3: Ubicación del APK
El APK estará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Método 3: Expo Build (Clásico - Deprecado pero funcional)

```bash
expo build:android -t apk
```

---

## 🔧 Configuración Adicional para Producción

### Firmar el APK (Opcional pero recomendado)

1. Generar keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurar en `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'tu-password'
            keyAlias 'my-key-alias'
            keyPassword 'tu-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

---

## 📦 Instalar APK en Dispositivo Android

### Opción 1: Transferencia Directa
1. Conecta tu dispositivo Android por USB
2. Habilita "Depuración USB" en opciones de desarrollador
3. Copia el APK al dispositivo
4. Abre el APK desde el explorador de archivos
5. Permite "Instalar desde fuentes desconocidas"

### Opción 2: Compartir por Link
1. Sube el APK a Google Drive, Dropbox, etc.
2. Comparte el enlace
3. Descarga desde el dispositivo Android
4. Instala el APK

---

## 🚀 Optimizaciones para Producción

### 1. Reducir Tamaño del APK

En `app.json`, agrega:
```json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true
    }
  }
}
```

### 2. Configurar Versión

En `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

Incrementa `versionCode` con cada nueva versión.

---

## ❓ Solución de Problemas

### Error: "SDK location not found"
Configura ANDROID_HOME:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Error: "Execution failed for task ':app:validateSigningRelease'"
Verifica la configuración de firma del APK.

### APK muy grande
- Usa ProGuard (ver optimizaciones arriba)
- Genera App Bundle en lugar de APK para Google Play

---

## 📊 Comparación de Métodos

| Método | Dificultad | Tiempo | Requiere Android Studio |
|--------|-----------|--------|------------------------|
| EAS Build | ⭐ Fácil | 10-20 min | ❌ No |
| Build Local | ⭐⭐⭐ Difícil | 5-10 min | ✅ Sí |
| Expo Build | ⭐⭐ Media | 15-30 min | ❌ No |

**Recomendación**: Usa EAS Build para la primera vez.

---

## 🎯 Checklist Final

- [ ] Código compilado sin errores
- [ ] Probado en emulador/dispositivo
- [ ] Versión actualizada en app.json
- [ ] Iconos y splash screen configurados
- [ ] Permisos de Android configurados
- [ ] APK generado exitosamente
- [ ] APK instalado y probado en dispositivo real

---

## 📱 Publicar en Google Play Store (Opcional)

1. Crear cuenta de desarrollador en Google Play Console ($25 único pago)
2. Generar App Bundle en lugar de APK:
```bash
eas build --platform android --profile production
```
3. Subir el .aab a Google Play Console
4. Completar información de la app
5. Enviar para revisión

---

## 💡 Consejos Finales

- **Prueba siempre** el APK en un dispositivo real antes de distribuir
- **Guarda tu keystore** en un lugar seguro (necesario para actualizaciones)
- **Documenta las credenciales** de firma
- **Usa versionado semántico** (1.0.0, 1.0.1, 1.1.0, etc.)
- **Mantén backups** de tus builds

¡Listo! Tu aplicación IPTV está lista para ser distribuida. 🎉

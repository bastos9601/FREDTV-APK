# 🔄 Reiniciar App Limpiamente

## Error Persistente: "String cannot be cast to Boolean"

Este error es causado por caché corrupta o props mal interpretadas. Sigue estos pasos:

## ✅ Solución Paso a Paso

### 1. Detener Todo
```bash
# Presiona Ctrl+C en la terminal donde corre npm start
# Cierra completamente Expo Go en tu dispositivo
```

### 2. Limpiar Caché Completa
```bash
# En Windows (PowerShell)
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force node_modules\.cache
Remove-Item -Recurse -Force $env:TEMP\metro-*
Remove-Item -Recurse -Force $env:TEMP\haste-map-*

# O simplemente ejecuta:
npx expo start -c --clear
```

### 3. Reiniciar con Caché Limpia
```bash
npx expo start --clear
```

### 4. En tu Dispositivo
1. Cierra completamente Expo Go (no solo minimizar)
2. Ve a Configuración de Android > Apps > Expo Go
3. Presiona "Forzar detención"
4. Presiona "Borrar caché" (NO borrar datos)
5. Abre Expo Go nuevamente
6. Escanea el QR

## 🔍 Si el Error Persiste

### Opción A: Reinstalar Expo Go
1. Desinstala Expo Go de tu dispositivo
2. Reinstala desde Play Store
3. Escanea el QR nuevamente

### Opción B: Usar Emulador Android
```bash
# Instalar Android Studio
# Crear un emulador
# Luego ejecutar:
npm run android
```

### Opción C: Verificar Código
El error puede estar en props boolean. Verifica que todos los valores boolean sean explícitos:

```typescript
// ❌ MAL
<Component visible />
<Component enabled />

// ✅ BIEN
<Component visible={true} />
<Component enabled={true} />
```

## 🐛 Debugging Avanzado

### Ver Logs Detallados
```bash
# Terminal 1: Iniciar app
npx expo start --clear

# Terminal 2: Ver logs de Android
npx react-native log-android
```

### Verificar Dependencias
```bash
npx expo-doctor
```

### Reinstalar Todo
```bash
# Eliminar todo
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item package-lock.json

# Reinstalar
npm install

# Iniciar limpio
npx expo start --clear
```

## 📱 Alternativa: Generar APK Directamente

Si el error persiste en desarrollo, puedes generar el APK directamente:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Generar APK
eas build --platform android --profile preview --clear-cache
```

El APK compilado no tendrá este problema de caché.

## 🔧 Cambios Realizados en el Código

He actualizado los siguientes archivos para evitar el error:

1. **LoginPantalla.tsx**
   - Removido KeyboardAvoidingView
   - secureTextEntry={true} explícito

2. **NavegacionPrincipal.tsx**
   - headerShown={false} explícito
   - Removido presentation: 'modal'

3. **TarjetaCanal.tsx**
   - activeOpacity={0.7} explícito
   - ellipsizeMode="tail" explícito
   - Validación de logo mejorada

4. **Todas las pantallas con FlatList**
   - showsVerticalScrollIndicator={false} agregado

5. **App.tsx**
   - backgroundColor agregado al StatusBar

## ✅ Checklist de Verificación

- [ ] Servidor detenido (Ctrl+C)
- [ ] Expo Go cerrado completamente
- [ ] Caché limpiada (.expo, node_modules\.cache)
- [ ] Reiniciado con --clear
- [ ] Expo Go reabierto
- [ ] QR escaneado nuevamente

## 💡 Tip Final

Si nada funciona, el problema puede ser específico de tu dispositivo o versión de Android. En ese caso:

1. Prueba en otro dispositivo
2. Usa un emulador
3. Genera el APK directamente con EAS Build

El APK compilado funcionará correctamente incluso si el modo desarrollo tiene problemas.

---

**Ejecuta esto ahora:**
```bash
npx expo start --clear
```

Y escanea el QR nuevamente con Expo Go completamente cerrado y reabierto.

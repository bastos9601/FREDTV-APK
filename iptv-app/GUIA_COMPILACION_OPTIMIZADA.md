# Guía de Compilación Optimizada - FRED TV

## 📱 Compilación para Máximo Rendimiento

### Requisitos Previos
- Node.js 18+ instalado
- EAS CLI instalado: `npm install -g eas-cli`
- Cuenta de Expo (https://expo.dev)
- Android SDK (si compilas localmente)

### Paso 1: Preparar el Proyecto

```bash
# Navegar al directorio del proyecto
cd iptv-app

# Limpiar caché de Metro
rm -rf node_modules/.cache

# Limpiar caché de Expo
expo cache clean

# Reinstalar dependencias (opcional, si hay problemas)
npm install
```

### Paso 2: Compilación Recomendada (EAS Build - Más Fácil)

#### Opción A: Compilación Release (Producción)
```bash
eas build --platform android --profile release
```

**Ventajas:**
- ✅ Compilación en servidores de Expo (más rápido)
- ✅ Optimizaciones automáticas
- ✅ ProGuard habilitado automáticamente
- ✅ APK más pequeño y rápido
- ✅ Mejor para distribución

**Tiempo estimado:** 10-15 minutos

#### Opción B: Compilación Preview (Pruebas)
```bash
eas build --platform android --profile preview
```

**Ventajas:**
- ✅ Más rápido que release
- ✅ Bueno para pruebas
- ✅ Debugging habilitado
- ✅ Tamaño intermedio

**Tiempo estimado:** 5-10 minutos

### Paso 3: Compilación Local (Alternativa)

Si prefieres compilar en tu máquina:

```bash
# Compilación en modo release
expo build:android -t apk --release-channel production

# O con EAS (recomendado)
eas build --platform android --profile release --local
```

**Requisitos:**
- Android SDK instalado
- Java Development Kit (JDK) 11+
- Gradle configurado

### Paso 4: Descargar el APK

Después de la compilación:

1. Ve a https://expo.dev/builds
2. Busca tu compilación
3. Descarga el APK
4. Instala en tu dispositivo Android

```bash
# Instalar directamente desde línea de comandos
adb install -r ruta/al/apk.apk
```

### Paso 5: Verificar Optimizaciones

Después de instalar, verifica que todo funcione correctamente:

```bash
# Ver logs en tiempo real
adb logcat | grep "FRED TV"

# Ver información del APK
aapt dump badging ruta/al/apk.apk
```

## 🚀 Optimizaciones Aplicadas Automáticamente

### En Modo Release
- ✅ ProGuard ofusca y optimiza código
- ✅ Eliminación de código muerto
- ✅ Compresión de recursos
- ✅ Optimización de bytecode
- ✅ Reducción de tamaño del APK (30-50%)
- ✅ Mejora de velocidad (2-3x)

### En Modo Preview
- ✅ Debugging habilitado
- ✅ Optimizaciones parciales
- ✅ Tamaño intermedio
- ✅ Mejor para desarrollo

## 📊 Comparación de Tamaños

| Tipo | Tamaño | Velocidad | Uso |
|------|--------|-----------|-----|
| Debug | 150-200 MB | Lento | Desarrollo |
| Preview | 80-120 MB | Normal | Pruebas |
| Release | 50-80 MB | Rápido | Producción |

## ⚙️ Configuración de Perfiles (eas.json)

La configuración actual en `eas.json` incluye:

```json
{
  "build": {
    "release": {
      "android": {
        "buildType": "release",
        "gradleCommand": ":app:bundleRelease"
      }
    },
    "preview": {
      "android": {
        "buildType": "release"
      }
    }
  }
}
```

## 🔍 Monitoreo de Rendimiento

### Después de Compilar

1. **Instala la app**
   ```bash
   adb install -r app.apk
   ```

2. **Abre Android Profiler**
   - Android Studio → Tools → Profiler
   - Selecciona tu dispositivo
   - Monitorea: CPU, Memoria, Red

3. **Métricas a Verificar**
   - Tiempo de carga inicial: < 3 segundos
   - FPS durante scroll: 60 FPS
   - Uso de memoria: < 200 MB
   - Tiempo de respuesta: < 2 segundos

### Herramientas de Debugging

```bash
# Ver logs de la app
adb logcat -s "FRED TV"

# Ver información del dispositivo
adb shell getprop

# Ver uso de memoria
adb shell dumpsys meminfo com.fredtv.iptv

# Ver procesos en ejecución
adb shell ps | grep fredtv
```

## 🐛 Solución de Problemas

### La compilación falla
```bash
# Limpiar caché
rm -rf node_modules/.cache
expo cache clean

# Reinstalar dependencias
npm install

# Intentar de nuevo
eas build --platform android --profile release
```

### El APK es muy grande
- Asegúrate de compilar en modo release
- Verifica que ProGuard esté habilitado en app.json
- Revisa que no haya assets innecesarios

### La app es lenta
- Verifica que sea compilación release
- Revisa logs con `adb logcat`
- Usa Android Profiler para identificar cuellos de botella
- Considera limpiar caché de la app

### Errores de conexión
- Verifica conexión a internet
- Comprueba que EAS CLI esté actualizado: `npm install -g eas-cli@latest`
- Intenta con `--local` para compilación local

## 📝 Checklist Antes de Compilar

- [ ] Versión actualizada en `app.json`
- [ ] Todos los cambios commiteados en Git
- [ ] Dependencias instaladas (`npm install`)
- [ ] Sin errores de TypeScript (`npm run type-check` si existe)
- [ ] Probado en emulador/dispositivo
- [ ] Caché limpio (`expo cache clean`)
- [ ] Credenciales de Expo válidas (`eas login`)

## 🎯 Próximos Pasos

1. **Compilar APK optimizado**
   ```bash
   eas build --platform android --profile release
   ```

2. **Descargar y probar**
   - Descargar desde https://expo.dev/builds
   - Instalar en dispositivo
   - Verificar rendimiento

3. **Monitorear rendimiento**
   - Usar Android Profiler
   - Revisar logs
   - Recopilar feedback de usuarios

4. **Optimizaciones futuras**
   - Implementar code splitting
   - Comprimir imágenes a WebP
   - Precarga de datos
   - Virtualización de listas

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `adb logcat`
2. Consulta la documentación de Expo: https://docs.expo.dev
3. Revisa el archivo OPTIMIZACIONES.md
4. Contacta al equipo de desarrollo

---

**Última actualización:** Marzo 2026
**Versión:** 2.7.6
**Estado:** ✅ Optimizado y listo para producción

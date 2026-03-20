# 🚀 Compilar APK Optimizado - FRED TV

## Opción Más Fácil (Recomendada)

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Iniciar Sesión en Expo
```bash
eas login
# Ingresa tus credenciales de Expo
```

### Paso 3: Compilar APK Optimizado
```bash
cd iptv-app
eas build --platform android --profile release
```

### Paso 4: Descargar
- Ve a https://expo.dev/builds
- Descarga tu APK compilado
- Instala en tu dispositivo

---

## Compilación Local (Alternativa)

Si prefieres compilar en tu máquina:

```bash
cd iptv-app
expo build:android -t apk --release-channel production
```

**Requisitos:**
- Android SDK instalado
- Java Development Kit (JDK) 11+

---

## Verificar Compilación

```bash
# Ver estado de compilación
eas build:list

# Ver logs de compilación
eas build:view <BUILD_ID>
```

---

## Instalar en Dispositivo

```bash
# Descargar APK
adb install -r ruta/al/apk.apk

# O instalar directamente desde Expo
eas build:view <BUILD_ID> --open
```

---

## Información de la Compilación

- **Versión:** 2.7.7
- **Tamaño esperado:** 60-80 MB
- **Tiempo de compilación:** 10-15 minutos
- **Optimizaciones:** ProGuard, minificación, compresión

---

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| Error de autenticación | Ejecuta `eas login` de nuevo |
| Compilación lenta | Espera, es normal (10-15 min) |
| APK muy grande | Asegúrate de usar `--profile release` |
| Error de dependencias | Ejecuta `npm install` |

---

**¿Necesitas ayuda?** Revisa `GUIA_COMPILACION_OPTIMIZADA.md` para más detalles.

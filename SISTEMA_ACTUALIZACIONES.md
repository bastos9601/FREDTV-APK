# Sistema de Actualizaciones Automáticas - FRED TV

## 📋 Descripción

El sistema verifica automáticamente si hay actualizaciones disponibles comparando la versión actual de la app con la versión publicada en GitHub.

## 🔧 Cómo Funciona

### 1. Archivo `version.json` en GitHub

Debes subir el archivo `version.json` a la raíz de tu repositorio:
```
https://github.com/bastos9601/FREDSPRO-APK/
```

El archivo debe estar en:
```
https://raw.githubusercontent.com/bastos9601/FREDSPRO-APK/main/version.json
```

### 2. Estructura del `version.json`

```json
{
  "version": "2.0.5",
  "downloadUrl": "https://github.com/bastos9601/FREDSPRO-APK/releases/download/v2.0.5/app.apk",
  "releaseNotes": "Nueva versión con mejoras",
  "releaseDate": "2026-01-05"
}
```

### 3. Flujo de Actualización

1. **Usuario abre la app** → Entra a la pantalla de inicio
2. **App verifica versión** → Compara versión local con `version.json` en GitHub
3. **Si hay actualización** → Muestra modal de descarga después de 3 segundos
4. **Usuario descarga** → Toca "INSTALAR AHORA" y descarga el APK

## 📝 Cómo Publicar una Nueva Versión

### Paso 1: Actualizar `app.json`
```json
{
  "expo": {
    "version": "2.0.5",
    "android": {
      "versionCode": 7
    }
  }
}
```

### Paso 2: Compilar el APK
```bash
cd iptv-app
eas build --platform android --profile production
```

### Paso 3: Subir a GitHub Releases
1. Ve a: https://github.com/bastos9601/FREDSPRO-APK/releases
2. Crea un nuevo release con tag `v2.0.5`
3. Sube el archivo `app.apk`

### Paso 4: Actualizar `version.json`
```json
{
  "version": "2.0.5",
  "downloadUrl": "https://github.com/bastos9601/FREDSPRO-APK/releases/download/v2.0.5/app.apk",
  "releaseNotes": "- Corrección de bugs\n- Mejoras de rendimiento\n- Nueva interfaz",
  "releaseDate": "2026-01-05"
}
```

### Paso 5: Commit y Push
```bash
git add version.json
git commit -m "Actualizar a versión 2.0.5"
git push origin main
```

## ✅ Ventajas del Sistema

- ✅ **Automático**: No requiere intervención manual
- ✅ **Inteligente**: Solo muestra el modal si hay actualización
- ✅ **No intrusivo**: Aparece solo cuando es necesario
- ✅ **Fácil de mantener**: Solo actualizar un archivo JSON

## 🧪 Pruebas

### Para probar que funciona:

1. **Versión actual**: 2.0.4 (en `app.json`)
2. **Cambiar `version.json` en GitHub**: 2.0.5
3. **Abrir la app**: Debería mostrar el modal
4. **Cambiar de vuelta**: 2.0.4
5. **Abrir la app**: No debería mostrar el modal

## 🔍 Logs de Depuración

La app muestra logs en consola:
```
Verificación de actualización: {
  versionActual: "2.0.4",
  versionDisponible: "2.0.5",
  hayActualizacion: true
}
¡Actualización disponible! Mostrando modal...
```

## 📱 Comparación de Versiones

El sistema usa **versionado semántico** (x.y.z):
- `2.0.5` > `2.0.4` ✅ Muestra modal
- `2.1.0` > `2.0.4` ✅ Muestra modal
- `2.0.4` = `2.0.4` ❌ No muestra modal
- `2.0.3` < `2.0.4` ❌ No muestra modal

## 🚀 Ejemplo Completo

```
Versión actual en app: 2.0.4
Versión en GitHub: 2.0.5

Usuario abre app → 
  Verifica GitHub → 
    2.0.5 > 2.0.4 → 
      Espera 3 segundos → 
        Muestra modal → 
          Usuario toca "INSTALAR AHORA" → 
            Descarga v2.0.5
```

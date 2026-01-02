# 🎬 Reproductor Profesional V2 - HLS.js

## 🔄 ¿Por qué V2?

La versión V2 usa **HLS.js** en lugar de Video.js porque:

1. **Mejor compatibilidad con streams IPTV** - HLS.js está optimizado para streams .m3u8
2. **Menos errores de formato** - Maneja mejor los diferentes formatos de IPTV
3. **Recuperación automática** - Se recupera automáticamente de errores de red
4. **Menor latencia** - Modo de baja latencia activado
5. **Más ligero** - Menos dependencias y más rápido

## ✨ Características

### 🎮 Funcionalidades

- ✅ Soporte HLS (.m3u8) nativo
- ✅ Soporte MP4 y otros formatos
- ✅ Recuperación automática de errores
- ✅ Modo de baja latencia
- ✅ Controles HTML5 nativos personalizados
- ✅ Interfaz inteligente (auto-ocultar)
- ✅ Manejo robusto de errores
- ✅ Compatible con Safari nativo

### 🔧 Tecnología

- **HLS.js** - Librería especializada en HTTP Live Streaming
- **HTML5 Video** - Controles nativos del navegador
- **React Hooks** - Manejo de estado moderno

## 🎯 Ventajas sobre V1

| Característica | V1 (Video.js) | V2 (HLS.js) |
|---------------|---------------|-------------|
| Compatibilidad IPTV | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Recuperación de errores | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Latencia | Media | Baja |
| Tamaño | ~200KB | ~100KB |
| Configuración | Compleja | Simple |
| Errores de formato | Frecuentes | Raros |

## 🚀 Cómo Funciona

### Para Streams HLS (.m3u8)

1. Detecta que es un stream HLS
2. Verifica si el navegador soporta HLS.js
3. Carga el manifest
4. Inicia la reproducción automáticamente
5. Maneja errores y se recupera automáticamente

### Para Videos Directos (MP4, etc.)

1. Detecta que es un video directo
2. Usa el reproductor HTML5 nativo
3. Carga y reproduce el video

### Para Safari

Safari tiene soporte HLS nativo, así que:
1. Detecta Safari
2. Usa el reproductor nativo
3. No necesita HLS.js

## 🐛 Manejo de Errores

### Errores de Red
- **Acción**: Reintenta automáticamente
- **Usuario**: Ve "Buffering..."
- **Recuperación**: Automática

### Errores de Medios
- **Acción**: Intenta recuperar el stream
- **Usuario**: Ve mensaje de error
- **Recuperación**: Automática o manual

### Errores Fatales
- **Acción**: Muestra error descriptivo
- **Usuario**: Puede reintentar o volver
- **Recuperación**: Manual

## 📊 Tipos de Error

1. **Error de red** - Problema de conexión
2. **Error de medios** - Problema con el formato
3. **Error fatal** - No se puede reproducir

## 🎨 Personalización

### Cambiar configuración de HLS

Edita `ReproductorProfesionalV2.tsx`:

```typescript
const hls = new Hls({
  enableWorker: true,        // Usar Web Worker
  lowLatencyMode: true,      // Baja latencia
  backBufferLength: 90,      // Buffer trasero
  maxBufferLength: 30,       // Buffer máximo
  maxMaxBufferLength: 600,   // Buffer máximo absoluto
});
```

### Cambiar tiempo de auto-ocultar

```typescript
timeoutRef.current = setTimeout(() => {
  if (isPlaying) {
    setShowControls(false);
  }
}, 3000); // Cambia 3000 a los ms que quieras
```

## 🔍 Debugging

### Ver logs en consola

Abre DevTools (F12) y busca:
```
Manifest cargado, iniciando reproducción...
Video listo para reproducir
Reproduciendo...
```

### Errores comunes

**"HLS Error: NETWORK_ERROR"**
- Problema de conexión
- Verifica tu internet
- El reproductor reintentará automáticamente

**"HLS Error: MEDIA_ERROR"**
- Problema con el formato del stream
- El reproductor intentará recuperarse
- Si persiste, prueba otro canal

**"Tu navegador no soporta HLS"**
- Usa Chrome, Firefox o Safari
- Actualiza tu navegador

## 💡 Consejos

1. **Para mejor rendimiento**: Usa Chrome o Firefox
2. **Para TV en vivo**: La primera carga puede tardar unos segundos
3. **Si hay buffering**: Espera unos segundos, es normal
4. **Si no carga**: Haz clic en "Reintentar"
5. **Para móviles**: Usa pantalla completa

## 🆚 Cuándo Usar Cada Versión

### Usa V2 (HLS.js) si:
- ✅ Reproduces streams IPTV (.m3u8)
- ✅ Tienes problemas con V1
- ✅ Quieres mejor rendimiento
- ✅ Necesitas recuperación automática

### Usa V1 (Video.js) si:
- ✅ Necesitas controles muy personalizados
- ✅ Quieres selector de calidad manual
- ✅ Reproduces principalmente MP4
- ✅ Necesitas plugins específicos de Video.js

## 🔮 Mejoras Futuras

- [ ] Selector de calidad manual
- [ ] Estadísticas de reproducción
- [ ] DVR (pausar TV en vivo)
- [ ] Picture-in-Picture
- [ ] Subtítulos
- [ ] Múltiples pistas de audio

## 📱 Compatibilidad

### Navegadores

- ✅ Chrome 90+ (HLS.js)
- ✅ Firefox 88+ (HLS.js)
- ✅ Safari 14+ (Nativo)
- ✅ Edge 90+ (HLS.js)
- ✅ Opera 76+ (HLS.js)

### Dispositivos

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Móviles (Android, iOS)
- ✅ Tablets
- ✅ Smart TVs con navegador moderno

## 🎓 Recursos

- [HLS.js Documentation](https://github.com/video-dev/hls.js/)
- [HLS Specification](https://datatracker.ietf.org/doc/html/rfc8216)
- [HTML5 Video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

## ✅ Estado Actual

- ✅ Implementado y funcionando
- ✅ Manejo de errores robusto
- ✅ Recuperación automática
- ✅ Compatible con todos los navegadores modernos
- ✅ Optimizado para IPTV

**El reproductor V2 es ahora el predeterminado y debería funcionar sin problemas con streams IPTV.**

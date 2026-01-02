# 🐛 Errores del Reproductor - Guía de Solución

## 📋 Errores Comunes

### 1. "NotSupportedError: Failed to load because no supported source"

**Causa**: El navegador no puede reproducir el formato del video.

**Razones**:
- El stream usa un códec no soportado
- El formato del contenedor no es compatible
- El servidor no está enviando los headers correctos
- El stream está corrupto o mal formateado

**Soluciones**:
1. **Haz clic en "Reproductor Nativo"** - Intenta con el reproductor HTML5 nativo
2. **Prueba otro navegador** - Chrome suele tener mejor compatibilidad
3. **Usa la app móvil** - Tiene mejor soporte para formatos IPTV
4. **Verifica el canal** - Puede estar offline o con problemas

### 2. "Autoplay bloqueado, mostrando botón manual"

**Causa**: El navegador bloquea el autoplay por políticas de seguridad.

**Solución**: 
- Haz clic en el botón de play grande que aparece
- Es normal y esperado en navegadores modernos

### 3. "Error de red. Reintentando conexión..."

**Causa**: Problema de conectividad.

**Soluciones**:
1. Verifica tu conexión a internet
2. Espera unos segundos (el reproductor reintenta automáticamente)
3. Recarga la página
4. Verifica que el servidor IPTV esté funcionando

### 4. "Error de medios. Recuperando stream..."

**Causa**: Problema con el formato o códec del stream.

**Soluciones**:
1. Espera (el reproductor intenta recuperarse automáticamente)
2. Si persiste, haz clic en "Reintentar"
3. Prueba con "Reproductor Nativo"
4. Intenta otro canal

### 5. "No se pudo cargar el manifest del stream"

**Causa**: El archivo .m3u8 no está disponible.

**Razones**:
- El canal está offline
- URL incorrecta
- Servidor no responde
- Credenciales expiradas

**Soluciones**:
1. Verifica que el canal esté activo
2. Prueba otro canal
3. Verifica tus credenciales
4. Contacta al proveedor IPTV

### 6. "Error al analizar el manifest. Formato no válido"

**Causa**: El archivo .m3u8 está mal formateado.

**Soluciones**:
1. Prueba con "Reproductor Nativo"
2. Reporta el problema al proveedor IPTV
3. Intenta otro canal

### 7. "Error al cargar fragmentos del video. Conexión inestable"

**Causa**: Problemas de red intermitentes.

**Soluciones**:
1. Verifica tu velocidad de internet (mínimo 5 Mbps)
2. Cierra otras aplicaciones que usen internet
3. Acércate al router WiFi
4. Usa conexión por cable si es posible

## 🔧 Herramientas de Diagnóstico

### Logs en Consola

Abre DevTools (F12) y busca:

```
📊 Análisis de URL:
  - URL completa: http://...
  - Tipo detectado: { isHLS: true, ... }
```

### Códigos de Error HTML5 Video

- **Error 1**: MEDIA_ERR_ABORTED - Carga abortada
- **Error 2**: MEDIA_ERR_NETWORK - Error de red
- **Error 3**: MEDIA_ERR_DECODE - Error de decodificación
- **Error 4**: MEDIA_ERR_SRC_NOT_SUPPORTED - Formato no soportado

### Tipos de Error HLS.js

- **NETWORK_ERROR**: Problema de red
- **MEDIA_ERROR**: Problema con el formato
- **MUX_ERROR**: Problema con el multiplexado
- **OTHER_ERROR**: Otros errores

## 🎯 Flujo de Solución

```
Error detectado
    ↓
¿Es error de red?
    ├─ Sí → Reintenta automáticamente
    └─ No → ¿Es error de medios?
            ├─ Sí → Intenta recuperar
            └─ No → Muestra error al usuario
                    ↓
                Usuario puede:
                    1. Reintentar
                    2. Usar reproductor nativo
                    3. Volver
```

## 💡 Botón "Reproductor Nativo"

### ¿Qué hace?
Cambia de HLS.js al reproductor HTML5 nativo del navegador.

### ¿Cuándo usarlo?
- Cuando HLS.js no puede reproducir el stream
- Cuando hay errores de formato
- Como último recurso antes de volver

### ¿Cómo funciona?
1. Destruye la instancia de HLS.js
2. Asigna la URL directamente al elemento `<video>`
3. Intenta reproducir con el códec nativo del navegador

## 📊 Compatibilidad de Formatos

### Navegadores Modernos

| Formato | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| HLS (.m3u8) | ✅ (HLS.js) | ✅ (HLS.js) | ✅ (Nativo) | ✅ (HLS.js) |
| MP4 | ✅ | ✅ | ✅ | ✅ |
| WebM | ✅ | ✅ | ❌ | ✅ |
| TS | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

### Códecs Soportados

**Video**:
- H.264 (AVC) - ✅ Universal
- H.265 (HEVC) - ⚠️ Limitado
- VP8 - ✅ Chrome, Firefox
- VP9 - ✅ Chrome, Firefox

**Audio**:
- AAC - ✅ Universal
- MP3 - ✅ Universal
- Opus - ✅ Chrome, Firefox

## 🔍 Verificar URL del Stream

### En la Consola
```javascript
console.log('URL:', url);
```

### Probar Manualmente
1. Copia la URL de la consola
2. Pégala en una nueva pestaña
3. Debería descargar o reproducir el archivo

### URL Correctas

**TV en Vivo (HLS)**:
```
http://zona593.live:8080/live/usuario/password/12345.m3u8
```

**Películas**:
```
http://zona593.live:8080/movie/usuario/password/12345.mp4
```

**Series**:
```
http://zona593.live:8080/series/usuario/password/12345.mp4
```

## 🚨 Errores Críticos

### "No se pudo reproducir con ningún método"

**Significa**: Ni HLS.js ni el reproductor nativo pueden reproducir el stream.

**Causas**:
- Formato completamente incompatible
- Stream corrupto
- Códec no soportado por el navegador

**Soluciones**:
1. Usa la app móvil
2. Prueba otro navegador
3. Reporta el problema al proveedor
4. Intenta otro canal

## 📱 Comparación: Web vs Móvil

| Aspecto | Web | Móvil |
|---------|-----|-------|
| Formatos | Limitados | Más amplio |
| Códecs | Depende del navegador | Nativo |
| Recuperación | Automática | Automática |
| Fallback | Reproductor nativo | N/A |
| Compatibilidad | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## ✅ Checklist de Solución

Antes de reportar un problema:

- [ ] ¿Revisaste la consola del navegador?
- [ ] ¿Probaste con "Reintentar"?
- [ ] ¿Probaste con "Reproductor Nativo"?
- [ ] ¿Funciona en otro navegador?
- [ ] ¿Funciona en la app móvil?
- [ ] ¿Probaste otro canal?
- [ ] ¿Tu internet funciona correctamente?
- [ ] ¿El servidor IPTV está online?

## 🆘 Obtener Ayuda

Si necesitas ayuda, proporciona:

1. **Logs de la consola** (F12 → Console)
2. **URL del stream** (sin credenciales)
3. **Navegador y versión**
4. **Sistema operativo**
5. **Tipo de contenido** (TV, película, serie)
6. **Mensaje de error exacto**

## 🎓 Recursos

- [HLS.js Documentation](https://github.com/video-dev/hls.js/)
- [HTML5 Video Errors](https://developer.mozilla.org/en-US/docs/Web/API/MediaError)
- [Browser Compatibility](https://caniuse.com/)

---

**Con estas mejoras, el reproductor ahora proporciona información detallada sobre errores y múltiples opciones de recuperación.**

# 📺 Solución: TV en Vivo

## 🔧 Mejoras Implementadas

### 1. Cambio de formato por defecto
- **Antes**: `.ts` (Transport Stream)
- **Ahora**: `.m3u8` (HLS - HTTP Live Streaming)
- **Razón**: HLS es más compatible con navegadores web

### 2. Detección automática de formato
El reproductor ahora detecta automáticamente:
- `.m3u8` → Usa HLS.js
- `.ts` → Intenta convertir a `.m3u8`
- `.mp4` → Usa reproductor HTML5 nativo

### 3. Recuperación automática de errores
- **Error de red**: Reintenta automáticamente
- **Error de medios**: Intenta recuperar el stream
- **Error fatal**: Muestra mensaje y permite reintentar

### 4. Botón de play manual
Si el autoplay falla (por políticas del navegador), aparece un botón grande de play.

## 🎯 Cómo Funciona Ahora

### Para TV en Vivo:

1. **Genera URL con .m3u8**
   ```
   http://zona593.live:8080/live/usuario/password/12345.m3u8
   ```

2. **HLS.js carga el manifest**
   - Descarga la lista de segmentos
   - Prepara el buffer
   - Inicia reproducción

3. **Reproducción continua**
   - Descarga segmentos automáticamente
   - Maneja buffering
   - Se recupera de errores

## 🐛 Solución de Problemas

### Problema: "Error de red"

**Causa**: No se puede conectar al servidor IPTV

**Soluciones**:
1. Verifica tu conexión a internet
2. Verifica que el servidor IPTV esté funcionando
3. Prueba desde la app móvil
4. Espera unos segundos, el reproductor reintentará automáticamente

### Problema: "Error de medios"

**Causa**: Problema con el formato del stream

**Soluciones**:
1. El reproductor intentará recuperarse automáticamente
2. Si persiste, haz clic en "Reintentar"
3. Prueba con otro canal
4. Verifica que el canal esté activo en el servidor

### Problema: Pantalla negra con botón de play

**Causa**: El navegador bloqueó el autoplay

**Solución**:
1. Haz clic en el botón de play grande
2. El video debería iniciar normalmente

### Problema: Buffering constante

**Causa**: Conexión lenta o servidor sobrecargado

**Soluciones**:
1. Verifica tu velocidad de internet (mínimo 5 Mbps)
2. Cierra otras pestañas/aplicaciones
3. Prueba en otro momento
4. Prueba con otro canal

### Problema: "Tu navegador no soporta HLS"

**Causa**: Navegador muy antiguo

**Solución**:
1. Actualiza tu navegador
2. Usa Chrome, Firefox o Safari
3. Usa la app móvil como alternativa

## 📊 Logs de Depuración

Abre la consola del navegador (F12) y busca:

### ✅ Funcionando correctamente:
```
Cargando URL: http://...
Tipo de stream: { isHLS: true, isTS: false, isMP4: false }
Usando HLS.js
✅ Manifest cargado, iniciando reproducción...
✅ Reproducción iniciada
```

### ❌ Con errores:
```
❌ HLS Error: NETWORK_ERROR
Error de red, reintentando...
```

## 🔍 Verificar URL del Stream

Para verificar que la URL es correcta:

1. Abre la consola (F12)
2. Busca: `Cargando URL:`
3. Copia la URL
4. Pégala en una nueva pestaña
5. Debería descargar un archivo `.m3u8`

Si no descarga nada:
- El servidor no está respondiendo
- Las credenciales son incorrectas
- El canal no existe

## 🎬 Formatos de URL

### TV en Vivo (Correcto):
```
http://zona593.live:8080/live/usuario/password/12345.m3u8
```

### Películas:
```
http://zona593.live:8080/movie/usuario/password/12345.mp4
```

### Series:
```
http://zona593.live:8080/series/usuario/password/12345.mp4
```

## 🚀 Optimizaciones Aplicadas

### Configuración de HLS.js:
```javascript
{
  enableWorker: true,        // Usa Web Worker (mejor rendimiento)
  lowLatencyMode: true,      // Baja latencia
  backBufferLength: 90,      // Buffer trasero de 90 segundos
  maxBufferLength: 30,       // Buffer máximo de 30 segundos
  maxMaxBufferLength: 600,   // Buffer máximo absoluto
  maxBufferSize: 60MB,       // Tamaño máximo del buffer
  maxBufferHole: 0.5,        // Tolerancia de huecos en el buffer
}
```

## 💡 Consejos

1. **Primera carga**: Puede tardar 5-10 segundos
2. **Buffering inicial**: Es normal, espera unos segundos
3. **Cambio de canal**: Cierra el reproductor y abre otro canal
4. **Mejor rendimiento**: Usa Chrome o Firefox
5. **Conexión lenta**: Espera más tiempo para el buffering

## 🔄 Flujo de Recuperación de Errores

```
Error de Red
    ↓
Espera 1 segundo
    ↓
Reintenta carga
    ↓
¿Funciona?
    ├─ Sí → Continúa reproducción
    └─ No → Muestra error al usuario
```

```
Error de Medios
    ↓
Intenta recuperar
    ↓
Espera 2 segundos
    ↓
¿Funciona?
    ├─ Sí → Continúa reproducción
    └─ No → Muestra error al usuario
```

## 📱 Comparación: Web vs Móvil

| Característica | Web | Móvil |
|---------------|-----|-------|
| Formato | .m3u8 (HLS) | .ts o .m3u8 |
| Reproductor | HLS.js | expo-video |
| Autoplay | Limitado | Siempre |
| Recuperación | Automática | Automática |
| Buffering | Más frecuente | Menos frecuente |

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] ¿Funciona en la app móvil?
- [ ] ¿Tienes buena conexión a internet?
- [ ] ¿El servidor IPTV está funcionando?
- [ ] ¿Probaste con otro canal?
- [ ] ¿Revisaste la consola del navegador?
- [ ] ¿Probaste en otro navegador?
- [ ] ¿Hiciste clic en "Reintentar"?

## 🎯 Resultado Esperado

Después de estas mejoras:
- ✅ TV en vivo debería cargar en 5-10 segundos
- ✅ Recuperación automática de errores de red
- ✅ Botón de play manual si autoplay falla
- ✅ Logs detallados en consola
- ✅ Mejor compatibilidad con streams IPTV

---

**Si aún tienes problemas, comparte los logs de la consola (F12 → Console)**

# 🎬 Reproductor Profesional - FRED TV Web

## ✨ Características

### 🎮 Controles Avanzados

1. **Controles Personalizados**
   - Play/Pause
   - Control de volumen
   - Barra de progreso
   - Tiempo actual y duración
   - Pantalla completa
   - Velocidad de reproducción (0.5x, 1x, 1.5x, 2x)

2. **Interfaz Inteligente**
   - Los controles se ocultan automáticamente después de 3 segundos
   - Aparecen al mover el mouse
   - Header con botón de volver y título
   - Badge de "EN VIVO" para streams

3. **Manejo de Errores**
   - Detección automática de errores
   - Mensajes descriptivos según el tipo de error
   - Botón de reintentar
   - Opción de volver

### 📺 Formatos Soportados

- **HLS** (.m3u8) - HTTP Live Streaming
- **MPEG-DASH** (.mpd) - Dynamic Adaptive Streaming
- **MP4** (.mp4) - Video estándar
- **MPEG-TS** (.ts) - Transport Stream

### 🎨 Diseño

- **Tema oscuro** personalizado
- **Botón de play** grande y centrado
- **Controles** con gradientes suaves
- **Animaciones** fluidas
- **Responsive** - se adapta a cualquier pantalla

### 🔧 Tecnología

- **Video.js** - Reproductor HTML5 profesional
- **videojs-contrib-quality-levels** - Selector de calidad
- **videojs-http-source-selector** - Selector de fuentes HTTP

## 🚀 Uso

El reproductor se activa automáticamente cuando:
1. Haces clic en un canal de TV en vivo
2. Seleccionas una película
3. Eliges un episodio de serie

## 🎯 Funcionalidades

### Controles de Teclado

- **Espacio** - Play/Pause
- **←/→** - Retroceder/Avanzar 5 segundos
- **↑/↓** - Subir/Bajar volumen
- **F** - Pantalla completa
- **M** - Silenciar/Activar sonido
- **0-9** - Saltar al % del video

### Controles Táctiles (Móvil)

- **Tap** - Mostrar/Ocultar controles
- **Doble tap** - Play/Pause
- **Deslizar horizontal** - Avanzar/Retroceder
- **Deslizar vertical (izquierda)** - Ajustar brillo
- **Deslizar vertical (derecha)** - Ajustar volumen

## 🐛 Solución de Problemas

### El video no carga

**Posibles causas:**
1. URL inválida o expirada
2. Formato no soportado
3. Problema de red
4. Servidor IPTV no responde

**Soluciones:**
1. Haz clic en "Reintentar"
2. Verifica tu conexión a internet
3. Prueba con otro canal/película
4. Verifica que el servidor IPTV esté funcionando

### El video se congela

**Soluciones:**
1. Espera unos segundos (puede estar buffering)
2. Reduce la calidad del video
3. Verifica tu velocidad de internet
4. Recarga la página

### No hay sonido

**Soluciones:**
1. Verifica que el volumen no esté en 0
2. Verifica que el video no esté silenciado
3. Verifica el volumen del sistema
4. Prueba con otro navegador

### Pantalla negra

**Soluciones:**
1. Espera unos segundos (puede estar cargando)
2. Haz clic en "Reintentar"
3. Verifica la consola del navegador (F12)
4. Prueba con otro canal/película

## 📊 Códigos de Error

- **Error 1** - Carga del video abortada
- **Error 2** - Error de red al cargar el video
- **Error 3** - Error al decodificar el video
- **Error 4** - Formato de video no soportado

## 🎨 Personalización

### Cambiar colores

Edita `ReproductorProfesional.css`:

```css
.vjs-theme-fantasy {
  --vjs-theme-fantasy--primary: #E50914; /* Color principal */
  --vjs-theme-fantasy--secondary: #fff;  /* Color secundario */
}
```

### Cambiar tiempo de ocultación de controles

Edita `ReproductorProfesional.tsx`:

```typescript
timeoutRef.current = setTimeout(() => {
  if (playerRef.current && !playerRef.current.paused()) {
    setShowControls(false);
  }
}, 3000); // Cambia 3000 a los milisegundos que quieras
```

## 🔮 Mejoras Futuras

- [ ] Picture-in-Picture
- [ ] Subtítulos
- [ ] Múltiples pistas de audio
- [ ] Marcadores/Favoritos
- [ ] Historial de reproducción
- [ ] Reanudar desde donde se quedó
- [ ] Miniaturas en la barra de progreso
- [ ] Estadísticas de reproducción
- [ ] Control parental
- [ ] Modo cine (oscurecer alrededor)

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Dispositivos

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Móviles (Android, iOS)
- ✅ Tablets
- ✅ Smart TVs (con navegador)

## 🎓 Comparación con Reproductor Básico

| Característica | Básico | Profesional |
|---------------|--------|-------------|
| Controles HTML5 | ✅ | ✅ |
| Controles personalizados | ❌ | ✅ |
| Selector de calidad | ❌ | ✅ |
| Velocidad de reproducción | ❌ | ✅ |
| Manejo de errores | Básico | Avanzado |
| HLS/DASH | Limitado | ✅ |
| Interfaz inteligente | ❌ | ✅ |
| Temas personalizados | ❌ | ✅ |
| Atajos de teclado | Básicos | Completos |
| Responsive | ✅ | ✅ |

## 💡 Consejos

1. **Para mejor rendimiento**: Usa Chrome o Edge
2. **Para TV en vivo**: Mantén actualizado el navegador
3. **Para películas**: Espera a que cargue completamente
4. **Para series**: Usa la lista de reproducción automática
5. **Para móviles**: Usa pantalla completa para mejor experiencia

## 🆘 Soporte

Si tienes problemas:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Comparte el error para obtener ayuda

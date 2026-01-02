# 📺 Selector de Episodios en el Reproductor

## ✨ Nueva Funcionalidad

Ahora el reproductor de series incluye un **botón de episodios** que permite:
- Ver la lista completa de episodios de la temporada actual
- Cambiar de episodio sin salir del reproductor
- Ver qué episodio se está reproduciendo actualmente

## 🎯 Características

### 1. Botón de Episodios
- **Ubicación**: Header del reproductor, al lado derecho
- **Icono**: ☰ Episodios
- **Visibilidad**: Solo aparece cuando hay episodios disponibles
- **Comportamiento**: Se muestra/oculta con los controles del reproductor

### 2. Lista de Episodios
- **Diseño**: Modal overlay con fondo oscuro
- **Contenido**: 
  - Título: "Episodios - Temporada X"
  - Lista scrolleable de episodios
  - Botón de cerrar (✕)
- **Información por episodio**:
  - Número de episodio (en círculo rojo)
  - Título del episodio
  - Duración
  - Indicador "▶ Reproduciendo" para el episodio actual

### 3. Episodio Actual
- **Resaltado**: Fondo rojo translúcido
- **Borde**: Rojo (#E50914)
- **Número**: Círculo blanco con número rojo
- **Indicador**: "▶ Reproduciendo"

### 4. Cambio de Episodio
- **Acción**: Clic en cualquier episodio
- **Comportamiento**:
  1. Detiene el video actual
  2. Destruye la instancia de HLS.js
  3. Navega al nuevo episodio
  4. Recarga la página para iniciar el nuevo video

## 🎨 Diseño

### Modal de Episodios
```css
- Fondo: rgba(0, 0, 0, 0.8)
- Contenedor: #141414
- Max-width: 600px
- Max-height: 80vh
- Border-radius: 10px
- Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8)
```

### Item de Episodio
```css
- Background: #2F2F2F
- Hover: #404040 + translateX(5px)
- Active: rgba(229, 9, 20, 0.2) + border rojo
- Padding: 15px
- Border-radius: 8px
```

### Número de Episodio
```css
- Normal: Círculo rojo (#E50914)
- Activo: Círculo blanco con número rojo
- Tamaño: 40x40px
- Font-size: 16px
```

## 🔧 Implementación Técnica

### Datos Pasados al Reproductor
```typescript
{
  url: string,              // URL del episodio actual
  titulo: string,           // Título completo
  serie: SerieInfo,         // Información de la serie
  temporada: string,        // Número de temporada
  episodios: Array<{        // Lista de episodios
    id: string,
    episode_num: number,
    title: string,
    duration: string,
    url: string,
    titulo: string
  }>,
  episodioActual: number    // Número del episodio actual
}
```

### Función de Cambio de Episodio
```typescript
const cambiarEpisodio = (episodio: any) => {
  // 1. Detener video actual
  if (videoRef.current) {
    videoRef.current.pause();
  }
  
  // 2. Destruir HLS.js
  if (hlsRef.current) {
    hlsRef.current.destroy();
    hlsRef.current = null;
  }

  // 3. Navegar al nuevo episodio
  navigate('/reproductor', {
    replace: true,
    state: { /* nuevo episodio */ }
  });

  // 4. Recargar página
  window.location.reload();
};
```

## 📱 Responsive

### Desktop (> 768px)
- Modal: 600px de ancho
- Episodios: Padding 15px
- Números: 40x40px
- Font-size: 16px

### Móvil (< 768px)
- Modal: 90vh de alto
- Episodios: Padding 12px
- Números: 35x35px
- Font-size: 14px
- Botón episodios: Más compacto

## 🎬 Flujo de Usuario

### Ver Lista de Episodios
```
Reproductor → [Mover mouse] → [Clic en "☰ Episodios"] → Modal se abre
```

### Cambiar de Episodio
```
Modal abierto → [Clic en episodio] → Video se detiene → Nuevo episodio carga
```

### Cerrar Lista
```
Modal abierto → [Clic en ✕] → Modal se cierra
Modal abierto → [Clic fuera] → Modal se cierra
```

## 💡 Características Especiales

### 1. Auto-ocultar con Controles
El botón de episodios se oculta automáticamente junto con los controles del reproductor después de 3 segundos de inactividad.

### 2. Scroll Personalizado
La lista de episodios tiene scroll personalizado con:
- Barra delgada (8px)
- Color rojo (#E50914)
- Fondo gris (#2F2F2F)

### 3. Prevención de Propagación
Clic dentro del modal no lo cierra, solo clic fuera o en el botón ✕.

### 4. Recarga Automática
Al cambiar de episodio, la página se recarga automáticamente para asegurar que el nuevo video cargue correctamente.

## 🐛 Manejo de Errores

### Sin Episodios
Si no hay episodios disponibles, el botón no se muestra.

### Episodio No Encontrado
Si el episodio no existe, se mantiene en el episodio actual.

### Error de Carga
Si hay error al cargar el nuevo episodio, se muestra el mensaje de error estándar del reproductor.

## 🎯 Casos de Uso

### 1. Ver Siguiente Episodio
```
Usuario termina episodio 1 → Abre lista → Selecciona episodio 2 → Reproduce
```

### 2. Saltar Episodios
```
Usuario en episodio 1 → Abre lista → Selecciona episodio 5 → Reproduce
```

### 3. Revisar Episodio Anterior
```
Usuario en episodio 3 → Abre lista → Selecciona episodio 2 → Reproduce
```

### 4. Ver Qué Episodio Está Reproduciendo
```
Usuario olvidó el episodio → Abre lista → Ve "▶ Reproduciendo" → Cierra lista
```

## ✅ Ventajas

1. **No salir del reproductor**: Cambio rápido entre episodios
2. **Contexto visual**: Ve todos los episodios disponibles
3. **Navegación fácil**: Un solo clic para cambiar
4. **Indicador claro**: Sabe qué episodio está viendo
5. **Diseño limpio**: No interfiere con la reproducción

## 🔮 Mejoras Futuras

- [ ] Reproducción automática del siguiente episodio
- [ ] Miniaturas de episodios
- [ ] Marcar episodios vistos
- [ ] Botones "Anterior" y "Siguiente"
- [ ] Atajos de teclado (← →)
- [ ] Continuar desde donde se quedó
- [ ] Descargar episodio
- [ ] Compartir episodio

## 📊 Comparación

| Característica | Antes | Ahora |
|---------------|-------|-------|
| Cambiar episodio | Volver → Detalles → Seleccionar | Botón → Seleccionar |
| Pasos | 3 | 2 |
| Tiempo | ~10 segundos | ~2 segundos |
| Contexto | Se pierde | Se mantiene |
| Experiencia | Interrumpida | Fluida |

## 🎉 Resultado

Ahora tienes una experiencia de visualización de series mucho más fluida y profesional, similar a Netflix, donde puedes cambiar de episodio sin salir del reproductor.

---

**¡La funcionalidad de selector de episodios está completa!**

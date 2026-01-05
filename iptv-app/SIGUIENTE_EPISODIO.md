# Funcionalidad de Siguiente Episodio y Modal de Episodios

## 1. Siguiente Episodio Automático

### Descripción
Se ha implementado una funcionalidad que muestra automáticamente una tarjeta de "Siguiente episodio" cuando un capítulo de serie está por terminar.

### Características

#### Detección Automática
- La tarjeta aparece cuando faltan **30 segundos** para que termine el episodio actual
- Solo se muestra cuando se está reproduciendo una serie (no en películas ni TV en vivo)

#### Información Mostrada
- Título del siguiente episodio
- Número de episodio y temporada
- Cuenta regresiva en tiempo real

#### Comportamiento
- **Auto-reproducción**: Cuando la cuenta regresiva llega a 0, automáticamente comienza el siguiente episodio
- **Reproducción manual**: Botón "Reproducir ahora" para saltar inmediatamente al siguiente episodio
- **Cancelar**: Botón X para cerrar la tarjeta y continuar viendo los créditos

#### Soporte de Temporadas
- Si es el último episodio de una temporada, automáticamente detecta y ofrece el primer episodio de la siguiente temporada
- Si no hay más episodios, simplemente no muestra la tarjeta

### Ubicación Visual
La tarjeta aparece en la **esquina inferior derecha** del reproductor, con:
- Fondo oscuro semi-transparente
- Borde de color primario (azul)
- Diseño moderno y no intrusivo

---

## 2. Modal de Episodios Estilo Netflix

### Descripción
Modal profesional para seleccionar episodios directamente desde el reproductor, sin necesidad de salir de la pantalla de reproducción.

### Características

#### Diseño Profesional
- Modal deslizante desde abajo (slide animation)
- Fondo semi-transparente oscuro
- Bordes redondeados superiores
- Ocupa el 85% de la pantalla

#### Selector de Temporadas
- Scroll horizontal con todas las temporadas disponibles
- Botones con estilo pill (redondeados)
- Temporada activa resaltada con color primario
- Indicador visual claro de la temporada seleccionada

#### Lista de Episodios
- Scroll vertical suave
- Cada episodio muestra:
  - Número del episodio en círculo destacado
  - Título del episodio
  - Duración (si está disponible)
  - Descripción breve (2 líneas máximo)
  - Icono de play o checkmark
- **Episodio actual** resaltado con:
  - Borde de color primario
  - Fondo con tinte azul
  - Badge "Reproduciendo" con icono
  - Icono de checkmark en lugar de play

#### Interacción
- Tap en cualquier episodio para reproducirlo inmediatamente
- Cambio de temporada instantáneo
- Botón X grande para cerrar el modal
- Animación suave al abrir/cerrar

#### Rendimiento
- Carga asíncrona de episodios
- Indicador de carga mientras obtiene datos
- Manejo de errores con alertas

### Acceso
- Botón de lista (icono de 3 líneas) en el header del reproductor
- Solo visible cuando se reproduce una serie

### Ventajas sobre la Navegación Anterior
- No interrumpe la reproducción
- Cambio de episodio más rápido
- Experiencia más fluida tipo Netflix/Disney+
- No pierde el contexto del reproductor
- Mantiene el estado de reproducción

---

## 3. Rotación Automática a Horizontal

### Descripción
El reproductor ahora rota automáticamente la pantalla a modo horizontal (landscape) al iniciar la reproducción de cualquier contenido.

### Características

#### Rotación Automática al Entrar
- Al abrir el reproductor, la pantalla se pone automáticamente en horizontal
- Funciona para series, películas y TV en vivo
- Transición suave y automática
- No requiere intervención del usuario

#### Restauración al Salir
- Al salir del reproductor (botón atrás), la pantalla vuelve automáticamente a vertical (portrait)
- Limpieza automática al desmontar el componente
- Manejo de errores silencioso

#### Botón Manual
- El botón de pantalla completa sigue funcionando
- Permite alternar entre horizontal y vertical manualmente si el usuario lo desea
- Icono actualizado según el estado actual

### Ventajas
✅ **Experiencia inmersiva**: Video en pantalla completa desde el inicio
✅ **Automático**: No requiere que el usuario rote manualmente
✅ **Profesional**: Como todas las apps de streaming modernas
✅ **Reversible**: Vuelve a vertical al salir automáticamente

---

## Código Modificado
- **Archivo**: `iptv-app/src/pantallas/ReproductorProfesional.tsx`
- **Cambios**:
  - Nuevos estados para controlar modal y episodios
  - Función `abrirSelectorEpisodios()` ahora abre modal en lugar de navegar
  - Función `seleccionarEpisodio()` para cambiar de episodio desde el modal
  - Componente Modal completo con FlatList optimizada
  - Estilos profesionales estilo Netflix
  - Imports adicionales: Modal, ScrollView, FlatList, Pressable
  - useEffect para rotación automática al montar/desmontar
  - Barra de progreso interactiva con Pressable

## Notas Técnicas
- Compatible con todas las funcionalidades existentes
- No afecta películas o TV en vivo
- Mantiene el sistema de progreso y favoritos
- Optimizado para rendimiento con FlatList
- Animaciones nativas suaves
- Rotación automática con ScreenOrientation API

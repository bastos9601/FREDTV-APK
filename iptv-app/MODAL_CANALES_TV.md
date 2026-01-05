# Modal de Canales de TV en Vivo

## Descripción
Modal profesional para cambiar de canal de TV en vivo directamente desde el reproductor, con selector de categorías para filtrar canales fácilmente.

## Características

### Diseño Profesional
- Modal deslizante desde abajo (slide animation)
- Fondo semi-transparente oscuro (95% opacidad)
- Bordes redondeados superiores
- Ocupa el 85% de la pantalla
- Diseño consistente con el modal de episodios

### Selector de Categorías
- Scroll horizontal con todas las categorías disponibles
- Botón "Todos" para ver todos los canales
- Cada categoría muestra:
  - Nombre de la categoría
  - Cantidad de canales en esa categoría
- Categoría activa resaltada con color primario (azul)
- Filtrado instantáneo al cambiar de categoría
- Contador dinámico en el subtítulo del header

### Lista de Canales
- Scroll vertical suave con canales filtrados por categoría
- Cada canal muestra:
  - **Logo del canal** (imagen real del canal)
  - Icono genérico de TV si no tiene logo
  - Nombre del canal
  - Categoría del canal
  - Icono de play o checkmark
- **Canal actual** resaltado con:
  - Borde de color primario (azul)
  - Fondo con tinte azul
  - Badge "En vivo" con icono
  - Icono de checkmark en lugar de play

### Interacción
- Tap en categoría para filtrar canales
- Tap en cualquier canal para cambiar inmediatamente
- Cambio de canal sin salir del reproductor
- Botón X grande para cerrar el modal
- Animación suave al abrir/cerrar

### Rendimiento
- Carga asíncrona de canales y categorías usando `Promise.all()`
- Indicador de carga mientras obtiene datos
- Filtrado local instantáneo (sin llamadas al servidor)
- Manejo de errores con alertas
- Lista optimizada con FlatList

## Acceso
- Botón de TV (icono de televisión) en el header del reproductor
- Solo visible cuando se está reproduciendo TV en vivo (`esTvEnVivo: true`)

## Ventajas sobre la Navegación Anterior

### Antes:
- Botón "Volver a canales" que te sacaba del reproductor
- Tenías que navegar de vuelta a la lista
- Perdías el contexto de reproducción
- Más pasos para cambiar de canal
- Sin filtrado rápido por categorías

### Ahora:
✅ **No interrumpe la reproducción**: El video sigue en segundo plano
✅ **Cambio instantáneo**: Un tap y cambias de canal
✅ **Filtrado por categorías**: Encuentra canales rápidamente
✅ **Contador de canales**: Sabes cuántos hay en cada categoría
✅ **Experiencia fluida**: Como apps profesionales de IPTV
✅ **No pierde contexto**: Te quedas en el reproductor
✅ **Más rápido**: Menos pasos para cambiar de canal

## Flujo de Usuario

### Cambio Simple de Canal
1. Usuario está viendo TV en vivo
2. Toca la pantalla para mostrar controles
3. Toca el botón de TV en el header
4. Se abre el modal con todos los canales
5. Toca el canal deseado
6. El reproductor cambia al nuevo canal instantáneamente
7. Modal se cierra automáticamente

### Búsqueda por Categoría
1. Usuario abre el modal de canales
2. Ve las categorías en scroll horizontal (Deportes, Noticias, etc.)
3. Toca una categoría (ej: "Deportes")
4. La lista se filtra mostrando solo canales de deportes
5. El subtítulo muestra "X canales en esta categoría"
6. Selecciona el canal deseado
7. Cambio instantáneo

## Implementación Técnica

### Estados Agregados
```typescript
const [modalCanales, setModalCanales] = useState(false);
const [canalesTv, setCanalesTv] = useState<any[]>([]);
const [canalesFiltrados, setCanalesFiltrados] = useState<any[]>([]);
const [categoriasTv, setCategoriasTv] = useState<any[]>([]);
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('all');
const [cargandoCanales, setCargandoCanales] = useState(false);
```

### Funciones Principales
- `volverACanales()`: Abre el modal, carga canales y categorías en paralelo
- `filtrarCanalesPorCategoria()`: Filtra canales según categoría seleccionada
- `cerrarModalCanales()`: Cierra el modal
- `seleccionarCanal()`: Cambia al canal seleccionado usando `navigation.replace()`

### Servicios Utilizados
- `iptvServicio.getLiveStreams()`: Obtiene todos los canales
- `iptvServicio.getLiveCategories()`: Obtiene todas las categorías
- `iptvServicio.getLiveStreamUrl()`: Genera URL del canal seleccionado

### Componentes
- Modal con animación slide
- ScrollView horizontal para categorías
- FlatList optimizada para la lista de canales
- TouchableOpacity para cada categoría y canal
- Indicadores visuales de canal y categoría actual

## Estilos

### Elementos Visuales
- **modalTemporadaBtn**: Botón de cada categoría (reutilizado del modal de episodios)
- **modalTemporadaBtnActiva**: Estilo de categoría activa
- **modalCategoriaCantidad**: Contador de canales en cada categoría
- **modalCanalItem**: Card de cada canal
- **modalCanalItemActivo**: Estilo del canal actual (borde azul)
- **modalCanalIcono**: Círculo con icono de TV
- **modalCanalNombre**: Nombre del canal en negrita
- **Badge "En vivo"**: Indicador del canal actual

### Colores
- Fondo de cards: `COLORS.card`
- Borde activo: `COLORS.primary` (azul)
- Texto: `COLORS.text`
- Texto secundario: `COLORS.textSecondary`

## Categorías

### Categoría "Todos"
- Siempre aparece primero
- Muestra todos los canales sin filtrar
- Contador muestra el total de canales disponibles

### Categorías Dinámicas
- Se cargan desde el servidor
- Ejemplos comunes:
  - Deportes
  - Noticias
  - Entretenimiento
  - Películas
  - Infantil
  - Música
  - Documentales
  - etc.

## Compatibilidad
- Solo se muestra cuando `esTvEnVivo === true`
- Compatible con todas las funcionalidades del reproductor
- No interfiere con controles de reproducción
- Funciona en orientación horizontal
- Optimizado para listas grandes de canales

## Casos de Uso

### Zapping Rápido por Categoría
Usuario quiere ver qué hay en canales de deportes sin ver todos los demás

### Exploración Organizada
Usuario quiere explorar canales de noticias para comparar coberturas

### Búsqueda Eficiente
Usuario busca un canal específico y sabe su categoría, reduciendo la lista

### Comparación de Eventos
Usuario quiere cambiar entre canales deportivos para ver diferentes transmisiones del mismo evento

## Notas Técnicas
- Usa `navigation.replace()` para cambiar de canal sin apilar pantallas
- Mantiene el estado de reproducción optimizado
- Carga de canales y categorías en paralelo con `Promise.all()`
- Filtrado local para rendimiento instantáneo
- Lista virtualizada para rendimiento con muchos canales
- Manejo de errores robusto
- Contador dinámico actualizado en tiempo real

## Mejoras Futuras Posibles
- Búsqueda de canales por nombre dentro del modal
- Canales favoritos al inicio de cada categoría
- Miniaturas/logos de canales
- EPG (guía de programación) integrada
- Historial de canales vistos recientemente
- Ordenamiento personalizado (alfabético, más vistos, etc.)

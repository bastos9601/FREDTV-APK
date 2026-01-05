# Configuración del Reproductor

## Nuevas Funcionalidades

Se han agregado dos funcionalidades importantes al reproductor de video:

### 1. Control de Brillo
### 2. Selector de Idioma de Audio

## 1. Control de Brillo 🔆

### Descripción
Permite ajustar el brillo de la pantalla del dispositivo directamente desde el reproductor, sin necesidad de salir de la aplicación.

### Características

#### Slider de Brillo
- Control deslizante de 0% a 100%
- Ajuste en tiempo real
- Indicador visual del porcentaje actual
- Iconos de sol para mejor comprensión

#### Comportamiento
- **Al entrar al reproductor**: Guarda el brillo actual del dispositivo
- **Durante reproducción**: Permite ajustar el brillo libremente
- **Al salir del reproductor**: Restaura el brillo original automáticamente

#### Acceso
1. Toca la pantalla para mostrar controles
2. Toca el botón de configuración (engranaje) en la esquina inferior derecha
3. Se abre el modal de configuración
4. Ajusta el slider de brillo

### Ventajas
✅ **Comodidad**: No sales de la app para ajustar brillo
✅ **Automático**: Restaura el brillo original al salir
✅ **Visual**: Indicador claro del nivel actual
✅ **Intuitivo**: Slider fácil de usar

## 2. Selector de Idioma de Audio 🌐

### Descripción
Permite cambiar el idioma de audio de películas y series que tienen múltiples pistas de audio disponibles.

### Características

#### Lista de Idiomas
- Muestra todos los idiomas de audio disponibles
- Indica el idioma actualmente seleccionado
- Cambio instantáneo de pista

#### Idiomas Comunes
- Español (Latino)
- Español (España)
- Inglés
- Portugués
- Francés
- Italiano
- Alemán
- Y más...

#### Indicador Visual
- Idioma activo resaltado con borde azul
- Checkmark en el idioma seleccionado
- Fondo con tinte azul para mejor visibilidad

#### Acceso
1. Toca la pantalla para mostrar controles
2. Toca el botón de configuración (engranaje)
3. Se abre el modal de configuración
4. Selecciona el idioma deseado de la lista

### Ventajas
✅ **Multiidioma**: Cambia entre idiomas disponibles
✅ **Instantáneo**: Cambio sin interrumpir reproducción
✅ **Visual**: Lista clara de opciones
✅ **Profesional**: Como Netflix, Disney+, etc.

## Modal de Configuración

### Diseño
- Modal deslizante desde abajo
- Fondo semi-transparente oscuro
- Bordes redondeados superiores
- Scroll vertical para más opciones

### Secciones

#### 1. Brillo
- Icono de sol
- Slider de control
- Porcentaje actual

#### 2. Idioma de Audio
- Icono de idioma
- Lista de pistas disponibles
- Indicador de selección

#### 3. Información
- Icono de información
- Duración total del video
- Posición actual
- Información de temporada/episodio (si es serie)

## Implementación Técnica

### Paquetes Utilizados
- **expo-brightness**: Control de brillo del dispositivo
- **expo-video**: Manejo de pistas de audio (nativo)
- **@react-native-community/slider**: Slider para brillo

### Estados Agregados
```typescript
const [modalConfiguracion, setModalConfiguracion] = useState(false);
const [brillo, setBrillo] = useState(0.5);
const [brilloOriginal, setBrilloOriginal] = useState(0.5);
const [pistasAudio, setPistasAudio] = useState<any[]>([]);
const [pistaAudioSeleccionada, setPistaAudioSeleccionada] = useState<number>(0);
```

### Funciones Principales

#### Control de Brillo
```typescript
const cambiarBrillo = async (nuevoBrillo: number) => {
  setBrillo(nuevoBrillo);
  await Brightness.setBrightnessAsync(nuevoBrillo);
};
```

#### Cambio de Idioma
```typescript
const cambiarPistaAudio = (index: number) => {
  setPistaAudioSeleccionada(index);
  // expo-video maneja el cambio automáticamente
};
```

### Permisos Necesarios

#### Android
- `WRITE_SETTINGS`: Para cambiar el brillo del sistema
- Se solicita automáticamente en tiempo de ejecución

#### iOS
- No requiere permisos adicionales para brillo
- Permisos de audio manejados por el sistema

## Flujo de Usuario

### Ajustar Brillo
1. Usuario está viendo contenido
2. Toca la pantalla → Aparecen controles
3. Toca engranaje → Se abre configuración
4. Mueve slider de brillo → Brillo cambia en tiempo real
5. Cierra modal → Brillo se mantiene
6. Sale del reproductor → Brillo vuelve al original

### Cambiar Idioma
1. Usuario está viendo película/serie multiidioma
2. Toca la pantalla → Aparecen controles
3. Toca engranaje → Se abre configuración
4. Ve lista de idiomas disponibles
5. Toca idioma deseado → Audio cambia instantáneamente
6. Cierra modal → Continúa con nuevo idioma

## Casos de Uso

### Caso 1: Película Muy Oscura
Usuario está viendo una película con escenas oscuras y quiere aumentar el brillo temporalmente.

### Caso 2: Ver en la Noche
Usuario está viendo en la noche y quiere reducir el brillo para no molestar a otros.

### Caso 3: Película Multiidioma
Usuario quiere ver una película en inglés original en lugar del doblaje español.

### Caso 4: Serie con Múltiples Audios
Usuario está viendo una serie y quiere cambiar entre audio latino y español de España.

## Compatibilidad

### Dispositivos
- ✅ Android: Totalmente compatible
- ✅ iOS: Totalmente compatible
- ✅ Tablets: Optimizado para pantallas grandes

### Contenido
- ✅ Películas: Control de brillo + idioma (si disponible)
- ✅ Series: Control de brillo + idioma (si disponible)
- ✅ TV en vivo: Solo control de brillo

## Notas Importantes

### Brillo
- El brillo se restaura automáticamente al salir
- Requiere permisos en Android (se solicitan automáticamente)
- No afecta el brillo de otras apps

### Idioma de Audio
- Solo aparece si hay múltiples pistas disponibles
- Depende del contenido del servidor
- Algunos videos pueden tener solo un idioma

### Rendimiento
- Cambio de brillo es instantáneo
- Cambio de idioma puede tener un breve delay
- No afecta la reproducción del video

## Mejoras Futuras Posibles

1. **Subtítulos**: Selector de subtítulos en múltiples idiomas
2. **Calidad de Video**: Selector de resolución (480p, 720p, 1080p)
3. **Velocidad de Reproducción**: Control de velocidad (0.5x, 1x, 1.5x, 2x)
4. **Ecualizador**: Ajustes de audio avanzados
5. **Modo Noche**: Filtro de luz azul integrado
6. **Presets de Brillo**: Guardar configuraciones favoritas

## Instalación

### Requisito
Instalar el paquete `expo-brightness`:

```bash
cd iptv-app
npx expo install expo-brightness
```

### Verificación
Después de instalar, reinicia la app para que los cambios surtan efecto.

## Testing

### Cómo Probar

#### Brillo
1. Abrir reproductor
2. Verificar brillo actual del dispositivo
3. Abrir configuración
4. Mover slider de brillo
5. Verificar que el brillo cambia
6. Salir del reproductor
7. Verificar que el brillo vuelve al original

#### Idioma
1. Reproducir contenido multiidioma
2. Abrir configuración
3. Verificar que aparece lista de idiomas
4. Cambiar idioma
5. Verificar que el audio cambia
6. Cerrar y reabrir configuración
7. Verificar que el idioma seleccionado está marcado

## Troubleshooting

### El brillo no cambia
- Verificar que se instaló `expo-brightness`
- Verificar permisos en Android
- Reiniciar la app

### No aparecen idiomas
- El contenido puede tener solo un idioma
- Verificar que el servidor envía múltiples pistas
- Algunos formatos no soportan múltiples audios

### El modal no se abre
- Verificar que los controles están visibles
- Verificar que la pantalla no está bloqueada
- Tocar directamente el icono de engranaje

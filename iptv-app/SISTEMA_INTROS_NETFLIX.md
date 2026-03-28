# Sistema de Intros tipo Netflix

Implementación completa para detectar y saltar intros automáticamente en tu app IPTV.

## 📋 Características

✅ **Nivel 1 (Básico):** Guardar intros manualmente por episodio  
✅ **Nivel 2 (Intermedio):** Detectar intros automáticamente (audio o frames)  
✅ **Nivel 3 (Avanzado):** Animación del botón (fade in/out)  

## 🗄️ Estructura de Base de Datos

### Crear tabla `intros` en Supabase

```sql
CREATE TABLE intros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  serie_id INTEGER NOT NULL,
  temporada INTEGER NOT NULL,
  episodio INTEGER NOT NULL,
  inicio FLOAT NOT NULL,
  fin FLOAT NOT NULL,
  detectado_automaticamente BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, serie_id, temporada, episodio)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_intros_usuario ON intros(usuario_id);
CREATE INDEX idx_intros_serie ON intros(usuario_id, serie_id);
```

## 📁 Archivos Creados

### 1. `introServicio.ts`
Servicio principal para gestionar intros:
- `guardarIntro()` - Guardar intro manualmente o detectado
- `obtenerIntro()` - Obtener intro de un episodio
- `obtenerIntrosSerie()` - Obtener todos los intros de una serie
- `eliminarIntro()` - Eliminar intro
- `detectarIntroAutomatico()` - Detectar por análisis de audio
- `detectarIntroPorFrames()` - Detectar por análisis de frames

### 2. `ReproductorConIntro.tsx`
Componente de reproductor con soporte para intros:
- Muestra botón "Saltar intro" cuando está en la zona de intro
- Animación fade in/out del botón
- Permite guardar intros manualmente (en desarrollo)
- Integración con `introServicio`

### 3. `DetectorIntroAutomatico.tsx`
Componente para detectar intros automáticamente:
- Dos métodos: por frames o por audio
- Muestra progreso de detección
- Guarda automáticamente en Supabase

## 🚀 Cómo Usar

### Opción 1: Guardar Intro Manualmente (Recomendado para empezar)

```typescript
import introServicio from './servicios/introServicio';

// Guardar intro: comienza en segundo 0, termina en segundo 85
await introServicio.guardarIntro(
  usuarioId,
  serieId,
  temporada,
  episodio,
  0,      // inicio en segundos
  85,     // fin en segundos
  false   // no detectado automáticamente
);
```

### Opción 2: Usar Reproductor con Intros

```typescript
import { ReproductorConIntro } from './componentes/ReproductorConIntro';

<ReproductorConIntro
  url="https://ejemplo.com/video.mp4"
  usuarioId={usuarioId}
  serieId={123}
  temporada={1}
  episodio={1}
  onProgress={(tiempo) => console.log('Tiempo:', tiempo)}
  onFinish={() => console.log('Video terminado')}
/>
```

### Opción 3: Detectar Intro Automáticamente

```typescript
import { DetectorIntroAutomatico } from './componentes/DetectorIntroAutomatico';

<DetectorIntroAutomatico
  videoElement={videoRef.current}
  usuarioId={usuarioId}
  serieId={123}
  temporada={1}
  episodio={1}
  onDetectado={(inicio, fin) => {
    console.log(`Intro detectado: ${inicio}s - ${fin}s`);
  }}
/>
```

## 🔧 Integración con tu Reproductor Actual

Si ya tienes un reproductor, agrega esto:

```typescript
import introServicio from './servicios/introServicio';

// En tu componente de reproducción
const [intro, setIntro] = useState(null);

useEffect(() => {
  // Cargar intro al montar
  const cargarIntro = async () => {
    const introData = await introServicio.obtenerIntro(
      usuarioId,
      serieId,
      temporada,
      episodio
    );
    setIntro(introData);
  };
  
  cargarIntro();
}, [usuarioId, serieId, temporada, episodio]);

// En el handler de progreso del video
const handleProgress = (tiempoActual) => {
  if (intro && tiempoActual >= intro.inicio && tiempoActual < intro.fin) {
    // Mostrar botón de saltar
    setMostrarBotonSaltar(true);
  }
};

// Función para saltar
const saltarIntro = async () => {
  if (intro && videoRef.current) {
    await videoRef.current.seek(intro.fin);
  }
};
```

## 📊 Estructura de Datos Guardados

```json
{
  "id": "uuid-123",
  "usuario_id": "user-456",
  "serie_id": 12345,
  "temporada": 1,
  "episodio": 1,
  "inicio": 0,
  "fin": 85,
  "detectado_automaticamente": false,
  "fecha_creacion": "2024-03-21T10:30:00Z"
}
```

## 🎯 Flujo de Uso Recomendado

### Fase 1: Guardar Intros Manualmente
1. Usuario reproduce un episodio
2. Cuando comienza el intro, presiona "Marcar inicio"
3. Cuando termina el intro, presiona "Marcar fin"
4. Se guarda en Supabase

### Fase 2: Usar Intros Guardados
1. Usuario reproduce el mismo episodio
2. Cuando llega al intro, aparece botón "Saltar intro"
3. Usuario presiona el botón
4. Video salta al fin del intro

### Fase 3: Detectar Automáticamente (Opcional)
1. Usuario presiona "Detectar intro automáticamente"
2. Sistema analiza el video (frames o audio)
3. Se guarda automáticamente
4. Próxima vez se usa automáticamente

## ⚙️ Configuración Avanzada

### Ajustar Sensibilidad de Detección

En `introServicio.ts`, método `detectarIntroPorFrames()`:

```typescript
// Cambiar umbral de diferencia de frames
if (diferencia < 5) { // Aumentar a 10 para menos sensibilidad
  framesIguales++;
}

// Cambiar cantidad de frames iguales requeridos
if (framesIguales > 5) { // Aumentar a 10 para más precisión
  introInicio = videoElement.currentTime;
}
```

### Cambiar Duración Máxima de Intro

```typescript
// En detectarIntroAutomatico o detectarIntroPorFrames
duracionMaxima: number = 120 // Cambiar a 180 para 3 minutos
```

## 🐛 Troubleshooting

### El botón "Saltar intro" no aparece
- Verifica que el intro esté guardado en Supabase
- Comprueba que `serie_id`, `temporada` y `episodio` coincidan exactamente
- Revisa la consola para errores

### La detección automática no funciona
- Asegúrate de que el video esté reproduciendo
- Intenta con el método de frames primero (más confiable)
- Aumenta la duración máxima si el intro es muy largo

### El video no salta correctamente
- Verifica que `intro.fin` sea menor que la duración total del video
- Comprueba que el reproductor soporte `seek()`

## 📱 Ejemplo Completo para Pantalla de Reproducción

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import introServicio from './servicios/introServicio';

export const PantallaReproduccion = ({ route }) => {
  const { url, usuarioId, serieId, temporada, episodio } = route.params;
  const videoRef = useRef(null);
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    cargarIntro();
  }, []);

  const cargarIntro = async () => {
    const introData = await introServicio.obtenerIntro(
      usuarioId,
      serieId,
      temporada,
      episodio
    );
    setIntro(introData);
  };

  const handleProgress = (status) => {
    const tiempoActual = status.positionMillis / 1000;
    
    if (intro && tiempoActual >= intro.inicio && tiempoActual < intro.fin) {
      // Mostrar botón de saltar
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: url }}
        useNativeControls
        style={styles.video}
        onPlaybackStatusUpdate={handleProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
});
```

## 🎬 Próximos Pasos

1. ✅ Crear tabla en Supabase
2. ✅ Integrar `introServicio.ts`
3. ✅ Usar `ReproductorConIntro.tsx` o integrar manualmente
4. ✅ Probar guardando intros manualmente
5. ✅ (Opcional) Usar detección automática

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola para errores
2. Verifica que Supabase esté configurado correctamente
3. Comprueba que la tabla `intros` exista
4. Asegúrate de que los permisos de Supabase permitan lectura/escritura


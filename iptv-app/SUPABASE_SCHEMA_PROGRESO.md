# Schema de Supabase para Progreso de Videos

## Problema
El video aparece en "Continuar viendo" en ambos dispositivos, pero cuando presionas play no reproduce. Esto es porque la URL no se está guardando en Supabase.

## Solución
Agregar las siguientes columnas a la tabla `progreso_capitulos` en Supabase:

### Columnas a Agregar

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `url` | `text` | URL completa del video (ej: `http://zgazy.com:8880/movie/123.mp4`) |
| `tipo` | `text` | Tipo de contenido: `pelicula`, `serie`, `episodio` |
| `temporada` | `integer` | Número de temporada (solo para series/episodios) |
| `episodio` | `integer` | Número de episodio (solo para series/episodios) |
| `serie_id` | `integer` | ID de la serie (solo para series/episodios) |
| `extension` | `text` | Extensión del archivo: `mp4`, `mkv`, etc. |
| `imagen` | `text` | URL de la imagen/poster del contenido |
| `streamId` | `integer` | ID del stream en el servidor IPTV |

### SQL para Agregar Columnas

```sql
-- Agregar columnas a la tabla progreso_capitulos
ALTER TABLE progreso_capitulos
ADD COLUMN url TEXT,
ADD COLUMN tipo TEXT,
ADD COLUMN temporada INTEGER,
ADD COLUMN episodio INTEGER,
ADD COLUMN serie_id INTEGER,
ADD COLUMN extension TEXT,
ADD COLUMN imagen TEXT,
ADD COLUMN streamId INTEGER;
```

## Cómo Hacerlo en Supabase

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú izquierdo
4. Crea una nueva query
5. Copia y pega el SQL anterior
6. Haz clic en **Run**

## Verificación

Después de agregar las columnas, el flujo será:

1. **Guardar**: Cuando reproduces un video, se guarda la URL y otros datos en Supabase
2. **Recuperar**: Cuando entras en otro dispositivo, se recupera la URL desde Supabase
3. **Reproducir**: El video se reproduce correctamente porque tiene la URL

## Notas

- Si la tabla ya tiene estas columnas, no es necesario hacer nada
- El código ya está preparado para guardar y recuperar estos datos
- Si Supabase rechaza alguna columna, es porque ya existe o hay un conflicto de tipo

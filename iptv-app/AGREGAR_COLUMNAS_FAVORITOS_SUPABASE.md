# Agregar Columnas a la Tabla Favoritos en Supabase

## Problema
Para que los favoritos se sincronicen correctamente entre dispositivos y se puedan recuperar los datos completos, necesitamos agregar columnas adicionales a la tabla `favoritos` en Supabase.

## Columnas a Agregar

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `tipo` | `text` | Tipo de contenido: `pelicula`, `serie`, `canal` |
| `stream_id` | `integer` | ID del stream en el servidor IPTV (para películas) |
| `serie_id` | `integer` | ID de la serie en el servidor IPTV (para series) |

## Instrucciones

### Opción 1: Usar SQL (Recomendado)

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú izquierdo
4. Haz clic en **New Query**
5. Copia y pega el siguiente SQL:

```sql
ALTER TABLE favoritos
ADD COLUMN tipo TEXT,
ADD COLUMN stream_id INTEGER,
ADD COLUMN serie_id INTEGER;
```

6. Haz clic en **Run**

### Opción 2: Usar la Interfaz Gráfica

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Table Editor** en el menú izquierdo
4. Selecciona la tabla `favoritos`
5. Haz clic en el botón **+** para agregar una columna
6. Agrega las tres columnas:
   - `tipo` (Text)
   - `stream_id` (Integer)
   - `serie_id` (Integer)

## Verificación

Después de agregar las columnas:

1. Agrega un favorito en el dispositivo 1
2. Espera a que se guarde en Supabase
3. Abre la app en el dispositivo 2
4. Ve a "Mi Perfil" → "Favoritos"
5. El favorito debe aparecer en el segundo dispositivo

## Notas

- Si las columnas ya existen, no es necesario hacer nada
- Las columnas son opcionales (pueden ser NULL)
- El código está preparado para funcionar con o sin estas columnas

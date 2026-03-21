# Solución: Continuar Viendo No Reproduce en Otro Dispositivo

## Problema
El video aparece en "Continuar viendo" en ambos dispositivos, pero cuando presionas play en el segundo dispositivo, no reproduce.

## Causa Raíz
La URL del video no se estaba guardando en Supabase, por lo que cuando se recuperaba en otro dispositivo, la URL estaba vacía.

## Cambios Realizados

### 1. `PerfilPantalla.tsx` (ACTUALIZADO)
- Ahora usa la URL de Supabase cuando está disponible
- Si la URL no está disponible, intenta reconstruirla usando `streamId`, `temporada`, `episodio`, etc.
- Pasa todos los datos necesarios al reproductor: `url`, `tipo`, `temporada`, `episodio`, `serieId`, `extension`, `imagen`

### 2. `supabaseServicio.ts` (ACTUALIZADO)
- Ahora intenta guardar campos adicionales: `url`, `tipo`, `temporada`, `episodio`, `serie_id`, `extension`, `imagen`, `streamId`
- Estos campos se guardan si existen en la tabla de Supabase

### 3. `progresoStorage.ts` (SIN CAMBIOS)
- Ya estaba guardando la URL correctamente
- Ya estaba reconstruyendo la URL si faltaba

## Qué Necesitas Hacer

### Paso 1: Agregar Columnas a Supabase (IMPORTANTE)

La tabla `progreso_capitulos` en Supabase necesita las siguientes columnas:

```sql
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

**Cómo hacerlo:**
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Crea una nueva query
5. Copia y pega el SQL anterior
6. Haz clic en **Run**

### Paso 2: Probar

1. Reproduce un video en el dispositivo 1
2. Espera a que se guarde el progreso (10 segundos)
3. Cierra la app
4. Abre la app en el dispositivo 2 con el mismo usuario y perfil
5. Ve a "Continuar viendo"
6. Presiona play en el video
7. El video debe reproducirse correctamente

## Flujo Completo

```
Dispositivo 1:
  1. Reproduces un video
  2. Se guarda: url, tipo, temporada, episodio, etc. en Supabase
  3. Se guarda: progreso, duracion, tiempo_actual en Supabase

Dispositivo 2:
  1. Cargas "Continuar viendo"
  2. Se recupera: url, tipo, temporada, episodio, etc. de Supabase
  3. Se muestra el video en la lista
  4. Presionas play
  5. Se usa la URL recuperada de Supabase
  6. El video se reproduce correctamente
```

## Verificación

Si después de agregar las columnas a Supabase el video sigue sin reproducirse:

1. Abre la consola de Supabase
2. Ve a la tabla `progreso_capitulos`
3. Verifica que la columna `url` tenga un valor
4. Si está vacía, es porque el video se guardó antes de agregar las columnas
5. Solución: Reproduce el video nuevamente para que se guarde con la URL

## Notas

- El código ya está preparado para guardar y recuperar la URL
- Si Supabase rechaza alguna columna, es porque ya existe
- La reconstrucción de URL es un fallback si la URL no está disponible
- Asegúrate de que `streamId`, `temporada`, `episodio` estén siendo guardados correctamente

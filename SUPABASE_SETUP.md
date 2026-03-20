# Configuración de Supabase para FRED TV

## Crear las tablas en Supabase

Ve a tu proyecto en Supabase y ejecuta estos SQL en el editor SQL:

### 1. Tabla de Progreso de Capítulos

```sql
CREATE TABLE progreso_capitulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id TEXT NOT NULL,
  canal_id TEXT NOT NULL,
  capitulo_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  progreso INTEGER DEFAULT 0,
  duracion INTEGER DEFAULT 0,
  tiempo_actual INTEGER DEFAULT 0,
  fecha_actualizacion TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, canal_id, capitulo_id)
);

CREATE INDEX idx_progreso_usuario ON progreso_capitulos(usuario_id);
CREATE INDEX idx_progreso_canal ON progreso_capitulos(canal_id);
```

### 2. Tabla de Favoritos

```sql
CREATE TABLE favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id TEXT NOT NULL,
  canal_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  imagen TEXT,
  fecha_agregado TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, canal_id)
);

CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);
```

### 3. Tabla de Perfiles

```sql
CREATE TABLE perfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  avatar TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_perfiles_usuario ON perfiles(usuario_id);
```

### 4. Habilitar Row Level Security (RLS)

```sql
-- Progreso
ALTER TABLE progreso_capitulos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propio progreso"
  ON progreso_capitulos FOR SELECT
  USING (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden insertar su propio progreso"
  ON progreso_capitulos FOR INSERT
  WITH CHECK (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden actualizar su propio progreso"
  ON progreso_capitulos FOR UPDATE
  USING (usuario_id = auth.uid()::text);

-- Favoritos
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus favoritos"
  ON favoritos FOR SELECT
  USING (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden insertar favoritos"
  ON favoritos FOR INSERT
  WITH CHECK (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden eliminar sus favoritos"
  ON favoritos FOR DELETE
  USING (usuario_id = auth.uid()::text);

-- Perfiles
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus perfiles"
  ON perfiles FOR SELECT
  USING (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden crear perfiles"
  ON perfiles FOR INSERT
  WITH CHECK (usuario_id = auth.uid()::text);

CREATE POLICY "Usuarios pueden eliminar sus perfiles"
  ON perfiles FOR DELETE
  USING (usuario_id = auth.uid()::text);
```

---

## Pasos en Supabase:

1. Ve a: https://app.supabase.com/
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega cada SQL arriba
5. Ejecuta cada uno

---

## Uso en la app:

```typescript
import supabaseServicio from './src/servicios/supabaseServicio';

// Guardar progreso
await supabaseServicio.guardarProgreso({
  usuario_id: 'usuario123',
  canal_id: 'canal456',
  capitulo_id: 'cap789',
  titulo: 'Capítulo 1',
  progreso: 50,
  duracion: 3600,
  tiempo_actual: 1800,
});

// Obtener progreso
const progreso = await supabaseServicio.obtenerProgreso('usuario123', 'canal456');

// Agregar favorito
await supabaseServicio.agregarFavorito({
  usuario_id: 'usuario123',
  canal_id: 'canal456',
  titulo: 'Mi Canal Favorito',
  imagen: 'url-imagen',
});

// Obtener favoritos
const favoritos = await supabaseServicio.obtenerFavoritos('usuario123');

// Crear perfil
await supabaseServicio.crearPerfil({
  usuario_id: 'usuario123',
  nombre: 'Mi Perfil',
  avatar: 'url-avatar',
});

// Obtener perfiles
const perfiles = await supabaseServicio.obtenerPerfiles('usuario123');
```

---

## Notas importantes:

- El `usuario_id` debe ser único para cada usuario (puedes usar el email o un UUID)
- Los datos se sincronizan automáticamente entre dispositivos
- Asegúrate de tener habilitado RLS para seguridad

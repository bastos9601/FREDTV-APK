# Sistema de Perfiles de Usuario 👥

## 📋 Descripción

Sistema completo de perfiles múltiples que permite a cada usuario tener su propia experiencia personalizada con historial, favoritos y configuraciones separadas.

## ✨ Características Implementadas

### 1. **Múltiples Perfiles**
- Crear hasta perfiles ilimitados por cuenta
- Cada perfil tiene su propio espacio
- Perfil principal no se puede eliminar
- Cambio rápido entre perfiles

### 2. **Perfiles Infantiles** 👶
- Modo especial para niños
- **Filtrado automático de contenido no apto para menores**
- **Solo muestra películas y series con ratings G, PG, TV-Y, TV-Y7, TV-G**
- **Filtra categorías infantiles: animación, niños, familia, educativo**
- **Bloquea contenido con palabras clave adultas (violencia, terror, drogas, etc.)**
- Avatar con borde amarillo distintivo
- Badge "Niños" visible
- Indicador "Modo Niños" en todas las pantallas

### 3. **Protección con PIN** 🔒
- PIN de 4 dígitos opcional
- Protege el acceso al perfil
- Verificación antes de entrar
- Ideal para perfiles de adultos

### 4. **Avatares Personalizables** 🎨
- 24 avatares diferentes disponibles
- Iconos de Ionicons
- Categorías: Personas, Deportes, Naturaleza, Espacio, etc.
- Fácil selección visual

### 5. **Gestión Completa**
- Crear nuevos perfiles
- Editar perfiles existentes
- Eliminar perfiles (excepto el principal)
- Interfaz intuitiva

## 🎨 Avatares Disponibles

```typescript
- person-circle (Persona)
- happy (Feliz)
- heart-circle (Corazón)
- star (Estrella)
- rocket (Cohete)
- game-controller (Videojuegos)
- pizza (Pizza)
- ice-cream (Helado)
- football (Fútbol)
- basketball (Baloncesto)
- musical-notes (Música)
- camera (Cámara)
- airplane (Avión)
- car-sport (Auto deportivo)
- boat (Barco)
- bicycle (Bicicleta)
- flower (Flor)
- leaf (Hoja)
- paw (Huella)
- fish (Pez)
- bug (Insecto)
- planet (Planeta)
- moon (Luna)
- sunny (Sol)
```

## 🔧 Estructura de Datos

### Perfil
```typescript
interface Perfil {
  id: string;              // ID único
  nombre: string;          // Nombre del perfil
  avatar: string;          // Icono de Ionicons
  esInfantil: boolean;     // ¿Es perfil infantil?
  pin?: string;            // PIN opcional (4 dígitos)
  fechaCreacion: number;   // Timestamp de creación
}
```

## 📱 Pantallas

### 1. **Selección de Perfil**
- Muestra todos los perfiles disponibles
- Grid de 2 columnas
- Avatares grandes y visibles
- Botón "Gestionar Perfiles"
- Modal de PIN si es necesario

### 2. **Gestión de Perfiles**
- Lista de todos los perfiles
- Botones de editar y eliminar
- Crear nuevo perfil
- Información visual (badges)

### 3. **Edición/Creación**
- Formulario completo
- Selector de avatar horizontal
- Switches para opciones
- Validación de datos

## 🚀 Flujo de Usuario

### Primer Uso
```
1. App crea perfil "Principal" automáticamente
2. Usuario puede empezar a usar inmediatamente
3. Puede crear más perfiles después
```

### Uso Normal
```
1. Abrir app → Pantalla de selección de perfiles
2. Seleccionar perfil
3. Si tiene PIN → Ingresar PIN
4. Acceder a la app con ese perfil
```

### Crear Perfil
```
1. Pantalla de selección → "Gestionar Perfiles"
2. "Crear Nuevo Perfil"
3. Ingresar nombre
4. Seleccionar avatar
5. Configurar opciones (infantil, PIN)
6. Guardar
```

## 🔐 Seguridad

### PIN
- 4 dígitos numéricos
- Almacenado localmente
- Verificación antes de acceder
- Opcional por perfil

### Perfiles Infantiles
- Filtrado automático de contenido
- No pueden acceder a contenido adulto
- Visual distintivo (borde amarillo)
- **Filtros aplicados:**
  - Ratings permitidos: G, PG, TV-Y, TV-Y7, TV-G
  - Categorías infantiles: animación, niños, familia, educativo
  - Bloqueo de palabras clave: adulto, terror, violencia, drogas, etc.
  - Solo muestra contenido verificado como apto para menores

## 💾 Almacenamiento

### AsyncStorage Keys
```typescript
'@perfiles'        // Lista de todos los perfiles
'@perfil_activo'   // ID del perfil actualmente activo
```

### Separación de Datos
Cada perfil tiene su propio:
- Historial de reproducción (por implementar)
- Lista de favoritos (por implementar)
- Configuraciones (por implementar)

## 🎯 Integración con la App

### Context API
```typescript
const { perfilActivo, cambiarPerfil, recargarPerfiles } = usePerfil();
```

### Uso en Componentes
```typescript
// Obtener perfil activo
const perfil = perfilActivo;

// Cambiar de perfil
await cambiarPerfil(perfilId);

// Recargar lista de perfiles
await recargarPerfiles();
```

## 📊 Próximas Mejoras

### Fase 2 - Separación de Datos
- [ ] Favoritos por perfil
- [ ] Historial por perfil
- [ ] Configuraciones por perfil
- [ ] Progreso de visualización por perfil

### Fase 3 - Filtrado de Contenido
- [x] Categorías permitidas para niños
- [x] Rating de contenido (G, PG, PG-13, R)
- [x] Bloqueo de contenido con palabras clave adultas
- [x] Filtrado automático en pantalla de inicio
- [x] Filtrado automático en pantalla de películas
- [x] Filtrado automático en pantalla de series
- [x] Indicador visual "Modo Niños"
- [ ] Horarios de uso para perfiles infantiles

### Fase 4 - Funciones Avanzadas
- [ ] Sincronización en la nube
- [ ] Perfiles compartidos entre dispositivos
- [ ] Estadísticas por perfil
- [ ] Recomendaciones personalizadas por perfil

## 🐛 Solución de Problemas

### No aparecen los perfiles
- Verificar que AsyncStorage funcione
- Revisar logs de consola
- Reiniciar la app

### No puedo eliminar un perfil
- El perfil "Principal" no se puede eliminar
- Debe haber al menos un perfil
- Verificar que no sea el perfil activo

### PIN no funciona
- Verificar que sean 4 dígitos
- Revisar que se guardó correctamente
- Intentar editar el perfil y cambiar el PIN

## 📝 Notas de Implementación

### Archivos Creados
1. `src/utils/perfilesStorage.ts` - Lógica de almacenamiento
2. `src/contexto/PerfilContext.tsx` - Context API
3. `src/pantallas/SeleccionPerfilPantalla.tsx` - Selección de perfil
4. `src/pantallas/GestionPerfilesPantalla.tsx` - Gestión de perfiles
5. `src/utils/filtroInfantil.ts` - Sistema de filtrado de contenido infantil

### Archivos a Modificar
1. `App.tsx` - Agregar PerfilProvider y rutas
2. `src/navegacion/*` - Agregar pantallas al navegador
3. `src/utils/favoritosStorage.ts` - Separar por perfil
4. `src/utils/progresoStorage.ts` - Separar por perfil
5. `src/pantallas/NuevaInicioPantalla.tsx` - Aplicar filtrado infantil ✅
6. `src/pantallas/PeliculasPantalla.tsx` - Aplicar filtrado infantil ✅
7. `src/pantallas/SeriesPantalla.tsx` - Aplicar filtrado infantil ✅

## 🎓 Ejemplo de Uso

```typescript
// En cualquier componente
import { usePerfil } from '../contexto/PerfilContext';

const MiComponente = () => {
  const { perfilActivo } = usePerfil();
  
  return (
    <View>
      <Text>Hola, {perfilActivo?.nombre}!</Text>
      {perfilActivo?.esInfantil && (
        <Text>Estás en modo niños 👶</Text>
      )}
    </View>
  );
};
```

## ✅ Checklist de Integración

- [x] Crear storage de perfiles
- [x] Crear context de perfiles
- [x] Pantalla de selección
- [x] Pantalla de gestión
- [x] Sistema de PIN
- [x] Avatares personalizables
- [x] Perfiles infantiles
- [ ] Integrar con navegación
- [ ] Separar favoritos por perfil
- [ ] Separar historial por perfil
- [x] Filtrado de contenido infantil
- [ ] Testing completo

## 🎉 Resultado Final

Un sistema completo de perfiles que permite:
- ✅ Múltiples usuarios en una cuenta
- ✅ Experiencia personalizada
- ✅ Protección con PIN
- ✅ Modo infantil seguro
- ✅ Avatares divertidos
- ✅ Gestión fácil e intuitiva

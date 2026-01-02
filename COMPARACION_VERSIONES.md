# Comparación: App Móvil vs Web

## 📱 IPTV App (React Native)

### Ubicación
`/iptv-app`

### Tecnologías
- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- expo-video

### Plataformas
- ✅ Android
- ✅ iOS
- ⚠️ Web (limitado)

### Características
- Aplicación nativa para móviles
- Mejor rendimiento en dispositivos móviles
- Acceso a APIs nativas del dispositivo
- Orientación de pantalla (landscape/portrait)
- Gestos táctiles optimizados

## 🌐 IPTV Web (React)

### Ubicación
`/web`

### Tecnologías
- React
- TypeScript
- React Router DOM
- localStorage
- HTML5 Video

### Plataformas
- ✅ Navegadores web (Chrome, Firefox, Safari, Edge)
- ✅ Desktop
- ✅ Móvil (navegador)
- ✅ Tablets

### Características
- Acceso desde cualquier navegador
- No requiere instalación
- Fácil de actualizar
- Compatible con múltiples dispositivos
- Responsive design

## 🔄 Funcionalidades Compartidas

Ambas versiones incluyen:

1. **Autenticación**
   - Login con usuario y contraseña
   - Persistencia de sesión
   - Cierre de sesión

2. **TV en Vivo**
   - Categorías de canales
   - Lista de canales por categoría
   - Reproducción de streams en vivo

3. **Películas**
   - Categorías de películas
   - Catálogo de películas
   - Reproducción de películas

4. **Series**
   - Categorías de series
   - Catálogo de series
   - Información de series

5. **Reproductor**
   - Reproducción de video
   - Controles básicos
   - Pantalla completa

## 🎨 Diseño

Ambas versiones comparten:
- Tema oscuro estilo Netflix
- Colores: Rojo (#E50914) y negro (#141414)
- Interfaz intuitiva
- Tarjetas de contenido con imágenes

## 📊 Comparación Técnica

| Característica | App Móvil | Web |
|---------------|-----------|-----|
| Instalación | Requiere APK/App Store | No requiere |
| Actualizaciones | Manual | Automática |
| Almacenamiento | AsyncStorage | localStorage |
| Navegación | React Navigation | React Router |
| Video | expo-video | HTML5 Video |
| Notificaciones | ✅ Posible | ❌ Limitado |
| Offline | ✅ Posible | ❌ Limitado |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Accesibilidad | Móviles | Universal |

## 🚀 Cuándo usar cada versión

### Usa la App Móvil cuando:
- Necesites mejor rendimiento en móviles
- Quieras funcionalidades nativas (notificaciones, etc.)
- Prefieras una app instalada
- Necesites modo offline

### Usa la Web cuando:
- Quieras acceso desde cualquier dispositivo
- No quieras instalar nada
- Necesites actualizaciones instantáneas
- Prefieras usar desde desktop/laptop
- Quieras compartir fácilmente (solo un link)

## 📝 Código Compartido

Ambas versiones comparten la misma lógica de negocio:

- **Servicio IPTV** (`iptvServicio.ts`)
- **Constantes** (`constantes.ts`)
- **Tipos TypeScript** (interfaces)
- **Estructura de contexto** (AuthContext)

## 🎯 Ventajas de tener ambas versiones

1. **Mayor alcance**: Usuarios móviles y desktop
2. **Flexibilidad**: Cada usuario elige su preferencia
3. **Backup**: Si una falla, la otra sigue funcionando
4. **Testing**: Probar en diferentes plataformas
5. **Desarrollo**: Código reutilizable entre versiones

## 🔮 Futuro

Ambas versiones pueden evolucionar con:
- Búsqueda avanzada
- Favoritos sincronizados
- Perfiles de usuario
- Recomendaciones
- Historial de reproducción
- Subtítulos
- Múltiples idiomas

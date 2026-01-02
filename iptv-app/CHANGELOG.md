# 📝 Changelog - IPTV Zona593

## [1.0.1] - 2026-01-02

### 🔄 Actualizado
- **Migración a Expo Video**: Reemplazado Expo AV (deprecado) por Expo Video
- **ReproductorPantalla**: Actualizado para usar `useVideoPlayer` hook
- **app.json**: Actualizado plugin de expo-av a expo-video
- **Documentación**: Actualizada toda la documentación para reflejar el cambio

### ✅ Corregido
- **Error "String cannot be cast to Boolean"**: Corregido en LoginPantalla
- **KeyboardAvoidingView**: Removido para evitar conflictos
- **Props boolean**: Hechos explícitos para evitar errores de tipo

### ➕ Agregado
- **Picture-in-Picture**: Soporte para PiP en Android 8.0+
- **ACTUALIZACION_EXPO_VIDEO.md**: Documentación de la migración
- **SOLUCION_ERROR.md**: Guía para solucionar errores comunes
- **CHANGELOG.md**: Este archivo

### ➖ Removido
- **expo-av**: Dependencia deprecada removida
- **KeyboardAvoidingView**: Removido de LoginPantalla

### 🎯 Mejoras
- Mejor rendimiento del reproductor de video
- API más simple y moderna
- Código más limpio y mantenible
- Sin advertencias de deprecación

---

## [1.0.0] - 2026-01-02

### 🎉 Lanzamiento Inicial

#### ✨ Funcionalidades
- **Autenticación**: Login con Xtream Codes API
- **TV en Vivo**: Streaming de canales M3U8/TS
- **Películas VOD**: Catálogo de películas bajo demanda
- **Series**: Series con temporadas y episodios
- **Reproductor**: Reproductor nativo con controles
- **Navegación**: Bottom Tabs + Stack Navigator
- **Persistencia**: Sesión guardada localmente

#### 📱 Pantallas
- LoginPantalla
- InicioPantalla
- TvEnVivoPantalla
- PeliculasPantalla
- SeriesPantalla
- ReproductorPantalla

#### 🎨 Diseño
- Tema oscuro estilo Netflix
- Paleta de colores personalizada
- Componentes reutilizables
- Responsive para diferentes pantallas

#### 🔧 Tecnologías
- React Native
- Expo SDK
- TypeScript
- React Navigation
- Axios
- AsyncStorage

#### 📚 Documentación
- README.md - Documentación principal
- INICIO_RAPIDO.md - Guía de inicio
- GUIA_USO.md - Manual de usuario
- INSTRUCCIONES_APK.md - Generar APK
- COMANDOS_RAPIDOS.md - Referencia de comandos
- API_XTREAM_CODES.md - Documentación de API
- PERSONALIZACION.md - Guía de personalización
- RESUMEN_PROYECTO.md - Resumen ejecutivo
- INDICE_DOCUMENTACION.md - Índice completo
- PROYECTO_COMPLETADO.md - Checklist

#### 🏗️ Arquitectura
- Separación de responsabilidades
- Context API para estado global
- Servicios centralizados
- Componentes reutilizables
- TypeScript al 100%

---

## Formato del Changelog

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de Cambios
- **Agregado** para funcionalidades nuevas
- **Actualizado** para cambios en funcionalidades existentes
- **Deprecado** para funcionalidades que serán removidas
- **Removido** para funcionalidades removidas
- **Corregido** para corrección de bugs
- **Seguridad** para vulnerabilidades

---

## Roadmap Futuro

### [1.1.0] - Próxima Versión
- [ ] Búsqueda global de contenido
- [ ] Filtros por categoría
- [ ] Sistema de favoritos
- [ ] Historial de reproducción
- [ ] Mejoras en el reproductor

### [1.2.0] - Versión Futura
- [ ] Subtítulos
- [ ] Control parental
- [ ] Perfiles múltiples
- [ ] Modo offline
- [ ] Notificaciones push

### [2.0.0] - Versión Mayor
- [ ] Rediseño completo de UI
- [ ] Nuevas funcionalidades avanzadas
- [ ] Optimizaciones de rendimiento
- [ ] Soporte para más plataformas

---

**Mantenido por**: Equipo de Desarrollo IPTV Zona593
**Última actualización**: Enero 2, 2026

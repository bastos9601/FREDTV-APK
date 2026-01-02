# Guía de Inicio - FRED TV Web

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd web
npm install
```

### 2. Iniciar la aplicación
```bash
npm start
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`

### 3. Iniciar sesión
Usa las mismas credenciales que en la aplicación móvil para acceder.

## 📱 Funcionalidades

### Pantallas Disponibles

1. **Login** - Autenticación de usuarios
2. **Inicio** - Información del usuario y navegación
3. **TV en Vivo** - Canales de televisión en tiempo real
4. **Películas** - Catálogo de películas por categorías
5. **Series** - Catálogo de series por categorías
6. **Reproductor** - Reproductor de video integrado

### Navegación

La aplicación cuenta con una barra de navegación superior que permite moverse entre las diferentes secciones:
- 🏠 Inicio
- 📺 TV en Vivo
- 🎬 Películas
- 📺 Series

## 🎨 Características de Diseño

- **Tema oscuro** inspirado en Netflix
- **Diseño responsive** que se adapta a diferentes tamaños de pantalla
- **Animaciones suaves** en hover y transiciones
- **Interfaz intuitiva** y fácil de usar

## 🔧 Configuración

### Cambiar servidor IPTV

Edita el archivo `src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: 'http://tu-servidor.com:8080',
  // ...
};
```

### Personalizar colores

Edita el archivo `src/utils/constantes.ts`:

```typescript
export const COLORS = {
  primary: '#E50914',      // Color principal
  background: '#141414',   // Fondo
  card: '#2F2F2F',        // Tarjetas
  text: '#FFFFFF',        // Texto principal
  textSecondary: '#B3B3B3', // Texto secundario
  border: '#404040',      // Bordes
};
```

## 📦 Compilar para producción

```bash
npm run build
```

Esto creará una carpeta `build/` con los archivos optimizados listos para desplegar.

## 🌐 Despliegue

Puedes desplegar la aplicación en:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**
- Cualquier servidor web estático

### Ejemplo con Netlify:
1. Ejecuta `npm run build`
2. Arrastra la carpeta `build/` a Netlify
3. ¡Listo!

## 🔐 Seguridad

- Las credenciales se almacenan en `localStorage`
- La sesión persiste entre recargas de página
- Rutas protegidas que requieren autenticación

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que el servidor IPTV permita solicitudes desde tu dominio.

### Video no reproduce
Verifica que:
1. Las credenciales sean correctas
2. El servidor IPTV esté funcionando
3. Tu navegador soporte el formato de video

## 📝 Diferencias con la App Móvil

La versión web tiene las mismas funcionalidades que la app móvil, con algunas adaptaciones:

- **Almacenamiento**: Usa `localStorage` en lugar de `AsyncStorage`
- **Navegación**: Usa React Router en lugar de React Navigation
- **Reproductor**: Usa el elemento HTML5 `<video>` nativo
- **Diseño**: Optimizado para pantallas más grandes

## 🎯 Próximas Mejoras

- [ ] Búsqueda de contenido
- [ ] Favoritos
- [ ] Historial de reproducción
- [ ] Modo picture-in-picture
- [ ] Subtítulos
- [ ] Control de calidad de video

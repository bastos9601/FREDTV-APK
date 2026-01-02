# FRED TV - Versión Web

Aplicación web de IPTV desarrollada con React y TypeScript.

## 🌟 Características

- 📺 **TV en Vivo** - Canales de televisión en tiempo real
- 🎬 **Películas** - Catálogo completo de películas por categorías
- 📺 **Series** - Series organizadas por categorías
- 🔐 **Autenticación** - Sistema seguro de login
- 🎮 **Reproductor Profesional** - Video.js con controles avanzados
- 📱 **Diseño Responsive** - Se adapta a cualquier dispositivo
- 🎨 **Interfaz Moderna** - Estilo Netflix

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Compilación

```bash
npm run build
```

## 📋 Requisitos

- Node.js 16+
- npm 8+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🎬 Reproductor Profesional

El reproductor incluye:
- ✅ Controles personalizados
- ✅ Selector de calidad
- ✅ Velocidad de reproducción
- ✅ Pantalla completa
- ✅ Manejo avanzado de errores
- ✅ Soporte HLS/DASH
- ✅ Interfaz inteligente (auto-ocultar controles)
- ✅ Atajos de teclado

Ver más en [REPRODUCTOR_PROFESIONAL.md](REPRODUCTOR_PROFESIONAL.md)

## 🔧 Configuración

### Servidor IPTV

El servidor está configurado en `src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: '', // Proxy configurado en package.json
  // ...
};
```

### Proxy (Solución CORS)

El proxy está configurado en `package.json`:

```json
"proxy": "http://zona593.live:8080"
```

Ver más en [SOLUCION_CORS.md](SOLUCION_CORS.md)

## 📁 Estructura del Proyecto

```
web/
├── src/
│   ├── componentes/       # Componentes reutilizables
│   │   ├── Boton.tsx
│   │   ├── Input.tsx
│   │   ├── TarjetaCanal.tsx
│   │   └── Navegacion.tsx
│   ├── contexto/          # Context API
│   │   └── AuthContext.tsx
│   ├── pantallas/         # Pantallas principales
│   │   ├── LoginPantalla.tsx
│   │   ├── InicioPantalla.tsx
│   │   ├── TvEnVivoPantalla.tsx
│   │   ├── PeliculasPantalla.tsx
│   │   ├── SeriesPantalla.tsx
│   │   └── ReproductorProfesional.tsx
│   ├── servicios/         # Servicios API
│   │   └── iptvServicio.ts
│   ├── utils/             # Utilidades
│   │   └── constantes.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
├── package.json
└── README.md
```

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **React Router DOM** - Navegación
- **Axios** - Peticiones HTTP
- **Video.js** - Reproductor profesional
- **CSS3** - Estilos

## 🎨 Personalización

### Colores

Edita `src/utils/constantes.ts`:

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

## 🐛 Solución de Problemas

### No puedo iniciar sesión

Ver [SOLUCION_CORS.md](SOLUCION_CORS.md) y [INSTRUCCIONES_RAPIDAS.md](INSTRUCCIONES_RAPIDAS.md)

### El video no reproduce

Ver [REPRODUCTOR_PROFESIONAL.md](REPRODUCTOR_PROFESIONAL.md)

### Errores de compilación

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación

- [GUIA_INICIO.md](GUIA_INICIO.md) - Guía de inicio
- [SOLUCION_CORS.md](SOLUCION_CORS.md) - Solución al problema de CORS
- [INSTRUCCIONES_RAPIDAS.md](INSTRUCCIONES_RAPIDAS.md) - Instrucciones rápidas
- [REPRODUCTOR_PROFESIONAL.md](REPRODUCTOR_PROFESIONAL.md) - Reproductor profesional

## 🌐 Despliegue

### Netlify

1. Ejecuta `npm run build`
2. Arrastra la carpeta `build/` a Netlify
3. Configura las variables de entorno si es necesario

### Vercel

```bash
npm install -g vercel
vercel
```

### Otros

La carpeta `build/` contiene archivos estáticos que puedes desplegar en cualquier servidor web.

## 🔐 Seguridad

- Las credenciales se almacenan en `localStorage`
- La sesión persiste entre recargas
- Rutas protegidas con autenticación
- Proxy para evitar exponer credenciales

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Móviles (iOS/Android)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👨‍💻 Autor

FRED TV - Versión Web 1.0.0

## 🎯 Roadmap

- [ ] Búsqueda de contenido
- [ ] Favoritos
- [ ] Historial de reproducción
- [ ] Picture-in-Picture
- [ ] Subtítulos
- [ ] Múltiples idiomas
- [ ] Modo oscuro/claro
- [ ] Notificaciones
- [ ] Compartir contenido
- [ ] Perfiles de usuario

## 📞 Soporte

Si tienes problemas o preguntas, revisa la documentación o abre un issue.

---

**¡Disfruta de FRED TV! 🎉**

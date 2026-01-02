# 📖 Guía de Uso - IPTV Zona593

## 🎯 Inicio Rápido

### 1. Ejecutar la Aplicación

```bash
cd iptv-app
npm start
```

Luego presiona:
- `a` para abrir en Android
- `i` para abrir en iOS
- `w` para abrir en web (limitado)

### 2. Escanear QR con Expo Go

1. Descarga **Expo Go** desde Play Store o App Store
2. Ejecuta `npm start`
3. Escanea el código QR que aparece en la terminal
4. La app se abrirá en tu dispositivo

---

## 🔐 Autenticación

### Pantalla de Login

Al abrir la app por primera vez, verás la pantalla de login:

1. **Usuario**: Ingresa tu nombre de usuario de Zona593
2. **Contraseña**: Ingresa tu contraseña
3. Presiona **"Iniciar Sesión"**

**Ejemplo de credenciales** (debes obtenerlas de tu proveedor):
```
Usuario: tu_usuario
Contraseña: tu_contraseña
```

### Persistencia de Sesión

- La sesión se guarda automáticamente
- No necesitas iniciar sesión cada vez
- Para cerrar sesión, ve a la pestaña "Inicio" y presiona "Cerrar Sesión"

---

## 📺 Navegación

La app tiene 4 pestañas principales:

### 🏠 Inicio
- Información de tu cuenta
- Estado de suscripción
- Fecha de expiración
- Conexiones activas
- Botón para cerrar sesión

### 📡 TV
- Lista de canales en vivo
- Toca un canal para reproducirlo
- Streaming en tiempo real (M3U8/TS)

### 🎬 Películas
- Catálogo de películas VOD
- Toca una película para reproducirla
- Streaming bajo demanda

### 🎭 Series
- Catálogo de series
- Toca una serie para ver el primer episodio
- Acceso a temporadas y episodios

---

## ▶️ Reproductor de Video

### Controles Disponibles

- **Play/Pausa**: Toca el centro del video
- **Avanzar/Retroceder**: Desliza la barra de progreso
- **Volumen**: Usa los botones de volumen del dispositivo
- **Pantalla Completa**: Rota el dispositivo (automático)
- **Cerrar**: Botón de retroceso o gesto de deslizar

### Formatos Soportados

- **TV en Vivo**: M3U8, TS
- **Películas**: MP4, MKV, AVI
- **Series**: MP4, MKV

---

## 🎨 Características de la Interfaz

### Diseño Estilo Netflix

- **Tema Oscuro**: Reduce fatiga visual
- **Tarjetas con Logos**: Visualización atractiva
- **Navegación Intuitiva**: Bottom tabs para acceso rápido
- **Colores**:
  - Rojo (#E50914): Acción principal
  - Negro (#141414): Fondo
  - Gris (#2F2F2F): Tarjetas

### Responsive

- Adaptado para diferentes tamaños de pantalla
- Optimizado para Android (portrait y landscape)
- Funciona en tablets

---

## 🔧 Funcionalidades Avanzadas

### Categorías (Próximamente)

La estructura está preparada para filtrar por categorías:
- Deportes
- Noticias
- Entretenimiento
- Infantil
- etc.

### Búsqueda (Próximamente)

Puedes agregar funcionalidad de búsqueda editando las pantallas.

### Favoritos (Próximamente)

Sistema de favoritos para guardar canales/películas preferidas.

---

## 🐛 Solución de Problemas Comunes

### "Credenciales inválidas"

**Causa**: Usuario o contraseña incorrectos
**Solución**: 
- Verifica tus credenciales con tu proveedor
- Asegúrate de no tener espacios extra
- Prueba en el navegador: `https://zona593.live:8080/player_api.php?username=TU_USUARIO&password=TU_CONTRASEÑA`

### "No se pudieron cargar los canales"

**Causa**: Problema de conexión o servidor
**Solución**:
- Verifica tu conexión a internet
- Comprueba que el servidor esté activo
- Intenta cerrar sesión y volver a iniciar

### "El video no reproduce"

**Causa**: Stream no disponible o formato incompatible
**Solución**:
- Prueba con otro canal/película
- Verifica tu velocidad de internet (mínimo 5 Mbps)
- Algunos streams pueden estar temporalmente fuera de línea

### "La app se cierra sola"

**Causa**: Error en el código o memoria insuficiente
**Solución**:
- Reinicia la app
- Limpia caché: `npm start -- --clear`
- Verifica logs: `npx react-native log-android`

---

## 📱 Requisitos del Dispositivo

### Mínimos
- Android 5.0 (Lollipop) o superior
- 2 GB RAM
- Conexión a internet estable (3G mínimo)

### Recomendados
- Android 8.0 (Oreo) o superior
- 4 GB RAM
- Conexión WiFi o 4G/5G
- Pantalla HD (1280x720) o superior

---

## 🌐 Consumo de Datos

### Estimaciones por Hora

- **Calidad SD (480p)**: ~500 MB/hora
- **Calidad HD (720p)**: ~1.5 GB/hora
- **Calidad Full HD (1080p)**: ~3 GB/hora

**Recomendación**: Usa WiFi para evitar consumir tu plan de datos móviles.

---

## 🔒 Seguridad y Privacidad

### Datos Almacenados Localmente

- Usuario y contraseña (encriptados por AsyncStorage)
- Información de sesión
- No se almacenan videos ni contenido multimedia

### Permisos Requeridos

- **Internet**: Para streaming
- **Acceso a Red**: Para verificar conectividad

### Privacidad

- No se recopilan datos de uso
- No se comparte información con terceros
- Conexión directa con el servidor IPTV

---

## 💡 Consejos y Trucos

### Mejor Experiencia de Visualización

1. **Usa WiFi**: Mejor calidad y sin consumir datos móviles
2. **Cierra otras apps**: Libera memoria RAM
3. **Modo No Molestar**: Evita interrupciones durante la reproducción
4. **Brillo Automático**: Mejor visualización en diferentes ambientes

### Ahorro de Batería

1. Reduce el brillo de pantalla
2. Desactiva Bluetooth si no lo usas
3. Cierra apps en segundo plano
4. Usa modo de ahorro de energía

### Mejor Calidad de Stream

1. Conéctate a WiFi de 5 GHz si está disponible
2. Acércate al router
3. Cierra otras descargas/streams en la red
4. Reinicia el router si hay problemas

---

## 📞 Soporte

### Problemas con la App
- Revisa esta guía
- Consulta el archivo README.md
- Verifica los logs de error

### Problemas con Credenciales IPTV
- Contacta a tu proveedor Zona593
- Verifica el estado de tu suscripción
- Comprueba la fecha de expiración

### Problemas Técnicos
- Revisa la documentación de Expo: https://docs.expo.dev
- Consulta React Native docs: https://reactnative.dev

---

## 🎓 Para Desarrolladores

### Personalizar la App

1. **Cambiar colores**: Edita `src/utils/constantes.ts`
2. **Agregar funciones**: Crea nuevos componentes en `src/componentes/`
3. **Modificar pantallas**: Edita archivos en `src/pantallas/`
4. **Cambiar servidor**: Actualiza `IPTV_CONFIG.HOST` en constantes

### Estructura de Código

```
src/
├── pantallas/       # Vistas principales
├── componentes/     # Componentes reutilizables
├── servicios/       # Lógica de API
├── navegacion/      # Configuración de rutas
├── contexto/        # Estado global (Context API)
└── utils/           # Constantes y helpers
```

### Agregar Nueva Funcionalidad

Ejemplo: Agregar búsqueda

1. Crea `src/componentes/BarraBusqueda.tsx`
2. Agrega estado de búsqueda en la pantalla
3. Filtra resultados basado en el texto
4. Renderiza resultados filtrados

---

## 📚 Recursos Adicionales

- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Expo Video**: https://docs.expo.dev/versions/latest/sdk/video/
- **Xtream Codes API**: Documentación de tu proveedor

---

## ✅ Checklist de Uso

- [ ] App instalada correctamente
- [ ] Credenciales IPTV válidas
- [ ] Conexión a internet estable
- [ ] Sesión iniciada exitosamente
- [ ] Canales cargando correctamente
- [ ] Video reproduciéndose sin problemas
- [ ] Navegación fluida entre pestañas

¡Disfruta de tu contenido IPTV! 🎉📺

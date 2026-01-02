# ⚡ Inicio Rápido - IPTV Zona593

## 🚀 En 3 Pasos

### 1️⃣ Instalar Dependencias (Ya hecho ✅)
```bash
cd iptv-app
# Las dependencias ya están instaladas
```

### 2️⃣ Iniciar la App
```bash
npm start
```

### 3️⃣ Abrir en tu Dispositivo
- Descarga **Expo Go** desde Play Store
- Escanea el código QR que aparece en la terminal
- ¡Listo! La app se abrirá en tu teléfono

---

## 📱 Generar APK (Método Más Fácil)

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Login en Expo
```bash
eas login
```
*Si no tienes cuenta, créala gratis en expo.dev*

### Paso 3: Generar APK
```bash
eas build --platform android --profile preview
```

⏱️ Espera 10-20 minutos y recibirás un link para descargar el APK.

---

## 🎯 Probar la App

### Credenciales de Prueba
Necesitas credenciales válidas de Zona593. Contacta a tu proveedor para obtenerlas.

### Primera Vez
1. Abre la app
2. Ingresa tu usuario y contraseña
3. Presiona "Iniciar Sesión"
4. Explora: TV, Películas, Series

---

## 📂 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Documentación completa |
| `INSTRUCCIONES_APK.md` | Guía detallada para generar APK |
| `GUIA_USO.md` | Manual de usuario |
| `COMANDOS_RAPIDOS.md` | Comandos útiles |
| `API_XTREAM_CODES.md` | Documentación de la API |
| `RESUMEN_PROYECTO.md` | Resumen ejecutivo |

---

## 🆘 Problemas Comunes

### "Cannot find module..."
```bash
rm -rf node_modules
npm install
```

### "Metro bundler error"
```bash
npm start -- --clear
```

### "Build failed"
```bash
eas build --platform android --profile preview --clear-cache
```

---

## 💡 Tips

- **Desarrollo**: Usa `npm start` y Expo Go para probar rápidamente
- **Producción**: Usa `eas build` para generar APK distribuible
- **Debug**: Presiona `j` en la terminal para abrir debugger
- **Reload**: Agita el dispositivo y presiona "Reload"

---

## 📞 Ayuda

- **Documentación Expo**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Problemas con credenciales**: Contacta a Zona593

---

## ✅ Checklist

- [ ] Node.js instalado (v16+)
- [ ] Dependencias instaladas
- [ ] Expo Go instalado en el dispositivo
- [ ] Credenciales IPTV válidas
- [ ] Conexión a internet estable

---

**¡Eso es todo! Disfruta tu app IPTV** 🎉📺

Para más detalles, consulta `README.md` o `GUIA_USO.md`

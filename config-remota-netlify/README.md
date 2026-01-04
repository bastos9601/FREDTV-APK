# 📦 Configuración Remota para FRED TV

Esta carpeta contiene **todos los archivos necesarios** para implementar la configuración remota en tu app IPTV.

## 🎯 ¿Qué hace esto?

Te permite **cambiar el servidor IPTV de todas las APKs instaladas** sin necesidad de recompilar la aplicación. Solo editas un archivo JSON en Netlify y todas las apps se actualizan automáticamente.

---

## 📁 Archivos Incluidos

### Para Netlify (Subir a tu sitio):
- **`config.json`** - Archivo de configuración del servidor
- **`admin.html`** - Panel admin visual para editar la configuración

### Para tu App (Copiar al proyecto):
- **`configRemotaServicio.ts`** - Servicio que consulta la configuración remota
- **`App.tsx`** - App.tsx modificado con carga de configuración
- **`iptvServicio-modificaciones.ts`** - Modificaciones para iptvServicio.ts

### Documentación:
- **`INSTRUCCIONES.md`** - Guía completa de instalación paso a paso
- **`README.md`** - Este archivo

---

## 🚀 Instalación Rápida

### 1. Subir a Netlify
```bash
cp config-remota-netlify/config.json web/
cp config-remota-netlify/admin.html web/
cd web
netlify deploy --prod
```

### 2. Copiar a tu App
```bash
cp config-remota-netlify/configRemotaServicio.ts iptv-app/src/servicios/
```

### 3. Configurar URL
Edita `iptv-app/src/servicios/configRemotaServicio.ts` línea 15:
```typescript
private CONFIG_URL = 'https://TU-SITIO.netlify.app/config.json';
```

### 4. Modificar App.tsx
Copia el código de `config-remota-netlify/App.tsx` a tu `iptv-app/App.tsx`

### 5. Modificar iptvServicio.ts
Agrega los métodos de `iptvServicio-modificaciones.ts` a tu servicio

### 6. Recompilar APK
```bash
cd iptv-app
eas build --platform android
```

---

## 📖 Documentación Completa

Lee **`INSTRUCCIONES.md`** para una guía detallada paso a paso con todas las opciones y solución de problemas.

---

## 🎨 Panel Admin

Después de subir a Netlify, accede al panel en:
```
https://tu-sitio.netlify.app/admin.html
```

Desde ahí puedes:
- ✅ Cambiar el servidor principal
- ✅ Configurar servidores de respaldo
- ✅ Activar modo mantenimiento
- ✅ Ver vista previa del JSON
- ✅ Descargar config.json actualizado

---

## 🔄 Cómo Cambiar el Servidor

### Opción 1: Panel Admin (Recomendado)
1. Abre `https://tu-sitio.netlify.app/admin.html`
2. Edita "Servidor Principal"
3. Click "Guardar Cambios"
4. Descarga el `config.json`
5. Súbelo a Netlify

### Opción 2: Editar Directamente
1. Edita `config.json`
2. Cambia el campo `"servidor"`
3. Sube a Netlify

**Resultado:** En máximo 1 hora, todas las APKs usan el nuevo servidor.

---

## ⏱️ Tiempo de Actualización

- **Primera vez:** Inmediatamente al abrir la app
- **Actualizaciones:** Cada 1 hora automáticamente
- **Sin internet:** Usa el último servidor guardado en cache

---

## ✅ Ventajas

✅ Sin recompilar la APK
✅ Panel admin visual
✅ Actualización automática
✅ Funciona sin internet (cache)
✅ Gratis con Netlify
✅ Control total desde cualquier lugar

---

## 📞 Soporte

Si tienes problemas, consulta:
1. **`INSTRUCCIONES.md`** - Guía completa
2. **`../PASOS_CONFIGURACION_REMOTA.md`** - Pasos detallados
3. **`../iptv-app/CONFIGURACION_REMOTA.md`** - Documentación técnica

---

## 🎉 Resultado Final

Después de la instalación:
- ✅ Cambias el servidor editando un JSON
- ✅ Todas las APKs se actualizan automáticamente
- ✅ Panel admin visual incluido
- ✅ Sin necesidad de recompilar nunca más

---

**¡Listo para empezar!** Lee `INSTRUCCIONES.md` y sigue los pasos. 🚀

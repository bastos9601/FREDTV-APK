# 📦 Configuración Remota para FRED TV - Instrucciones de Instalación

## 📁 Contenido de esta Carpeta

Esta carpeta contiene todos los archivos necesarios para implementar la configuración remota en tu app IPTV.

```
config-remota-netlify/
├── config.json                          # Archivo de configuración (sube a Netlify)
├── admin.html                           # Panel admin visual (sube a Netlify)
├── configRemotaServicio.ts              # Servicio (copia a tu app)
├── App.tsx                              # App modificado (reemplaza o copia código)
├── iptvServicio-modificaciones.ts       # Modificaciones para iptvServicio
└── INSTRUCCIONES.md                     # Este archivo
```

---

## 🚀 Instalación Paso a Paso

### Paso 1: Subir Archivos a Netlify

**Archivos a subir:**
- `config.json`
- `admin.html`

**Cómo subirlos:**

**Opción A - Con Netlify CLI:**
```bash
# Copia los archivos a tu carpeta web
cp config-remota-netlify/config.json web/
cp config-remota-netlify/admin.html web/

# Sube a Netlify
cd web
netlify deploy --prod
```

**Opción B - Con Git:**
```bash
# Copia los archivos
cp config-remota-netlify/config.json web/
cp config-remota-netlify/admin.html web/

# Commit y push
git add web/config.json web/admin.html
git commit -m "Agregar configuración remota"
git push
```

**Opción C - Manual:**
1. Ve a tu dashboard de Netlify
2. Arrastra `config.json` y `admin.html` a tu sitio
3. Haz deploy

---

### Paso 2: Copiar Servicio a tu App

**Archivo:** `configRemotaServicio.ts`

**Ubicación destino:** `iptv-app/src/servicios/configRemotaServicio.ts`

```bash
cp config-remota-netlify/configRemotaServicio.ts iptv-app/src/servicios/
```

**⚠️ IMPORTANTE:** Edita el archivo y cambia la línea 15:
```typescript
private CONFIG_URL = 'https://TU-SITIO.netlify.app/config.json';
```

Por tu URL real de Netlify:
```typescript
private CONFIG_URL = 'https://fred-tv.netlify.app/config.json';
```

---

### Paso 3: Modificar App.tsx

**Opción A - Reemplazar completo:**
```bash
cp config-remota-netlify/App.tsx iptv-app/App.tsx
```

**Opción B - Copiar solo el código necesario:**

Abre `iptv-app/App.tsx` y agrega:

1. **Imports al inicio:**
```typescript
import { useEffect } from 'react';
import configRemotaServicio from './src/servicios/configRemotaServicio';
import iptvServicio from './src/servicios/iptvServicio';
```

2. **Dentro del componente App:**
```typescript
useEffect(() => {
  cargarConfiguracionRemota();
}, []);

const cargarConfiguracionRemota = async () => {
  try {
    console.log('Cargando configuración remota...');
    const config = await configRemotaServicio.obtenerConfiguracion();
    
    if (config) {
      iptvServicio.setBaseURL(config.servidor);
      console.log('✅ Servidor actualizado:', config.servidor);
      
      if (config.mantenimiento) {
        console.log('⚠️ Modo mantenimiento:', config.mensaje_mantenimiento);
      }
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
};
```

---

### Paso 4: Modificar iptvServicio.ts

Abre `iptv-app/src/servicios/iptvServicio.ts` y agrega estos dos métodos a la clase `IPTVService`:

```typescript
/**
 * Actualiza la URL base del servidor
 */
setBaseURL(url: string) {
  this.baseURL = url;
  console.log('Servidor IPTV actualizado a:', url);
}

/**
 * Obtiene la URL base actual
 */
getBaseURL(): string {
  return this.baseURL;
}
```

**Referencia:** Ver archivo `iptvServicio-modificaciones.ts` para más detalles.

---

### Paso 5: Recompilar la APK

Esta es la **última vez** que necesitas recompilar:

```bash
cd iptv-app
eas build --platform android
```

---

### Paso 6: Verificar que Funciona

1. **Verificar config.json en Netlify:**
   ```
   https://tu-sitio.netlify.app/config.json
   ```
   Deberías ver el JSON.

2. **Verificar panel admin:**
   ```
   https://tu-sitio.netlify.app/admin.html
   ```
   Deberías ver el panel visual.

3. **Probar en la app:**
   - Instala la APK
   - Abre la app
   - Verifica los logs (si estás en desarrollo)

---

## 🎨 Usar el Panel Admin

### Acceder al Panel:
```
https://tu-sitio.netlify.app/admin.html
```

### Cambiar el Servidor:

1. Abre el panel admin
2. Edita el campo "Servidor Principal"
3. Click en "Guardar Cambios"
4. Descarga el archivo `config.json`
5. Súbelo a Netlify (reemplaza el anterior)

**Resultado:** En máximo 1 hora, todas las APKs usan el nuevo servidor.

---

## 📝 Estructura del config.json

```json
{
  "servidor": "http://zgazy.com:8880",
  "servidores_backup": [
    "http://zona593.live:8080"
  ],
  "version_minima": "1.0.0",
  "mensaje_bienvenida": "Bienvenido a FRED TV",
  "mantenimiento": false,
  "mensaje_mantenimiento": "",
  "ultima_actualizacion": "2026-01-04T18:00:00Z"
}
```

### Para Cambiar el Servidor:

Solo edita el campo `"servidor"`:
```json
{
  "servidor": "http://nuevo-servidor.com:8880",
  ...
}
```

Y sube el archivo a Netlify.

---

## ⏱️ Tiempo de Actualización

- **Primera vez:** Inmediatamente al abrir la app
- **Actualizaciones:** Cada 1 hora automáticamente
- **Sin internet:** Usa el último servidor guardado en cache

---

## ✅ Checklist de Instalación

- [ ] Subir `config.json` a Netlify
- [ ] Subir `admin.html` a Netlify
- [ ] Copiar `configRemotaServicio.ts` a la app
- [ ] Cambiar `CONFIG_URL` en `configRemotaServicio.ts`
- [ ] Modificar `App.tsx`
- [ ] Modificar `iptvServicio.ts`
- [ ] Recompilar la APK
- [ ] Verificar que `config.json` sea accesible
- [ ] Verificar que el panel admin funcione
- [ ] Probar la app

---

## 🆘 Solución de Problemas

### La app no actualiza el servidor

**Causa:** URL incorrecta en `configRemotaServicio.ts`

**Solución:**
1. Verifica que `CONFIG_URL` sea correcta
2. Recompila la APK
3. Reinstala la app

### No puedo acceder a config.json

**Causa:** Archivo no está en Netlify

**Solución:**
1. Verifica que el archivo esté en la carpeta `web/`
2. Sube a Netlify: `netlify deploy --prod`
3. Verifica en el navegador

### La app usa el servidor viejo

**Causa:** Cache no actualizado

**Solución:**
1. Espera 1 hora (intervalo de actualización)
2. O borra los datos de la app
3. O reinstala la app

---

## 🎉 Resultado Final

Después de seguir estos pasos:

✅ Puedes cambiar el servidor sin recompilar la APK
✅ Tienes un panel admin visual
✅ Todas las APKs se actualizan automáticamente
✅ Funciona sin internet (usa cache)

---

## 📞 Documentación Adicional

Para más información, consulta:
- `../PASOS_CONFIGURACION_REMOTA.md` - Guía detallada
- `../CONFIGURACION_REMOTA_RESUMEN.md` - Resumen ejecutivo
- `../iptv-app/CONFIGURACION_REMOTA.md` - Documentación técnica

---

**¡Listo para empezar!** Sigue los pasos en orden y tendrás configuración remota funcionando. 🚀

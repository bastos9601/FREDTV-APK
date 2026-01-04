# 🌐 Configuración Remota del Servidor

## ¿Qué es esto?

Sistema que te permite **cambiar el servidor IPTV de todas las APKs instaladas** sin necesidad de actualizar la aplicación. Solo editas un archivo JSON en Netlify y todas las apps se actualizan automáticamente.

---

## 📋 Cómo Funciona

1. **Archivo config.json** está alojado en Netlify (carpeta `web/`)
2. La app consulta este archivo cada vez que inicia (o cada 1 hora)
3. Si el servidor cambió, la app lo actualiza automáticamente
4. Si no hay internet, usa el último servidor guardado en cache

---

## 🚀 Configuración Inicial

### Paso 1: Configurar URL de Netlify

Edita el archivo: `iptv-app/src/servicios/configRemotaServicio.ts`

Busca esta línea:
```typescript
private CONFIG_URL = 'https://tu-sitio.netlify.app/config.json';
```

Cámbiala por tu URL real de Netlify:
```typescript
private CONFIG_URL = 'https://fred-tv.netlify.app/config.json';
```

### Paso 2: Subir config.json a Netlify

El archivo `web/config.json` ya está creado. Solo necesitas hacer deploy a Netlify:

```bash
cd web
netlify deploy --prod
```

O si usas Git + Netlify automático, solo haz commit:
```bash
git add web/config.json
git commit -m "Agregar configuración remota"
git push
```

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

### Campos:

- **servidor**: URL del servidor IPTV principal (este es el que usa la app)
- **servidores_backup**: Lista de servidores alternativos (para futuro uso)
- **version_minima**: Versión mínima de la app requerida (para futuro uso)
- **mensaje_bienvenida**: Mensaje que se muestra al usuario
- **mantenimiento**: Si es `true`, puedes mostrar un mensaje de mantenimiento
- **mensaje_mantenimiento**: Mensaje a mostrar cuando está en mantenimiento
- **ultima_actualizacion**: Fecha de la última actualización

---

## 🔄 Cómo Cambiar el Servidor

### Opción 1: Editar directamente en Netlify

1. Ve a tu dashboard de Netlify
2. Abre el sitio
3. Ve a "Deploys" → "Deploy settings"
4. Edita el archivo `config.json`
5. Guarda y haz deploy

### Opción 2: Editar localmente y subir

1. Abre `web/config.json`
2. Cambia el campo `"servidor"`:
```json
{
  "servidor": "http://nuevo-servidor.com:8880",
  ...
}
```
3. Sube a Netlify:
```bash
cd web
netlify deploy --prod
```

### Opción 3: Desde GitHub (si usas integración)

1. Edita `web/config.json` en GitHub
2. Commit y push
3. Netlify hace deploy automáticamente

---

## ⏱️ Tiempo de Actualización

- **Primera vez**: La app consulta el servidor inmediatamente al iniciar
- **Después**: Consulta cada 1 hora
- **Cache**: Si no hay internet, usa el último servidor guardado

### Forzar actualización inmediata

Si quieres que la app verifique inmediatamente (sin esperar 1 hora), puedes agregar un botón en la app que llame a:

```typescript
await configRemotaServicio.forzarActualizacion();
```

---

## 🧪 Probar la Configuración

### 1. Verificar que el archivo está accesible

Abre en tu navegador:
```
https://tu-sitio.netlify.app/config.json
```

Deberías ver el JSON.

### 2. Probar en la app

1. Abre la app
2. Mira los logs en la consola:
```
Cargando configuración remota...
✅ Servidor actualizado desde configuración remota: http://zgazy.com:8880
```

3. Si ves esto, ¡funciona!

---

## 🛠️ Solución de Problemas

### La app no actualiza el servidor

**Causa**: La URL del config.json no está bien configurada

**Solución**:
1. Verifica que `CONFIG_URL` en `configRemotaServicio.ts` sea correcta
2. Verifica que el archivo esté accesible en el navegador
3. Revisa los logs de la app

### Error de CORS

**Causa**: Netlify bloquea las peticiones desde la app

**Solución**: Netlify normalmente permite CORS por defecto, pero si tienes problemas, agrega un archivo `web/_headers`:

```
/config.json
  Access-Control-Allow-Origin: *
```

### La app usa el servidor viejo

**Causa**: El cache no se ha actualizado

**Solución**:
1. Espera 1 hora (intervalo de actualización)
2. O cierra y abre la app varias veces
3. O borra los datos de la app

---

## 📱 Ejemplo de Uso Real

### Escenario: Cambiar de servidor

1. **Situación**: El servidor `zgazy.com` está caído
2. **Acción**: Editas `web/config.json`:
```json
{
  "servidor": "http://zona593.live:8080",
  ...
}
```
3. **Deploy**: Subes a Netlify
4. **Resultado**: En máximo 1 hora, todas las apps usan el nuevo servidor

### Escenario: Modo mantenimiento

1. **Situación**: Necesitas hacer mantenimiento
2. **Acción**: Editas `web/config.json`:
```json
{
  "servidor": "http://zgazy.com:8880",
  "mantenimiento": true,
  "mensaje_mantenimiento": "Estamos en mantenimiento. Volvemos en 30 minutos.",
  ...
}
```
3. **Deploy**: Subes a Netlify
4. **Resultado**: Puedes mostrar el mensaje en la app

---

## 🎯 Ventajas

✅ **Sin actualizar la APK**: Cambias el servidor sin recompilar
✅ **Instantáneo**: Cambios disponibles en minutos
✅ **Gratis**: Netlify es gratis para este uso
✅ **Simple**: Solo editas un archivo JSON
✅ **Cache**: Funciona sin internet usando el último servidor
✅ **Control total**: Puedes cambiar el servidor desde cualquier lugar

---

## 🔮 Mejoras Futuras

Puedes agregar:
- Panel admin web para editar el JSON visualmente
- Múltiples servidores con balanceo de carga
- Verificación de versión mínima de la app
- Mensajes push para notificar cambios
- Estadísticas de uso

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que el archivo `config.json` esté accesible en Netlify
2. Revisa los logs de la app
3. Verifica que la URL en `configRemotaServicio.ts` sea correcta

---

**¡Listo!** Ahora puedes cambiar el servidor de todas las APKs instaladas editando un simple archivo JSON en Netlify. 🎉

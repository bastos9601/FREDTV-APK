# Servidor Proxy para FRED TV Web

Este servidor proxy soluciona el problema de CORS permitiendo que la aplicación web se comunique con el servidor IPTV.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Iniciar el servidor

```bash
npm start
```

El servidor se iniciará en `http://localhost:3001`

## 🔧 Configuración

### Cambiar el servidor IPTV

Edita `server.js` y modifica:

```javascript
const IPTV_HOST = 'http://tu-servidor.com:8080';
```

### Cambiar el puerto

Edita `server.js` y modifica:

```javascript
const PORT = 3001;
```

## 🌐 Uso

Una vez iniciado el servidor proxy, configura tu aplicación web:

En `web/src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: 'http://localhost:3001/api',
  // ...
};
```

## 🔍 Verificar que funciona

Abre en tu navegador:
```
http://localhost:3001/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-01-02T...",
  "iptvHost": "http://zona593.live:8080"
}
```

## 📋 Logs

El servidor muestra logs de todas las peticiones:
- 📡 Peticiones entrantes
- ✅ Respuestas exitosas
- ❌ Errores

## 🛑 Detener el servidor

Presiona `Ctrl + C` en la terminal

## 🔒 Seguridad

⚠️ Este servidor es solo para desarrollo local. No lo uses en producción sin medidas de seguridad adicionales.

## 🐛 Solución de problemas

### Error: Cannot find module 'express'
```bash
npm install
```

### Error: Port 3001 already in use
Cambia el puerto en `server.js` o detén el proceso que está usando el puerto 3001.

### Error: ECONNREFUSED
El servidor IPTV no está disponible o la URL es incorrecta.

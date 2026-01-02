# 🚀 Cómo Iniciar FRED TV Web

## Método 1: Con Proxy Integrado (Recomendado)

Este método usa el proxy configurado en `package.json`.

### Pasos:

1. **Detén el servidor si está corriendo** (Ctrl+C)

2. **Inicia el servidor:**
```bash
cd web
npm start
```

3. **Espera a que abra el navegador** en `http://localhost:3000`

4. **Inicia sesión** con tus credenciales

### ✅ Ventajas:
- Solo un comando
- Configuración automática
- Más simple

### ❌ Desventajas:
- A veces el proxy de Create React App puede tener problemas
- Solo funciona en desarrollo

---

## Método 2: Con Servidor Proxy Separado (Más Confiable)

Este método usa un servidor Node.js independiente.

### Pasos:

1. **Instala el servidor proxy** (solo la primera vez):
```bash
cd proxy-server
npm install
```

2. **Inicia el servidor proxy** (en una terminal):
```bash
cd proxy-server
npm start
```

Deberías ver:
```
🚀 ================================
✅ Proxy Server FRED TV
🌐 Running on: http://localhost:3001
📡 IPTV Host: http://zona593.live:8080
================================
```

3. **Configura la app web** para usar el proxy:

Edita `web/src/utils/constantes.ts`:
```typescript
export const IPTV_CONFIG = {
  HOST: 'http://localhost:3001/api', // Cambia esto
  // ...
};
```

4. **Inicia la app web** (en otra terminal):
```bash
cd web
npm start
```

5. **Inicia sesión** en `http://localhost:3000`

### ✅ Ventajas:
- Más confiable
- Mejor control de errores
- Logs detallados
- Funciona en producción

### ❌ Desventajas:
- Requiere dos terminales
- Un paso extra de configuración

---

## 🔍 Verificar que Todo Funciona

### 1. Verifica el Proxy (Método 2)
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

### 2. Verifica la App Web
Abre la consola del navegador (F12) y busca:
```
Intentando iniciar sesión con: Prueba1212
Iniciando petición de login...
Respuesta recibida: {...}
Inicio de sesión exitoso
```

---

## 🐛 Solución de Problemas

### Error: "No se pudo conectar al servidor"

**Causa:** Problema de CORS o el servidor IPTV no responde

**Solución:**
1. Usa el Método 2 (servidor proxy separado)
2. Verifica que el servidor IPTV esté funcionando
3. Prueba desde la app móvil primero

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O simplemente cierra el proceso que está usando el puerto
```

### Error: "Port 3001 already in use"

**Solución:**
Cambia el puerto en `proxy-server/server.js`:
```javascript
const PORT = 3002; // Cambia a otro puerto
```

Y actualiza `web/src/utils/constantes.ts`:
```typescript
HOST: 'http://localhost:3002/api',
```

### No aparece nada en pantalla

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Compárteme el error

### Login no funciona

**Solución:**
1. Verifica tus credenciales
2. Prueba desde la app móvil primero
3. Revisa los logs del proxy (si usas Método 2)
4. Abre la pestaña "Network" en F12 y busca la petición

---

## 📋 Resumen Rápido

### Método 1 (Simple):
```bash
cd web
npm start
```

### Método 2 (Confiable):
Terminal 1:
```bash
cd proxy-server
npm install  # Solo la primera vez
npm start
```

Terminal 2:
```bash
cd web
npm start
```

---

## 🎯 Credenciales

Según tu captura de pantalla:
- **Usuario:** `Prueba1212`
- **Contraseña:** (tu contraseña)

---

## 📞 Ayuda

Si nada funciona, dime:
1. ¿Qué método estás usando?
2. ¿Qué error ves en la consola?
3. ¿Funciona la app móvil?
4. ¿Qué dice el servidor proxy (si usas Método 2)?

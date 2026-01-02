# 🚀 Instrucciones Rápidas - FRED TV Web

## ⚠️ IMPORTANTE: Problema de CORS Solucionado

Ya configuré un proxy para evitar problemas de CORS. Solo sigue estos pasos:

## 📋 Pasos para Iniciar

### 1. Detén el servidor si está corriendo
Presiona `Ctrl + C` en la terminal donde está corriendo

### 2. Reinicia el servidor
```bash
cd web
npm start
```

### 3. Espera a que abra el navegador
Se abrirá automáticamente en `http://localhost:3000`

### 4. Inicia sesión
Usa las credenciales de tu servidor IPTV:
- Usuario: `Prueba1212` (o el que tengas)
- Contraseña: tu contraseña

## 🔍 Verificar que funciona

Abre la consola del navegador (F12) y deberías ver:
```
Intentando iniciar sesión con: Prueba1212
Iniciando petición de login...
URL: /player_api.php
Respuesta recibida: {...}
Inicio de sesión exitoso
```

## ❌ Si aún no funciona

### Opción A: Verifica la consola del navegador
1. Presiona F12
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Copia el error y dímelo

### Opción B: Verifica la pestaña Network
1. Presiona F12
2. Ve a la pestaña "Network"
3. Haz clic en "Iniciar Sesión"
4. Busca la petición a `player_api.php`
5. Verifica el Status Code (debería ser 200)

### Opción C: Usa el servidor proxy alternativo

Si el proxy integrado no funciona, usa un servidor proxy separado:

1. Crea una carpeta `proxy-server` fuera de `web`:
```bash
cd ..
mkdir proxy-server
cd proxy-server
```

2. Crea el archivo `package.json`:
```json
{
  "name": "proxy-server",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0"
  }
}
```

3. Instala dependencias:
```bash
npm install
```

4. Crea `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const IPTV_HOST = 'http://zona593.live:8080';

app.get('/api/*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const url = `${IPTV_HOST}${path}`;
    console.log('Proxy request:', url, req.query);
    
    const response = await axios.get(url, {
      params: req.query,
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('✅ Proxy server running on http://localhost:3001');
});
```

5. Inicia el proxy:
```bash
node server.js
```

6. En otra terminal, modifica `web/src/utils/constantes.ts`:
```typescript
export const IPTV_CONFIG = {
  HOST: 'http://localhost:3001/api',
  // ...
};
```

7. Reinicia la app web:
```bash
cd web
npm start
```

## 🎯 Credenciales de Prueba

Según la imagen que compartiste, estás usando:
- **Usuario:** `Prueba1212`
- **Contraseña:** (la que tengas configurada)

## 📞 Si nada funciona

Dime:
1. ¿Qué error ves en la consola del navegador?
2. ¿El servidor proxy está corriendo?
3. ¿Puedes acceder al servidor desde la app móvil?

## ✅ Una vez que funcione

Podrás:
- 📺 Ver TV en Vivo
- 🎬 Ver Películas
- 📺 Ver Series
- ▶️ Reproducir contenido

¡Disfruta de FRED TV! 🎉

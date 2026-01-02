# Solución al Problema de CORS

## 🚨 ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) es una política de seguridad de los navegadores que bloquea peticiones HTTP desde un origen (dominio) diferente al del servidor.

## ❌ El Problema

Cuando intentas hacer login desde `http://localhost:3000` al servidor `http://zona593.live:8080`, el navegador bloquea la petición porque son dominios diferentes.

**Error típico en consola:**
```
Access to XMLHttpRequest at 'http://zona593.live:8080/player_api.php' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ Soluciones

### Opción 1: Proxy de Desarrollo (Recomendado para desarrollo)

Agrega un proxy en el `package.json`:

```json
{
  "name": "iptv-web",
  "version": "1.0.0",
  "proxy": "http://zona593.live:8080",
  ...
}
```

Luego modifica `src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: '', // Vacío para usar el proxy
  ENDPOINTS: {
    LOGIN: '/player_api.php',
    // ...
  }
};
```

**Reinicia el servidor de desarrollo después de este cambio.**

### Opción 2: Servidor Proxy Backend

Crea un servidor Node.js simple que haga de intermediario:

1. Crea una carpeta `proxy-server`:

```bash
mkdir proxy-server
cd proxy-server
npm init -y
npm install express cors axios
```

2. Crea `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const IPTV_HOST = 'http://zona593.live:8080';

app.get('/api/*', async (req, res) => {
  try {
    const url = `${IPTV_HOST}${req.path.replace('/api', '')}`;
    const response = await axios.get(url, {
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});
```

3. Ejecuta el proxy:

```bash
node server.js
```

4. Modifica `src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: 'http://localhost:3001/api',
  // ...
};
```

### Opción 3: Extensión de Navegador (Solo para pruebas)

Instala una extensión para deshabilitar CORS temporalmente:

**Chrome:**
- [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock)
- [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control)

**Firefox:**
- [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)

⚠️ **ADVERTENCIA:** Solo usa esto para desarrollo local. Nunca en producción.

### Opción 4: Configurar el Servidor IPTV (Requiere acceso al servidor)

Si tienes acceso al servidor, agrega estos headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 🔧 Implementación Rápida - Opción 1 (Proxy)

1. Abre `web/package.json`
2. Agrega esta línea después de `"private": true,`:

```json
"proxy": "http://zona593.live:8080",
```

3. Modifica `web/src/utils/constantes.ts`:

```typescript
export const IPTV_CONFIG = {
  HOST: '', // Cambia esto a vacío
  ENDPOINTS: {
    LOGIN: '/player_api.php',
    LIVE_CATEGORIES: '/player_api.php',
    LIVE_STREAMS: '/player_api.php',
    VOD_CATEGORIES: '/player_api.php',
    VOD_STREAMS: '/player_api.php',
    SERIES_CATEGORIES: '/player_api.php',
    SERIES: '/player_api.php',
    SERIES_INFO: '/player_api.php',
  }
};
```

4. Detén el servidor (`Ctrl+C`) y vuelve a iniciarlo:

```bash
npm start
```

## 🎯 Verificar si funciona

Abre la consola del navegador (F12) y busca:
- ✅ Sin errores de CORS
- ✅ Peticiones exitosas a `/player_api.php`
- ✅ Respuesta con `user_info`

## 📝 Notas Importantes

1. **Desarrollo vs Producción:**
   - En desarrollo: Usa proxy o servidor proxy local
   - En producción: Necesitas un backend o que el servidor IPTV permita CORS

2. **Seguridad:**
   - Nunca expongas credenciales en el código
   - Considera usar variables de entorno

3. **Alternativa:**
   - Si el problema persiste, considera usar la app móvil que no tiene restricciones CORS

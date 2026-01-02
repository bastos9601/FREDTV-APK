# 🔧 Solución Final - Error de CORS

## ✅ Cambios realizados:

1. **Variable de entorno** - `.env.production` con `REACT_APP_API_URL=/api`
2. **Configuración mejorada** - `netlify.toml` actualizado
3. **Build nuevo** - Compilado con las correcciones

---

## 📤 SUBIR A NETLIFY

### Paso 1: Subir el build
1. Ve a https://app.netlify.com/
2. Entra a tu sitio (fredtv)
3. Clic en **"Deploys"**
4. Arrastra la carpeta **`build`** completa

### Paso 2: IMPORTANTE - Verificar netlify.toml
Después de subir, verifica que el archivo `netlify.toml` esté en la raíz del sitio:

1. En Netlify, ve a **"Site configuration"** → **"Build & deploy"**
2. Verifica que el archivo `netlify.toml` esté presente
3. Si no está, súbelo manualmente:
   - Copia el contenido de `web/netlify.toml`
   - En Netlify: **"Site configuration"** → **"Redirects"**
   - Agrega las reglas manualmente

---

## 🔍 Verificar que el proxy funcione

Después de subir, abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('/api/player_api.php?username=Prueba1212&password=1212')
  .then(r => r.json())
  .then(d => console.log('✅ Proxy funciona:', d))
  .catch(e => console.error('❌ Proxy NO funciona:', e))
```

### ✅ Si funciona verás:
```
✅ Proxy funciona: {user_info: {...}, server_info: {...}}
```

### ❌ Si NO funciona verás:
```
❌ Proxy NO funciona: TypeError: Failed to fetch
```

---

## 🛠️ Si el proxy NO funciona en Netlify

### Opción A: Configurar redirects manualmente

1. En Netlify dashboard → **"Site configuration"** → **"Redirects"**
2. Clic en **"Add redirect rule"**
3. Configura:
   ```
   From: /api/*
   To: http://zona593.live:8080/:splat
   Status: 200 (Proxy)
   Force: Yes
   ```

### Opción B: Usar Netlify Functions (Más confiable)

Si el proxy simple no funciona, necesitarás crear una Netlify Function:

1. Crea el archivo `web/netlify/functions/proxy.js`:

```javascript
const axios = require('axios');

exports.handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/proxy', '');
  const url = `http://zona593.live:8080${path}${event.rawQuery ? '?' + event.rawQuery : ''}`;
  
  try {
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

2. Actualiza `constantes.ts`:
```typescript
HOST: '/.netlify/functions/proxy',
```

3. Instala axios en el proyecto:
```bash
npm install axios
```

4. Vuelve a hacer build y sube

---

## 🎯 Alternativa: Usar CORS Proxy público (Temporal)

Si nada funciona, puedes usar un proxy CORS público temporalmente:

Actualiza `constantes.ts`:
```typescript
const CORS_PROXY = 'https://corsproxy.io/?';
const API_SERVER = 'http://zona593.live:8080';

export const IPTV_CONFIG = {
  HOST: process.env.NODE_ENV === 'production' 
    ? CORS_PROXY + encodeURIComponent(API_SERVER)
    : '',
  // ...
};
```

**⚠️ NOTA:** Los proxies públicos son lentos y no confiables. Úsalo solo para probar.

---

## 📋 Checklist de solución

- [x] Build nuevo creado
- [x] Variable de entorno configurada
- [x] netlify.toml actualizado
- [ ] Build subido a Netlify
- [ ] Proxy verificado con fetch
- [ ] Login probado y funcionando

---

## 🆘 Si NADA funciona

El problema puede ser que el servidor `zona593.live:8080` no permita proxies. En ese caso:

1. **Contacta al proveedor del servidor** para que agregue tu dominio de Netlify a la lista de CORS permitidos
2. **Usa la app móvil** que no tiene problemas de CORS
3. **Despliega tu propio proxy** en un servidor que controles

---

## 📞 Comandos útiles

```bash
# Crear nuevo build
cd web
npm run build

# Probar localmente
npx serve -s build

# Ver logs de Netlify
netlify logs

# Deploy con CLI
netlify deploy --prod --dir=build
```

---

¡El nuevo build está listo en `web/build`! Súbelo a Netlify y verifica el proxy.

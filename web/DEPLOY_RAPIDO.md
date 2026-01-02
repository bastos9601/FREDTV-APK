# 🚀 Deploy Rápido a Netlify

## Método más fácil (5 minutos)

### 1. Crear el build
```bash
cd web
npm install
npm run build
```

O en Windows, simplemente ejecuta:
```bash
deploy.bat
```

### 2. Subir a Netlify
1. Ve a **https://app.netlify.com/**
2. Inicia sesión (o crea cuenta gratis)
3. Clic en **"Add new site"** → **"Deploy manually"**
4. **Arrastra la carpeta `build`** a la zona de drop
5. ¡Listo! Tu sitio estará en línea

### 3. Tu sitio estará en una URL como:
```
https://tu-sitio-random.netlify.app
```

---

## Cambiar el nombre del sitio

1. En el dashboard de Netlify
2. **Site settings** → **Change site name**
3. Elige un nombre: `mi-iptv-app.netlify.app`

---

## Deploy automático desde GitHub (Opcional)

Si quieres que se actualice automáticamente:

1. Sube tu código a GitHub
2. En Netlify: **"Add new site"** → **"Import from Git"**
3. Conecta tu repositorio
4. Configuración:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Cada push a GitHub = deploy automático

---

## ⚠️ Importante: CORS

Tu app hace peticiones a `http://zona593.live:8080`. Para que funcione en producción:

1. El servidor debe permitir CORS desde tu dominio de Netlify
2. O necesitas configurar un proxy en Netlify

### Solución temporal: Proxy en Netlify

Agrega esto a `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "http://zona593.live:8080/:splat"
  status = 200
  force = true
```

Y cambia las URLs en tu código de:
```javascript
http://zona593.live:8080/player_api.php
```

A:
```javascript
/api/player_api.php
```

---

## 📱 Resultado

Tu app estará disponible en:
- ✅ Web (cualquier navegador)
- ✅ Móvil (responsive)
- ✅ HTTPS automático
- ✅ CDN global (rápido en todo el mundo)

---

## 🆓 Plan gratuito de Netlify incluye:

- 100 GB de ancho de banda/mes
- 300 minutos de build/mes
- Deploy ilimitados
- HTTPS automático
- Dominio personalizado

¡Más que suficiente para tu proyecto!

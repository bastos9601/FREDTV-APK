# 🚀 Deploy Manual - Paso a Paso

## ✅ Opción 2: Deploy manual (10 segundos)

---

## 📋 PASO 1: Detener builds automáticos de GitHub

1. Ve a: **https://app.netlify.com/**
2. Entra a tu sitio (**fredtv** o **genuine-basbouza-31388c**)
3. En el menú izquierdo, clic en **"Site configuration"**
4. Clic en **"Build & deploy"**
5. Scroll hacia abajo hasta **"Build settings"**
6. Clic en **"Stop builds"** o **"Clear build cache and retry deploy"**
7. Confirma la acción

**Resultado:** Los builds automáticos de GitHub están desactivados.

---

## 📋 PASO 2: Subir el build manualmente

1. En el menú izquierdo, clic en **"Deploys"**
2. Scroll hacia abajo hasta ver la zona que dice:
   ```
   "Need to update your site? Drag and drop your site output folder here"
   ```
3. Abre el explorador de Windows y ve a:
   ```
   C:\Users\Alfredo\Desktop\iptv-apk\web\build
   ```
4. **Arrastra la carpeta `build` COMPLETA** a la zona de Netlify
5. Espera 10-30 segundos mientras sube

**Resultado:** Tu sitio estará en línea!

---

## 🔍 PASO 3: Verificar que funcione

1. Netlify te mostrará la URL de tu sitio (ejemplo: `https://fredtv.netlify.app`)
2. Clic en **"Open production deploy"** o copia la URL
3. Abre tu sitio en el navegador
4. Intenta hacer login con:
   - Usuario: `Prueba1212`
   - Contraseña: `1212`

### ✅ Si funciona:
- Login exitoso
- Canales cargan
- Sin errores de CORS

### ❌ Si sigue con error de CORS:
Abre la consola (F12) y ejecuta:
```javascript
fetch('/api/player_api.php?username=Prueba1212&password=1212')
  .then(r => r.json())
  .then(d => console.log('✅ Proxy funciona:', d))
  .catch(e => console.error('❌ Proxy NO funciona:', e))
```

---

## 🛠️ PASO 4: Si el proxy NO funciona

### Configurar redirects manualmente:

1. En Netlify, ve a **"Site configuration"**
2. Clic en **"Redirects and rewrites"**
3. Clic en **"Add redirect rule"**
4. Configura:
   ```
   From: /api/*
   To: http://zona593.live:8080/:splat
   Status: 200 - Proxy
   Force: ✓ (marcado)
   ```
5. Clic en **"Save"**
6. Espera 1 minuto
7. Prueba el login de nuevo

---

## 📸 Guía visual

```
Netlify Dashboard
├── Site configuration
│   └── Build & deploy
│       └── Stop builds ← PASO 1
│
└── Deploys
    └── Drag and drop zone ← PASO 2
        └── Arrastra: web/build
```

---

## ⚠️ IMPORTANTE

**Arrastra la carpeta `build` COMPLETA**, no los archivos dentro de ella.

❌ **Incorrecto:**
```
Arrastrar: index.html, static/, etc.
```

✅ **Correcto:**
```
Arrastrar: la carpeta "build" completa
```

---

## 🎯 Ubicación de la carpeta

```
C:\Users\Alfredo\Desktop\iptv-apk\web\build
```

Dentro debe tener:
- index.html
- static/
- netlify.toml
- _redirects
- favicon.ico
- etc.

---

## 🔄 Para actualizar en el futuro

Cada vez que hagas cambios:

1. Crear nuevo build:
   ```bash
   cd web
   npm run build
   ```

2. Arrastrar la carpeta `build` de nuevo a Netlify

¡Así de simple!

---

## ✅ Ventajas del deploy manual

- ✅ Súper rápido (10 segundos)
- ✅ Sin configuración complicada
- ✅ Sin problemas de GitHub
- ✅ Control total sobre lo que subes
- ✅ Puedes probar localmente antes

---

## 📞 Resumen

1. **Detener builds** → Site configuration → Build & deploy → Stop builds
2. **Arrastrar build** → Deploys → Drag & drop → `web/build`
3. **Probar login** → Abrir sitio → Login
4. **Si falla CORS** → Configurar redirects manualmente

---

**¡Listo! Ahora ve a Netlify y arrastra la carpeta `web/build`!** 🚀

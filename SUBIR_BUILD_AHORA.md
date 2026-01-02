# 🚀 SUBIR BUILD NUEVO - SOLUCIÓN CORS

## ✅ Build listo con:
- ✅ Variable de entorno `/api`
- ✅ Proxy configurado en `netlify.toml`
- ✅ Archivo `netlify.toml` incluido en el build
- ✅ Sin errores de compilación

---

## 📤 PASOS PARA SUBIR (2 minutos)

### 1. Abre Netlify
```
https://app.netlify.com/
```

### 2. Entra a tu sitio
Busca: **fredtv** o **genuine-basbouza-31388c**

### 3. Ve a Deploys
Clic en **"Deploys"** en el menú superior

### 4. Arrastra la carpeta build
- Scroll hacia abajo hasta ver: **"Need to update your site?"**
- Arrastra la carpeta: `C:\Users\Alfredo\Desktop\iptv-apk\web\build`
- O busca el botón **"Deploy manually"**

### 5. Espera el deploy (10-30 segundos)

---

## 🔍 VERIFICAR QUE FUNCIONE

### Paso 1: Abrir la consola
1. Abre tu sitio en Netlify
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **"Console"**

### Paso 2: Probar el proxy
Copia y pega este código en la consola:

```javascript
fetch('/api/player_api.php?username=Prueba1212&password=1212')
  .then(r => r.json())
  .then(d => console.log('✅ PROXY FUNCIONA:', d))
  .catch(e => console.error('❌ PROXY NO FUNCIONA:', e))
```

### ✅ Si funciona verás:
```
✅ PROXY FUNCIONA: {user_info: {auth: 1, ...}, server_info: {...}}
```

### ❌ Si NO funciona verás:
```
❌ PROXY NO FUNCIONA: TypeError: Failed to fetch
```

---

## 🛠️ SI EL PROXY NO FUNCIONA

### Solución: Configurar redirects manualmente en Netlify

1. En tu sitio de Netlify
2. Ve a **"Site configuration"** (menú izquierdo)
3. Clic en **"Redirects and rewrites"**
4. Clic en **"Add redirect rule"**
5. Configura:
   ```
   From: /api/*
   To: http://zona593.live:8080/:splat
   Status: 200 - Proxy
   Force: ✓ (marcado)
   ```
6. Clic en **"Save"**
7. Espera 1 minuto y prueba de nuevo

---

## 📋 Ubicación de archivos

```
C:\Users\Alfredo\Desktop\iptv-apk\web\build\
├── static/
├── index.html
├── netlify.toml  ← IMPORTANTE: Debe estar aquí
├── _redirects
└── ...
```

---

## 🎯 Resultado esperado

Después de subir y configurar:
- ✅ Login funcionará sin errores
- ✅ Canales cargarán correctamente
- ✅ Reproducción funcionará
- ✅ Sin errores de CORS en la consola

---

## 🆘 Si sigue sin funcionar

El servidor `zona593.live:8080` puede estar bloqueando proxies. Opciones:

1. **Contactar al proveedor** para agregar tu dominio de Netlify
2. **Usar la app móvil** (no tiene problemas de CORS)
3. **Desplegar un proxy propio** en otro servidor

---

## 📞 Ayuda adicional

Ver archivo: `web/SOLUCION_FINAL.md` para más opciones y alternativas.

---

**¡El build está listo! Solo falta arrastrarlo a Netlify!** 🚀

Carpeta a arrastrar: `C:\Users\Alfredo\Desktop\iptv-apk\web\build`

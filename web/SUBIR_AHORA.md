# 🚀 SUBIR BUILD NUEVO A NETLIFY

## ✅ Build nuevo creado exitosamente

La carpeta `build` está lista con:
- ✅ Proxy configurado (`/api`)
- ✅ URLs corregidas para producción
- ✅ Archivo `_redirects` incluido
- ✅ Sin errores de compilación

---

## 📤 PASOS PARA SUBIR (1 minuto)

### 1. Abre Netlify
Ve a: **https://app.netlify.com/**

### 2. Entra a tu sitio
Busca tu sitio en la lista (ejemplo: `genuine-basbouza-31388c`)

### 3. Ve a la sección Deploys
Clic en **"Deploys"** en el menú superior

### 4. Arrastra la carpeta build
- Verás una zona que dice: **"Need to update your site? Drag and drop your site output folder here"**
- Arrastra la carpeta **`web/build`** completa a esa zona
- O busca el botón **"Deploy manually"** y arrastra ahí

### 5. Espera el deploy
- Netlify procesará el build (10-30 segundos)
- Verás un mensaje de "Site is live"

### 6. Prueba el login
- Abre tu sitio
- Intenta hacer login con tus credenciales
- ✅ Debería funcionar sin errores de CORS

---

## 🎯 Ubicación de la carpeta

La carpeta que debes arrastrar está en:
```
C:\Users\Alfredo\Desktop\iptv-apk\web\build
```

**IMPORTANTE:** Arrastra la carpeta **`build`** completa, no los archivos dentro de ella.

---

## 🔍 Cómo verificar que funcionó

Después de subir, abre la consola del navegador (F12) y deberías ver:

### ✅ Correcto:
```
Iniciando petición de login...
URL: /api/player_api.php
Params: {username: "Prueba1212", password: "***"}
Respuesta recibida: {user_info: {...}}
```

### ❌ Si aún falla:
```
Error de red - no se recibió respuesta
CORS policy: No 'Access-Control-Allow-Origin'
```

Si ves el error, significa que subiste el build anterior. Asegúrate de arrastrar la carpeta `build` que acabamos de crear.

---

## 🔄 Si necesitas volver a crear el build

```bash
cd web
Remove-Item -Recurse -Force build
npm run build
```

---

## 📋 Checklist

- [x] Build anterior borrado
- [x] Build nuevo creado
- [x] Proxy configurado en netlify.toml
- [x] URLs actualizadas en el código
- [x] Archivo _redirects incluido
- [ ] Build subido a Netlify
- [ ] Login probado y funcionando

---

## 🆘 Solución de problemas

### Problema: "No encuentro la zona para arrastrar"
**Solución:** 
1. En tu sitio de Netlify
2. Clic en "Deploys" (menú superior)
3. Scroll hacia abajo
4. Verás: "Need to update your site?"

### Problema: "Sigue sin funcionar después de subir"
**Solución:**
1. Limpia caché del navegador: **Ctrl + Shift + R**
2. Verifica en Netlify que el deploy se completó
3. Espera 1-2 minutos para que se propague

### Problema: "No puedo arrastrar la carpeta"
**Solución:**
1. Usa Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   cd web
   netlify deploy --prod --dir=build
   ```

---

## 🎉 Resultado esperado

Después de subir el nuevo build:
- ✅ Login funcionará
- ✅ Canales cargarán
- ✅ Reproducción funcionará
- ✅ Sin errores de CORS

---

**¡El build está listo! Solo falta arrastrarlo a Netlify!** 🚀

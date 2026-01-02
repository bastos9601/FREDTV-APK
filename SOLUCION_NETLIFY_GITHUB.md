# 🎯 Solución: Netlify + GitHub

## ❌ El problema:
Netlify está conectado con GitHub pero el build falla porque busca `package.json` en la raíz, pero está en `web/package.json`.

```
Error: ENOENT: no such file or directory, open '/opt/build/repo/package.json'
```

## ✅ La solución:
He configurado `base = "web"` en `netlify.toml` para que Netlify use la carpeta `web` como directorio base.

---

## 🚀 OPCIÓN 1: Actualizar vía GitHub (Recomendado)

### Paso 1: Hacer commit y push

**Opción A - Script automático:**
```bash
actualizar-netlify.bat
```

**Opción B - Manual:**
```bash
git add .
git commit -m "Fix: Configurar Netlify base directory"
git push origin main
```

### Paso 2: Esperar el deploy automático
1. Ve a https://app.netlify.com/
2. Entra a tu sitio
3. Ve a "Deploys"
4. Verás un nuevo deploy en progreso
5. Espera 2-3 minutos

### Paso 3: Verificar
- ✅ Build exitoso
- ✅ Deploy completado
- ✅ Probar el login

---

## 🎯 OPCIÓN 2: Deploy manual (Más rápido)

Si no quieres esperar el build de GitHub:

### Paso 1: Desconectar GitHub (Opcional)
1. Netlify → "Site configuration" → "Build & deploy"
2. Clic en "Stop builds" o "Clear build cache"

### Paso 2: Subir build manualmente
1. Ve a "Deploys"
2. Arrastra la carpeta `web/build`
3. ¡Listo en 10 segundos!

---

## 📋 Cambios realizados

### Archivo: `netlify.toml` (raíz del proyecto)
```toml
[build]
  command = "npm run build"
  publish = "build"
  base = "web"  ← NUEVO: Le dice a Netlify que use la carpeta web

[build.environment]
  NODE_VERSION = "18"
  REACT_APP_API_URL = "/api"

[[redirects]]
  from = "/api/*"
  to = "http://zona593.live:8080/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Archivo: `web/.env.production`
```
REACT_APP_API_URL=/api
```

### Archivo: `web/src/utils/constantes.ts`
```typescript
const API_BASE = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : '');

export const IPTV_CONFIG = {
  HOST: API_BASE,
  // ...
};
```

---

## 🔍 Cómo verificar que funciona

### 1. Build exitoso en Netlify
Deberías ver:
```
✓ Build script success
✓ Site is live
```

### 2. Probar el proxy
Abre la consola (F12) en tu sitio y ejecuta:
```javascript
fetch('/api/player_api.php?username=Prueba1212&password=1212')
  .then(r => r.json())
  .then(d => console.log('✅ Funciona:', d))
  .catch(e => console.error('❌ Error:', e))
```

### 3. Probar el login
- Abre tu sitio
- Intenta hacer login
- Debería funcionar sin errores de CORS

---

## 🆘 Si el build sigue fallando

### Error: "Could not read package.json"
**Solución:** Verifica que `base = "web"` esté en `netlify.toml` en la raíz.

### Error: "npm ERR! missing script: build"
**Solución:** Verifica que `web/package.json` tenga el script `"build": "react-scripts build"`

### Error: CORS persiste
**Solución:** El proxy de Netlify puede no funcionar con ese servidor. Opciones:
1. Contactar al proveedor del servidor
2. Usar deploy manual con build local
3. Usar la app móvil

---

## 📊 Comparación de opciones

| Método | Velocidad | Automático | Recomendado |
|--------|-----------|------------|-------------|
| GitHub + Netlify | 2-3 min | ✅ Sí | ✅ Para producción |
| Deploy manual | 10 seg | ❌ No | ✅ Para pruebas |

---

## 🎉 Resultado esperado

Después de actualizar:
- ✅ Build exitoso en Netlify
- ✅ Login funciona sin CORS
- ✅ Canales cargan correctamente
- ✅ Reproducción funciona
- ✅ Deploy automático en cada push

---

## 📞 Comandos útiles

```bash
# Ver estado de Git
git status

# Ver último commit
git log -1

# Ver rama actual
git branch

# Forzar push (si es necesario)
git push -f origin main

# Ver configuración de Netlify
cat netlify.toml
```

---

**Ejecuta `actualizar-netlify.bat` o haz el commit manualmente!** 🚀

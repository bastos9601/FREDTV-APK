# ⚙️ Configurar Netlify desde el Dashboard

## ❌ El problema:
El archivo `netlify.toml` tiene `base = "web"` pero Netlify no lo está detectando correctamente.

## ✅ Solución: Configurar manualmente en el dashboard

---

## 🎯 PASOS PARA CONFIGURAR

### 1. Ir a Site Configuration
1. Ve a https://app.netlify.com/
2. Entra a tu sitio (fredtv)
3. Clic en **"Site configuration"** en el menú izquierdo

### 2. Configurar Build settings
1. En el menú lateral, clic en **"Build & deploy"**
2. Scroll hasta **"Build settings"**
3. Clic en **"Edit settings"**

### 3. Configurar los valores

**Base directory:**
```
web
```

**Build command:**
```
npm run build
```

**Publish directory:**
```
web/build
```

### 4. Configurar variables de entorno
1. En el mismo menú, scroll hasta **"Environment variables"**
2. Clic en **"Add a variable"**
3. Agrega:
   ```
   Key: REACT_APP_API_URL
   Value: /api
   ```
4. Agrega otra:
   ```
   Key: NODE_VERSION
   Value: 18
   ```

### 5. Guardar y hacer deploy
1. Clic en **"Save"**
2. Ve a **"Deploys"**
3. Clic en **"Trigger deploy"** → **"Deploy site"**
4. Espera 2-3 minutos

---

## 📸 Configuración visual

```
┌─────────────────────────────────────┐
│ Build settings                      │
├─────────────────────────────────────┤
│ Base directory:        web          │
│ Build command:         npm run build│
│ Publish directory:     web/build    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Environment variables               │
├─────────────────────────────────────┤
│ REACT_APP_API_URL     /api          │
│ NODE_VERSION          18            │
└─────────────────────────────────────┘
```

---

## 🔍 Verificar la configuración

Después de guardar, verifica que se vea así:

```
Build settings
  Base directory: web
  Build command: npm run build
  Publish directory: web/build
  
Environment variables
  REACT_APP_API_URL = /api
  NODE_VERSION = 18
```

---

## 🚀 Hacer el deploy

### Opción 1: Trigger deploy manual
1. Ve a **"Deploys"**
2. Clic en **"Trigger deploy"**
3. Selecciona **"Deploy site"**
4. Espera 2-3 minutos

### Opción 2: Push a GitHub
```bash
git add .
git commit -m "Update config"
git push origin main
```

---

## ✅ Build exitoso

Deberías ver:
```
✓ Base directory: web
✓ Installing dependencies
✓ npm install
✓ npm run build
✓ Build script success
✓ Site is live
```

---

## 🆘 Si sigue fallando

### Opción A: Desconectar GitHub y usar deploy manual

1. En **"Build & deploy"** → **"Build settings"**
2. Clic en **"Stop builds"**
3. Confirma
4. Ve a **"Deploys"**
5. Arrastra la carpeta `web/build` manualmente

### Opción B: Verificar el repositorio

1. Verifica que el archivo `netlify.toml` esté en la raíz del repo en GitHub
2. Verifica que la carpeta `web` exista en GitHub
3. Verifica que `web/package.json` exista

---

## 📋 Checklist de configuración

- [ ] Base directory: `web`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `web/build`
- [ ] Variable: `REACT_APP_API_URL = /api`
- [ ] Variable: `NODE_VERSION = 18`
- [ ] Trigger deploy
- [ ] Build exitoso
- [ ] Login funciona

---

## 🎯 Alternativa rápida: Deploy manual

Si no quieres lidiar con la configuración de GitHub:

1. **Detener builds automáticos:**
   - Site configuration → Build & deploy
   - Stop builds

2. **Subir build manualmente:**
   - Deploys → Drag & drop
   - Arrastra `web/build`
   - ¡Listo en 10 segundos!

---

**Configura el Base directory en el dashboard y haz trigger deploy!** ⚙️

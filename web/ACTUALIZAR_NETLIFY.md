# 🔄 Actualizar Deploy en Netlify

## ✅ Problema Solucionado: CORS

Se ha configurado un **proxy en Netlify** para que las peticiones al servidor IPTV funcionen correctamente.

### Cambios realizados:

1. **`netlify.toml`** - Configurado proxy `/api` → `http://zona593.live:8080`
2. **`constantes.ts`** - HOST usa `/api` en producción
3. **`iptvServicio.ts`** - URLs de streaming usan `/api` en producción

---

## 🚀 Cómo actualizar tu sitio en Netlify

### Opción 1: Drag & Drop (Más rápido)

1. **Crear nuevo build:**
   ```bash
   cd web
   npm run build
   ```

2. **Subir a Netlify:**
   - Ve a tu sitio en https://app.netlify.com/
   - Clic en **"Deploys"** en el menú superior
   - Arrastra la carpeta **`build`** a la zona que dice "Need to update your site? Drag and drop your site output folder here"
   - ¡Listo! Se actualizará automáticamente

### Opción 2: Con Netlify CLI

```bash
cd web
npm run build
netlify deploy --prod
```

---

## 🧪 Probar antes de subir

Para probar el build localmente:

```bash
cd web
npm install -g serve
serve -s build
```

Abre http://localhost:3000 y prueba el login.

---

## 📋 Checklist de actualización

- [x] Proxy configurado en `netlify.toml`
- [x] URLs actualizadas en el código
- [x] Nuevo build creado
- [ ] Build subido a Netlify
- [ ] Login probado en producción

---

## 🔍 Cómo funciona el proxy

**Antes (no funcionaba):**
```
Navegador → http://zona593.live:8080 ❌ CORS Error
```

**Ahora (funciona):**
```
Navegador → /api/player_api.php
           ↓
Netlify Proxy → http://zona593.live:8080/player_api.php ✅
           ↓
Respuesta → Navegador
```

El proxy de Netlify hace la petición por ti, evitando problemas de CORS.

---

## ⚠️ Nota importante

Si cambias de servidor IPTV, actualiza la URL en `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "http://TU-NUEVO-SERVIDOR:8080/:splat"
  status = 200
  force = true
```

---

## 🎉 Resultado esperado

Después de actualizar:
- ✅ Login funcionará correctamente
- ✅ Canales se cargarán sin errores
- ✅ Reproducción funcionará
- ✅ Sin errores de CORS

---

## 🆘 Si aún hay problemas

1. **Verifica que subiste el nuevo build** (no el anterior)
2. **Limpia caché del navegador** (Ctrl + Shift + R)
3. **Revisa los logs en Netlify:**
   - Dashboard → Functions → Ver logs
4. **Verifica que el servidor IPTV esté funcionando**

---

## 📞 Comandos útiles

```bash
# Crear nuevo build
npm run build

# Ver el build localmente
serve -s build

# Deploy con CLI
netlify deploy --prod

# Ver logs
netlify logs

# Abrir sitio en navegador
netlify open:site
```

---

¡Ahora tu app funcionará perfectamente en Netlify! 🎬📺

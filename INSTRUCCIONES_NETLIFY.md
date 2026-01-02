# 🚀 Tu App Web está Lista para Netlify

## ✅ Lo que se ha preparado:

1. **Build de producción creado** ✓
   - Carpeta `web/build` lista para subir
   - Tamaño optimizado: ~255 KB (comprimido)
   - Sin errores de compilación

2. **Archivos de configuración** ✓
   - `web/netlify.toml` - Configuración de Netlify
   - `web/public/_redirects` - Soporte para React Router
   - `web/deploy.bat` - Script de deploy automático

3. **Documentación** ✓
   - `web/DEPLOY_RAPIDO.md` - Guía rápida (5 min)
   - `web/DEPLOY_NETLIFY.md` - Guía completa

---

## 🎯 PASOS PARA SUBIR (2 minutos)

### Opción A: Drag & Drop (Más fácil)

1. Abre: **https://app.netlify.com/**
2. Inicia sesión o crea cuenta (gratis)
3. Clic en **"Add new site"** → **"Deploy manually"**
4. Arrastra la carpeta **`web/build`** a la pantalla
5. ¡Listo! Tu sitio estará en línea

### Opción B: Desde GitHub (Deploy automático)

1. Sube tu código a GitHub
2. En Netlify: **"Import from Git"**
3. Conecta tu repo
4. Configuración:
   ```
   Build command: npm run build
   Publish directory: build
   Base directory: web
   ```
5. Cada push = deploy automático

---

## 📋 Checklist antes de deploy

- [x] Build creado sin errores
- [x] Archivos de configuración listos
- [x] Redirects para React Router configurados
- [ ] Cuenta de Netlify creada
- [ ] Sitio desplegado

---

## 🌐 Después del deploy

Tu app estará disponible en una URL como:
```
https://random-name-123.netlify.app
```

### Personalizar el nombre:
1. En Netlify dashboard
2. **Site settings** → **Change site name**
3. Elige: `mi-iptv-app` → `mi-iptv-app.netlify.app`

### Dominio personalizado (opcional):
1. **Domain settings** → **Add custom domain**
2. Sigue las instrucciones para tu dominio

---

## ⚠️ Nota importante: CORS

Tu app se conecta a `http://zona593.live:8080`. 

**Si tienes problemas de CORS en producción:**

1. El servidor debe permitir peticiones desde tu dominio de Netlify
2. O configura un proxy (ver `web/DEPLOY_RAPIDO.md`)

---

## 🎉 Características incluidas

- ✅ HTTPS automático
- ✅ CDN global (rápido en todo el mundo)
- ✅ Deploy en segundos
- ✅ Rollback instantáneo
- ✅ Preview de cada deploy
- ✅ 100% gratis para tu proyecto

---

## 📞 Soporte

- Documentación Netlify: https://docs.netlify.com/
- Status: https://www.netlifystatus.com/

---

## 🚀 ¡Listo para despegar!

Ejecuta en Windows:
```bash
cd web
deploy.bat
```

O manualmente:
```bash
cd web
npm run build
```

Luego arrastra la carpeta `build` a Netlify.

**¡Tu app IPTV estará en línea en menos de 5 minutos!** 🎬📺

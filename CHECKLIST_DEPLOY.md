# ✅ Checklist de Deploy Manual

## 🎯 Pasos a seguir:

### ☐ 1. Detener builds de GitHub
```
https://app.netlify.com/
→ Tu sitio
→ Site configuration
→ Build & deploy
→ Stop builds
```

### ☐ 2. Ir a Deploys
```
→ Deploys (menú izquierdo)
→ Scroll hacia abajo
→ Buscar zona "Drag and drop"
```

### ☐ 3. Arrastrar carpeta build
```
Abrir: C:\Users\Alfredo\Desktop\iptv-apk\web\build
Arrastrar: La carpeta "build" completa
Esperar: 10-30 segundos
```

### ☐ 4. Abrir sitio
```
Clic en: "Open production deploy"
O copiar URL: https://fredtv.netlify.app
```

### ☐ 5. Probar login
```
Usuario: Prueba1212
Contraseña: 1212
```

### ☐ 6. Si hay error de CORS
```
Site configuration
→ Redirects and rewrites
→ Add redirect rule
→ From: /api/*
→ To: http://zona593.live:8080/:splat
→ Status: 200 - Proxy
→ Force: ✓
→ Save
```

---

## 🎉 ¡Listo!

Si todos los pasos están marcados ✅, tu sitio debería estar funcionando.

---

## 📍 Ubicación de archivos

```
C:\Users\Alfredo\Desktop\iptv-apk\web\build
```

---

## 🆘 Ayuda

- **No encuentro "Drag and drop"**: Scroll hacia abajo en la página de Deploys
- **Error al arrastrar**: Asegúrate de arrastrar la carpeta completa, no los archivos
- **Sigue con CORS**: Configura los redirects manualmente (paso 6)

---

**Tiempo estimado: 2 minutos** ⏱️

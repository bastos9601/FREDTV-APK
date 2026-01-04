# ⚡ Solución Rápida - Netlify

## 🎯 Dos opciones simples:

---

## ✅ OPCIÓN 1: Configurar en Netlify (2 minutos)

### Paso 1: Ir a Build settings
```
https://app.netlify.com/ 
→ Tu sitio 
→ Site configuration 
→ Build & deploy 
→ Edit settings
```

### Paso 2: Cambiar estos 3 valores

| Campo | Valor actual | Cambiar a |
|-------|--------------|-----------|
| Base directory | (vacío) | `web` |
| Build command | npm run build | npm run build |
| Publish directory | build | `web/build` |

### Paso 3: Guardar y deploy
1. Clic en **"Save"**
2. Ve a **"Deploys"**
3. Clic en **"Trigger deploy"** → **"Deploy site"**
4. ¡Listo!

---

## ✅ OPCIÓN 2: Deploy manual (10 segundos)

### Paso 1: Detener builds de GitHub
```
Site configuration 
→ Build & deploy 
→ Stop builds
```

### Paso 2: Subir build manualmente
```
Deploys 
→ Drag and drop 
→ Arrastra la carpeta: C:\Users\Alfredo\Desktop\iptv-apk\web\build
```

### ¡Listo! Tu sitio estará en línea en 10 segundos.

---

## 🤔 ¿Cuál elegir?

| Opción | Ventaja | Desventaja |
|--------|---------|------------|
| **Opción 1** | Deploy automático en cada push | Requiere configuración |
| **Opción 2** | Súper rápido, sin configuración | Manual cada vez |

---

## 💡 Recomendación

**Para probar rápido:** Usa Opción 2 (deploy manual)

**Para producción:** Usa Opción 1 (automático)

---

## 📸 Configuración visual (Opción 1)

```
┌──────────────────────────────────────┐
│ Build settings                       │
├──────────────────────────────────────┤
│                                      │
│ Base directory                       │
│ ┌──────────────────────────────────┐ │
│ │ web                              │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Build command                        │
│ ┌──────────────────────────────────┐ │
│ │ npm run build                    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Publish directory                    │
│ ┌──────────────────────────────────┐ │
│ │ web/build                        │ │
│ └──────────────────────────────────┘ │
│                                      │
│         [Save]                       │
└──────────────────────────────────────┘
```

---

## ✅ Resultado esperado

Después de cualquiera de las dos opciones:
- ✅ Sitio en línea
- ✅ Login funciona
- ✅ Sin errores de CORS

---

**Elige una opción y hazlo ahora!** ⚡

Opción 1: Configurar → https://app.netlify.com/
Opción 2: Arrastrar → `web/build`

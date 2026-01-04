# 🛑 DETENER BUILDS DE GITHUB

## ⚠️ IMPORTANTE: Primero debes detener los builds automáticos

Netlify sigue intentando hacer build desde GitHub. Necesitas desconectarlo.

---

## 🎯 OPCIÓN A: Detener builds (Recomendado)

### Paso 1: Ir a Build settings
1. Ve a: **https://app.netlify.com/**
2. Entra a tu sitio
3. Menú izquierdo → **"Site configuration"**
4. Clic en **"Build & deploy"**

### Paso 2: Detener builds
1. Scroll hacia abajo hasta **"Build settings"**
2. Verás algo como:
   ```
   Repository: tu-usuario/iptv-apk
   Branch: main
   ```
3. Busca el botón **"Stop builds"** o **"Link to a different repository"**
4. Clic en **"Stop builds"**
5. Confirma la acción

### Paso 3: Verificar
Deberías ver un mensaje como:
```
✓ Builds stopped
```

---

## 🎯 OPCIÓN B: Desconectar GitHub completamente

### Paso 1: Ir a Build settings
1. **Site configuration** → **"Build & deploy"**
2. Scroll hasta **"Build settings"**

### Paso 2: Desconectar
1. Busca **"Link to a different repository"** o **"Unlink repository"**
2. Clic en el botón
3. Confirma que quieres desconectar

### Paso 3: Verificar
Deberías ver:
```
No repository linked
```

---

## 🎯 OPCIÓN C: Cambiar a "Manual deploys only"

Si no encuentras las opciones anteriores:

1. **Site configuration** → **"Build & deploy"**
2. Busca **"Deploy contexts"** o **"Continuous deployment"**
3. Cambia a **"Manual deploys only"**
4. Guarda los cambios

---

## ✅ Después de detener los builds

Una vez detenidos, ve a **"Deploys"** y:

1. Verás que no hay builds automáticos en progreso
2. Busca la zona **"Drag and drop"**
3. Arrastra la carpeta: `C:\Users\Alfredo\Desktop\iptv-apk\web\build`
4. ¡Listo!

---

## 📸 Cómo se ve cuando está detenido

```
┌─────────────────────────────────────┐
│ Build settings                      │
├─────────────────────────────────────┤
│ ⚠️ Builds are stopped               │
│                                     │
│ Repository: Not linked              │
│ or                                  │
│ Continuous deployment: Disabled     │
│                                     │
│ [Link repository] [Start builds]   │
└─────────────────────────────────────┘
```

---

## 🆘 Si no encuentras cómo detener

### Alternativa: Eliminar el sitio y crear uno nuevo

1. **Site configuration** → **"General"**
2. Scroll hasta el final
3. **"Delete site"**
4. Confirma
5. Crea un nuevo sitio:
   - **"Add new site"** → **"Deploy manually"**
   - Arrastra la carpeta `web/build`

---

## ⚠️ IMPORTANTE

**NO hagas más push a GitHub** hasta que detengas los builds, o seguirá intentando hacer build automático.

---

## 📋 Checklist

- [ ] Ir a Site configuration → Build & deploy
- [ ] Detener builds o desconectar GitHub
- [ ] Verificar que no hay builds en progreso
- [ ] Ir a Deploys
- [ ] Arrastrar carpeta `web/build`
- [ ] ¡Listo!

---

**Primero detén los builds, LUEGO arrastra la carpeta!** 🛑

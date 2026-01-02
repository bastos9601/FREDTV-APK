# 🔄 Actualizar GitHub y Netlify

## ❌ Problema detectado:
Netlify está conectado con GitHub pero no encuentra el `package.json` porque está en la carpeta `web/`, no en la raíz.

## ✅ Solución aplicada:
He agregado `base = "web"` en `netlify.toml` y lo moví a la raíz del proyecto.

---

## 📤 PASOS PARA ACTUALIZAR

### 1. Hacer commit de los cambios

```bash
git add .
git commit -m "Fix: Configurar base directory para Netlify"
git push origin main
```

O si usas otra rama:
```bash
git push origin tu-rama
```

### 2. Netlify detectará el cambio automáticamente
- Netlify verá el push
- Iniciará un nuevo build automáticamente
- Usará la carpeta `web` como base
- El build debería completarse exitosamente

---

## 🔍 Verificar el deploy

1. Ve a https://app.netlify.com/
2. Entra a tu sitio
3. Ve a **"Deploys"**
4. Verás un nuevo deploy en progreso
5. Espera a que termine (2-3 minutos)

### ✅ Si el build es exitoso verás:
```
✓ Build script success
✓ Deploy success
```

### ❌ Si falla de nuevo:
Revisa los logs y avísame qué error muestra.

---

## 🎯 Alternativa: Deploy manual (Si no quieres usar GitHub)

Si prefieres no usar GitHub y hacer deploy manual:

### Opción A: Desconectar de GitHub

1. En Netlify → **"Site configuration"** → **"Build & deploy"**
2. Scroll hasta **"Build settings"**
3. Clic en **"Link to a different repository"** o **"Stop builds"**
4. Luego usa drag & drop manual de la carpeta `build`

### Opción B: Seguir usando drag & drop

1. Ignora el error de GitHub
2. Simplemente arrastra la carpeta `web/build` manualmente
3. Netlify usará el build manual en lugar del automático

---

## 📋 Archivos modificados

```
iptv-apk/
├── netlify.toml          ← NUEVO: Movido a la raíz
├── web/
│   ├── netlify.toml      ← Actualizado con base = "web"
│   ├── .env.production   ← NUEVO
│   ├── src/
│   │   └── utils/
│   │       └── constantes.ts  ← Actualizado
│   └── build/            ← Build listo
```

---

## 🚀 Comandos Git

```bash
# Ver estado
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Fix: Configurar Netlify para carpeta web"

# Push a GitHub
git push origin main

# Ver logs
git log --oneline -5
```

---

## 📞 Después del push

1. Netlify detectará el cambio en 10-30 segundos
2. Iniciará el build automáticamente
3. El build tomará 2-3 minutos
4. Si es exitoso, tu sitio se actualizará automáticamente
5. Prueba el login

---

## ⚠️ Nota importante

El archivo `netlify.toml` ahora está en DOS lugares:
- **Raíz del proyecto** (`netlify.toml`) - Para que Netlify lo detecte
- **Carpeta web** (`web/netlify.toml`) - Para builds manuales

Ambos deben tener el mismo contenido.

---

¡Haz el commit y push, y Netlify hará el resto! 🚀

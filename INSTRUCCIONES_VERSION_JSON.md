# 📝 Cómo Subir version.json a GitHub

## Opción 1: Desde la Web de GitHub (Más Fácil)

1. **Ve a tu repositorio:**
   ```
   https://github.com/bastos9601/FREDTV-APK
   ```

2. **Haz clic en "Add file" → "Create new file"**

3. **Nombre del archivo:**
   ```
   version.json
   ```

4. **Contenido del archivo:**
   ```json
   {
     "version": "2.0.4",
     "downloadUrl": "https://github.com/bastos9601/FREDTV-APK/releases/download/v2.0.4/app.apk",
     "releaseNotes": "Versión actual de FRED TV",
     "releaseDate": "2026-01-05"
   }
   ```

5. **Haz clic en "Commit new file"**

6. **Verifica que funciona:**
   Abre en tu navegador:
   ```
   https://raw.githubusercontent.com/bastos9601/FREDTV-APK/main/version.json
   ```
   Deberías ver el contenido del archivo JSON.

## Opción 2: Desde Git (Línea de Comandos)

```bash
# 1. Navega a tu repositorio local
cd /ruta/a/FREDTV-APK

# 2. Crea el archivo version.json
cat > version.json << 'EOF'
{
  "version": "2.0.4",
  "downloadUrl": "https://github.com/bastos9601/FREDTV-APK/releases/download/v2.0.4/app.apk",
  "releaseNotes": "Versión actual de FRED TV",
  "releaseDate": "2026-01-05"
}
EOF

# 3. Agrega el archivo
git add version.json

# 4. Commit
git commit -m "Agregar archivo de versión para actualizaciones automáticas"

# 5. Push
git push origin main
```

## 🧪 Probar el Sistema

### Mientras NO exista version.json:
- ✅ La app funciona normal
- ✅ No muestra el modal de actualización
- ✅ Logs: "No se encontró version.json en GitHub"

### Cuando SUBAS version.json con versión 2.0.4:
- ✅ La app verifica la versión
- ✅ No muestra modal (misma versión)
- ✅ Logs: "No hay actualizaciones disponibles. Versión actual: 2.0.4"

### Para PROBAR que funciona:
1. Cambia el version.json a versión 2.0.5:
   ```json
   {
     "version": "2.0.5",
     "downloadUrl": "https://github.com/bastos9601/FREDTV-APK/releases/download/v2.0.5/app.apk"
   }
   ```
2. Abre la app
3. ✅ Debería mostrar el modal después de 3 segundos

### Para FORZAR el modal (pruebas):
En `NuevaInicioPantalla.tsx`, descomenta esta línea:
```typescript
// setMostrarModalDescarga(true);
```

## 📋 Checklist

- [ ] Archivo `version.json` creado en la raíz del repo
- [ ] Archivo subido a GitHub (main branch)
- [ ] URL accesible: `https://raw.githubusercontent.com/bastos9601/FREDTV-APK/main/version.json`
- [ ] Versión en el archivo coincide con la versión actual (2.0.4)
- [ ] App probada y no muestra modal (porque versiones son iguales)
- [ ] Cambiar versión a 2.0.5 para probar que funciona

## ❓ Solución de Problemas

### Error: "No se pudo obtener información de versión"
- ✅ **Normal**: El archivo aún no existe en GitHub
- ✅ **Solución**: Sube el archivo siguiendo las instrucciones arriba

### Modal no aparece
- ✅ **Verifica**: La versión en version.json debe ser MAYOR que 2.0.4
- ✅ **Ejemplo**: Cambia a 2.0.5 o 2.1.0

### URL no funciona
- ✅ **Verifica**: El archivo debe estar en la rama `main` (no `master`)
- ✅ **URL correcta**: `https://raw.githubusercontent.com/bastos9601/FREDTV-APK/main/version.json`

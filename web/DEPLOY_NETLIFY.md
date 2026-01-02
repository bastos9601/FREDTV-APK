# Guía de Despliegue en Netlify

## Opción 1: Deploy desde la interfaz web de Netlify (Recomendado)

### Paso 1: Preparar el proyecto
```bash
cd web
npm install
npm run build
```

### Paso 2: Subir a Netlify
1. Ve a [https://app.netlify.com/](https://app.netlify.com/)
2. Inicia sesión o crea una cuenta
3. Haz clic en "Add new site" → "Deploy manually"
4. Arrastra la carpeta `build` a la zona de drop
5. ¡Listo! Tu sitio estará en línea en segundos

### Paso 3: Configurar dominio personalizado (Opcional)
1. En el dashboard de tu sitio, ve a "Domain settings"
2. Haz clic en "Add custom domain"
3. Sigue las instrucciones para configurar tu dominio

---

## Opción 2: Deploy con Netlify CLI

### Paso 1: Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Paso 2: Login en Netlify
```bash
netlify login
```

### Paso 3: Inicializar el sitio
```bash
cd web
netlify init
```

Selecciona:
- "Create & configure a new site"
- Elige tu equipo
- Nombre del sitio (o deja que Netlify genere uno)
- Build command: `npm run build`
- Publish directory: `build`

### Paso 4: Deploy
```bash
# Deploy de prueba
netlify deploy

# Deploy a producción
netlify deploy --prod
```

---

## Opción 3: Deploy automático desde GitHub

### Paso 1: Subir código a GitHub
```bash
git add .
git commit -m "Preparar para deploy en Netlify"
git push origin main
```

### Paso 2: Conectar con Netlify
1. Ve a [https://app.netlify.com/](https://app.netlify.com/)
2. Haz clic en "Add new site" → "Import an existing project"
3. Selecciona "GitHub"
4. Autoriza Netlify y selecciona tu repositorio
5. Configura:
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `build`
6. Haz clic en "Deploy site"

### Deploy automático
Cada vez que hagas push a la rama main, Netlify desplegará automáticamente.

---

## Archivos de configuración incluidos

### `netlify.toml`
Configuración de build y redirects para React Router.

### `public/_redirects`
Asegura que todas las rutas de React Router funcionen correctamente.

---

## Variables de entorno (Si las necesitas)

Si tu app necesita variables de entorno:

1. En Netlify dashboard → "Site settings" → "Environment variables"
2. Agrega tus variables (deben empezar con `REACT_APP_`)
3. Ejemplo:
   - `REACT_APP_API_URL=https://tu-api.com`

---

## Solución de problemas

### Error: "Page not found" en rutas
- Verifica que existe el archivo `public/_redirects`
- Verifica que existe el archivo `netlify.toml`

### Error de build
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Netlify

### Problemas de CORS
- Si tu API está en otro dominio, necesitas configurar CORS en el servidor
- O usar el proxy de Netlify (ver documentación de Netlify)

---

## Comandos útiles

```bash
# Ver el sitio localmente antes de deploy
cd web
npm start

# Build de producción
npm run build

# Deploy rápido (CLI)
netlify deploy --prod

# Ver logs del último deploy
netlify logs

# Abrir el sitio en el navegador
netlify open
```

---

## URLs importantes

- Dashboard de Netlify: https://app.netlify.com/
- Documentación: https://docs.netlify.com/
- Status: https://www.netlifystatus.com/

---

## Notas importantes

⚠️ **CORS y Proxy**: El proxy configurado en `package.json` solo funciona en desarrollo. En producción, necesitarás:
1. Configurar CORS en tu servidor backend
2. O usar Netlify Functions como proxy
3. O usar el proxy de Netlify en `netlify.toml`

⚠️ **Variables de entorno**: No subas credenciales al repositorio. Usa las variables de entorno de Netlify.

✅ **Optimización**: Netlify automáticamente optimiza tu sitio (compresión, CDN, etc.)

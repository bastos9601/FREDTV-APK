╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   📦 CARPETA PARA DEPLOY MANUAL EN NETLIFY                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

🎯 ESTA CARPETA ESTÁ LISTA PARA ARRASTRAR A NETLIFY

📁 Contenido:
   • index.html - Página de inicio
   • admin.html - Panel de administración
   • config.json - Configuración del servidor

🚀 CÓMO HACER EL DEPLOY MANUAL:

1. Abre Netlify en tu navegador:
   https://app.netlify.com

2. Ve a tu proyecto "FREDSPRO" (o el que uses)

3. Click en "Deploys" en el menú superior

4. Arrastra TODA ESTA CARPETA (config-remota-netlify-deploy)
   a la zona que dice "Need to update your site? Drag and drop..."

5. Espera a que termine el deploy (1-2 minutos)

6. ¡Listo! Verifica que funcione:
   - https://tu-sitio.netlify.app/
   - https://tu-sitio.netlify.app/admin.html
   - https://tu-sitio.netlify.app/config.json

✅ VERIFICAR QUE FUNCIONA:

1. Abre en navegador:
   https://tu-sitio.netlify.app/config.json
   
   Deberías ver el JSON con la configuración

2. Abre el panel admin:
   https://tu-sitio.netlify.app/admin.html
   
   Deberías ver el panel visual

3. Abre la página de inicio:
   https://tu-sitio.netlify.app/
   
   Deberías ver la página de bienvenida

📝 DESPUÉS DEL DEPLOY:

1. Copia la URL de tu sitio (ejemplo: https://FREDSPRO.netlify.app)

2. Ve a tu app y edita:
   iptv-app/src/servicios/configRemotaServicio.ts
   
   Línea 15:
   private CONFIG_URL = 'https://TU-SITIO.netlify.app/config.json';

3. Recompila la APK una última vez:
   cd iptv-app
   eas build --platform android

4. ¡Listo! Ahora puedes cambiar el servidor desde Netlify

🔄 PARA CAMBIAR EL SERVIDOR EN EL FUTURO:

1. Abre: https://tu-sitio.netlify.app/admin.html
2. Edita el servidor
3. Descarga el config.json
4. Arrastra el nuevo config.json a Netlify
5. ¡Todas las apps se actualizan automáticamente!

╔══════════════════════════════════════════════════════════════════╗
║  ¡Listo para arrastrar a Netlify!                                ║
╚══════════════════════════════════════════════════════════════════╝

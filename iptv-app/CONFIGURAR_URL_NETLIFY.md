# Configurar URL de Netlify

## ⚠️ PASO IMPORTANTE

Después de desplegar tu configuración en Netlify, debes actualizar la URL en la app.

### 1. Edita el archivo de configuración remota

Abre: `iptv-app/src/servicios/configRemotaServicio.ts`

### 2. Cambia la URL

Busca esta línea:
```typescript
private CONFIG_URL = 'https://tu-sitio.netlify.app/config.json';
```

Cámbiala por tu URL real de Netlify:
```typescript
private CONFIG_URL = 'https://fred-tv.netlify.app/config.json';
```

### 3. Recompila la app

Después de cambiar la URL, recompila la APK:
```bash
cd iptv-app
npm run build:apk
```

## Cómo funciona

1. **Al iniciar la app**: Carga la configuración desde Netlify
2. **Cache**: Guarda la configuración localmente por 1 hora
3. **Fallback**: Si Netlify no responde, usa la última configuración guardada
4. **Actualización automática**: Cada hora verifica si hay cambios

## Ventajas

✅ Cambiar servidor sin recompilar la app
✅ Servidores de backup automáticos
✅ Modo mantenimiento remoto
✅ Mensajes personalizados
✅ Funciona offline con cache

## Verificar que funciona

Revisa los logs de la consola al iniciar la app:
- "Obteniendo configuración remota desde Netlify..."
- "Configuración remota cargada: {...}"
- "Servidor IPTV actualizado a: http://..."

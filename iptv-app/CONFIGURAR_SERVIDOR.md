# 🔧 Configurar Servidor IPTV

## ⚠️ Problema Detectado: Error de SSL

El servidor `https://zona593.live:8080` tiene un problema con el certificado SSL:
```
ERR_SSL_PROTOCOL_ERROR
```

## ✅ Solución Aplicada

He cambiado la configuración para usar **HTTP** en lugar de **HTTPS**:

```typescript
// Antes
HOST: 'https://zona593.live:8080'

// Ahora
HOST: 'http://zona593.live:8080'
```

## 🧪 Probar la Nueva Configuración

### Opción 1: HTTP (Recomendado para este servidor)

Abre en tu navegador:
```
http://zona593.live:8080/player_api.php?username=Prueba1212&password=YvAn9eg4ba
```

### Opción 2: HTTPS (Si el servidor lo soporta)

Abre en tu navegador:
```
https://zona593.live:8080/player_api.php?username=Prueba1212&password=YvAn9eg4ba
```

## 🔄 Cambiar Configuración Manualmente

Si necesitas cambiar entre HTTP y HTTPS, edita el archivo:

**Archivo**: `src/utils/constantes.ts`

```typescript
export const IPTV_CONFIG = {
  HOST: 'http://zona593.live:8080',  // Cambia aquí
  // ...
};
```

### Opciones:

1. **HTTP** (Sin SSL):
   ```typescript
   HOST: 'http://zona593.live:8080'
   ```

2. **HTTPS** (Con SSL):
   ```typescript
   HOST: 'https://zona593.live:8080'
   ```

3. **Otro servidor**:
   ```typescript
   HOST: 'http://tu-servidor.com:puerto'
   ```

## 🔒 Seguridad

### HTTP vs HTTPS

**HTTP** (Sin cifrado):
- ✅ Funciona con servidores sin certificado SSL
- ❌ Los datos viajan sin cifrar
- ⚠️ Menos seguro para credenciales

**HTTPS** (Con cifrado):
- ✅ Datos cifrados
- ✅ Más seguro
- ❌ Requiere certificado SSL válido

### Recomendación

Para uso personal en red local o con servidores IPTV que no tienen SSL configurado, HTTP es aceptable. Las credenciales IPTV generalmente no son críticas como contraseñas bancarias.

## 📱 Configuración en Android

Android puede bloquear conexiones HTTP por defecto (cleartext traffic). Si tienes problemas:

### Solución: Permitir HTTP en Android

Edita `app.json`:

```json
{
  "expo": {
    "android": {
      "usesCleartextTraffic": true
    }
  }
}
```

Ya está configurado en tu app.

## 🌐 Servidores Alternativos

Si tu proveedor tiene múltiples servidores, prueba con diferentes URLs:

```typescript
// Ejemplos comunes
HOST: 'http://zona593.live:8080'
HOST: 'http://zona593.live:80'
HOST: 'http://zona593.live'
HOST: 'http://ip-del-servidor:8080'
```

## 🔍 Verificar Conectividad

### Paso 1: Ping al Servidor

```bash
ping zona593.live
```

### Paso 2: Probar Puerto

```bash
# Windows PowerShell
Test-NetConnection -ComputerName zona593.live -Port 8080
```

### Paso 3: Probar en Navegador

```
http://zona593.live:8080/player_api.php?username=test&password=test
```

## 📝 Configuraciones Comunes

### Servidor con Puerto Estándar HTTP (80)

```typescript
HOST: 'http://zona593.live'
```

### Servidor con Puerto Personalizado

```typescript
HOST: 'http://zona593.live:8080'
```

### Servidor con HTTPS y Puerto Estándar (443)

```typescript
HOST: 'https://zona593.live'
```

### Servidor con IP Directa

```typescript
HOST: 'http://192.168.1.100:8080'
```

## 🚀 Aplicar Cambios

Después de cambiar la configuración:

1. Guarda el archivo `src/utils/constantes.ts`
2. Recarga la app (presiona `r` en la terminal de Expo)
3. O reinicia: `npm start -- --clear`

## ✅ Verificar que Funciona

1. Abre la app
2. Ingresa credenciales
3. Si funciona, verás la pantalla de inicio
4. Si no funciona, verifica los logs

## 📊 Tabla de Diagnóstico

| Síntoma | Causa | Solución |
|---------|-------|----------|
| ERR_SSL_PROTOCOL_ERROR | Certificado SSL inválido | Usar HTTP |
| ERR_CONNECTION_REFUSED | Puerto cerrado | Verificar puerto |
| ERR_NAME_NOT_RESOLVED | DNS no resuelve | Verificar dominio |
| Timeout | Servidor caído | Contactar proveedor |
| 401/403 | Credenciales inválidas | Verificar usuario/pass |

## 🔧 Configuración Avanzada

### Múltiples Servidores

Si tienes varios servidores, puedes crear un selector:

```typescript
export const SERVIDORES = {
  PRINCIPAL: 'http://zona593.live:8080',
  BACKUP: 'http://backup.zona593.live:8080',
  LOCAL: 'http://192.168.1.100:8080',
};

export const IPTV_CONFIG = {
  HOST: SERVIDORES.PRINCIPAL, // Cambia aquí
  // ...
};
```

### Timeout Personalizado

En `src/servicios/iptvServicio.ts`:

```typescript
const response = await axios.get(`${this.baseURL}/player_api.php`, {
  params: { username, password },
  timeout: 15000, // 15 segundos
});
```

## 📞 Contactar al Proveedor

Si nada funciona, pregunta a tu proveedor:

1. ¿Cuál es la URL correcta del servidor?
2. ¿Usa HTTP o HTTPS?
3. ¿Cuál es el puerto correcto?
4. ¿Hay algún firewall o restricción?
5. ¿Las credenciales están activas?

## ✅ Checklist

- [ ] Cambié a HTTP en constantes.ts
- [ ] Probé la URL en el navegador
- [ ] Verifiqué que el servidor responde
- [ ] Reinicié la app con --clear
- [ ] Probé las credenciales en la app

---

**Configuración actual**: HTTP (sin SSL)
**Servidor**: zona593.live:8080
**Estado**: Listo para probar

Reinicia la app y prueba nuevamente con las credenciales.

# 🔐 Probar Credenciales IPTV

## ✅ La App Funciona Correctamente

El error "String cannot be cast to Boolean" está solucionado. Ahora el problema es que las credenciales no son válidas.

## 🧪 Probar Credenciales Manualmente

### Opción 1: Navegador Web

Abre esta URL en tu navegador (reemplaza con tus credenciales):

```
https://zona593.live:8080/player_api.php?username=Prueba1212&password=YvAn9eg4ba
```

**Respuesta esperada si las credenciales son válidas:**
```json
{
  "user_info": {
    "username": "Prueba1212",
    "password": "YvAn9eg4ba",
    "auth": 1,
    "status": "Active",
    "exp_date": "1735689600",
    ...
  },
  "server_info": {
    ...
  }
}
```

**Si las credenciales son inválidas:**
```json
{
  "user_info": {
    "auth": 0,
    "status": "Disabled",
    ...
  }
}
```

### Opción 2: Comando curl (Windows PowerShell)

```powershell
curl "https://zona593.live:8080/player_api.php?username=Prueba1212&password=YvAn9eg4ba"
```

### Opción 3: Postman o Insomnia

1. Abre Postman
2. Crea una petición GET
3. URL: `https://zona593.live:8080/player_api.php`
4. Params:
   - username: `Prueba1212`
   - password: `YvAn9eg4ba`
5. Send

## 🔍 Posibles Problemas

### 1. Credenciales Incorrectas
- Usuario o contraseña mal escritos
- Cuenta expirada
- Cuenta deshabilitada
- Cuenta no existe

### 2. Servidor No Disponible
- El servidor está caído
- Problemas de red
- Firewall bloqueando la conexión

### 3. URL Incorrecta
- El servidor cambió de dirección
- Puerto incorrecto

## 📝 Credenciales de Prueba

Has proporcionado:
- **Usuario**: `Prueba1212`
- **Contraseña**: `YvAn9eg4ba`
- **Servidor**: `https://zona593.live:8080`

## ✅ Verificar Estado de la Cuenta

### Paso 1: Probar en Navegador
```
https://zona593.live:8080/player_api.php?username=Prueba1212&password=YvAn9eg4ba
```

### Paso 2: Verificar Respuesta

Si ves `"auth": 1` → Credenciales válidas ✅
Si ves `"auth": 0` → Credenciales inválidas ❌

### Paso 3: Verificar Estado
- `"status": "Active"` → Cuenta activa ✅
- `"status": "Disabled"` → Cuenta deshabilitada ❌
- `"status": "Expired"` → Cuenta expirada ❌
- `"status": "Banned"` → Cuenta bloqueada ❌

## 🔧 Soluciones

### Si las credenciales son inválidas:
1. Contacta a tu proveedor Zona593
2. Verifica que la cuenta esté activa
3. Verifica que no haya expirado
4. Solicita nuevas credenciales

### Si el servidor no responde:
1. Verifica tu conexión a internet
2. Prueba desde otro dispositivo
3. Contacta al proveedor para verificar estado del servidor

### Si las credenciales son válidas pero la app no funciona:
1. Verifica que estés escribiendo correctamente en la app
2. No incluyas espacios extra
3. Verifica mayúsculas/minúsculas

## 🎯 Probar con Credenciales de Demostración

Algunos servidores IPTV tienen credenciales de demo públicas. Pregunta a tu proveedor si tienen alguna para probar.

Ejemplo típico (NO funcionará en tu servidor):
```
Usuario: demo
Contraseña: demo
```

## 📱 En la App

Una vez que tengas credenciales válidas:

1. Abre la app
2. Ingresa el usuario exactamente como te lo dieron
3. Ingresa la contraseña exactamente como te la dieron
4. Presiona "Iniciar Sesión"

**Importante**: 
- No agregues espacios antes o después
- Respeta mayúsculas y minúsculas
- Copia y pega si es posible

## 🔍 Ver Logs de la App

Para ver qué está pasando exactamente:

```bash
# Terminal 1: Iniciar app
npm start

# Terminal 2: Ver logs
npx react-native log-android
```

Los logs mostrarán la respuesta exacta del servidor.

## 📞 Contactar al Proveedor

Si nada funciona, contacta a Zona593 y proporciona:

1. Tu usuario
2. El error que recibes
3. Captura de pantalla de la respuesta del navegador

## ✅ Checklist

- [ ] Probé las credenciales en el navegador
- [ ] Vi la respuesta del servidor
- [ ] Verifiqué que `auth: 1`
- [ ] Verifiqué que `status: "Active"`
- [ ] Verifiqué que la cuenta no esté expirada
- [ ] Escribí las credenciales correctamente en la app
- [ ] No hay espacios extra

---

## 🎉 Una Vez que Funcione

Cuando tengas credenciales válidas y la app funcione:

1. Verás la pantalla de inicio con tu información
2. Podrás navegar a TV, Películas y Series
3. Podrás reproducir contenido

La app está funcionando perfectamente, solo necesita credenciales válidas del servidor IPTV.

---

**Nota**: Las credenciales que proporcionaste (`Prueba1212` / `YvAn9eg4ba`) parecen ser de prueba. Verifica con tu proveedor que estén activas y sean válidas para el servidor `https://zona593.live:8080`.

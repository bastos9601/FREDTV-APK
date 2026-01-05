# Instalación de Paquetes Necesarios

## Paquetes Requeridos
Para que funcionen las nuevas funcionalidades del reproductor, necesitas instalar:
1. `expo-brightness` - Control de brillo
2. `@react-native-community/slider` - Slider para el control de brillo

## Comandos de Instalación

### Opción 1: Instalar ambos con npx expo (Recomendado)
```bash
cd iptv-app
npx expo install expo-brightness @react-native-community/slider
```

### Opción 2: Instalar con npm
```bash
cd iptv-app
npm install expo-brightness @react-native-community/slider
```

### Opción 3: Instalar uno por uno
```bash
cd iptv-app
npx expo install expo-brightness
npx expo install @react-native-community/slider
```

## Permisos

### Android
- `WRITE_SETTINGS`: Para cambiar el brillo del sistema (se solicita automáticamente)

### iOS
- No requiere permisos adicionales

## Verificación
Después de instalar, ejecuta:
```bash
npm start
```

O si usas Expo:
```bash
npx expo start
```

## Nota Importante
Si ya tienes la app corriendo, necesitarás **reiniciarla completamente** después de instalar los paquetes:
1. Detén el servidor (Ctrl+C)
2. Cierra la app en el dispositivo/emulador
3. Ejecuta `npm start` o `npx expo start` nuevamente
4. Abre la app de nuevo

## Troubleshooting

### Error: "Slider has been removed from react-native core"
- Asegúrate de haber instalado `@react-native-community/slider`
- Reinicia completamente la app

### Error: "expo-brightness not found"
- Asegúrate de haber instalado `expo-brightness`
- Ejecuta `npm install` o `npx expo install` nuevamente

### La app no inicia después de instalar
- Limpia el caché: `npx expo start -c`
- O con npm: `npm start -- --reset-cache`

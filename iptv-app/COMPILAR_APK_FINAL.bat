@echo off
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          🚀 COMPILANDO APK - FRED TV v2.7.6                   ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Paso 1: Verificando que EAS CLI esté instalado...
eas --version >nul 2>&1
if errorlevel 1 (
    echo Instalando EAS CLI...
    npm install -g eas-cli
)
echo ✅ EAS CLI listo
echo.

echo Paso 2: Verificando que estés logueado en Expo...
eas whoami >nul 2>&1
if errorlevel 1 (
    echo Necesitas iniciar sesión en Expo...
    eas login
)
echo ✅ Sesión verificada
echo.

echo Paso 3: Limpiando caché...
expo cache clean
echo ✅ Caché limpio
echo.

echo Paso 4: Compilando APK...
echo ⏱️  Esto puede tomar 10-15 minutos...
echo.
eas build --platform android --profile release

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║  ✅ COMPILACIÓN INICIADA                                       ║
echo ║                                                                ║
echo ║  Próximos pasos:                                               ║
echo ║  1. Ve a: https://expo.dev/builds                              ║
echo ║  2. Busca tu compilación (estado: Completed)                   ║
echo ║  3. Descarga el APK                                            ║
echo ║  4. Instala en tu dispositivo Android                          ║
echo ║  5. ¡Disfruta de FRED TV!                                      ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
pause

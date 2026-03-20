@echo off
echo Instalando dependencias necesarias...
echo.

echo Paso 1: Instalando Expo CLI globalmente...
npm install -g expo-cli

echo.
echo Paso 2: Instalando dependencias del proyecto...
npm install

echo.
echo Paso 3: Iniciando la app...
npm start

pause

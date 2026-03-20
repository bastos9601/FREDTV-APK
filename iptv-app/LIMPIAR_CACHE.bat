@echo off
echo Limpiando caché de Expo y Metro...
echo.

echo 1. Limpiando caché de Expo...
call expo cache clean

echo.
echo 2. Limpiando caché de Metro...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo   Caché de Metro eliminado
) else (
    echo   No hay caché de Metro
)

echo.
echo 3. Reinstalando dependencias...
call npm install

echo.
echo ✅ Caché limpio. Ahora puedes compilar.
echo.
pause

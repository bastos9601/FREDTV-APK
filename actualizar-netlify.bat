@echo off
echo ========================================
echo   Actualizar GitHub para Netlify
echo ========================================
echo.

echo [1/3] Agregando archivos al commit...
git add .

echo.
echo [2/3] Haciendo commit...
git commit -m "Fix: Configurar Netlify base directory y proxy CORS"

echo.
echo [3/3] Subiendo a GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo Intentando con 'master' en lugar de 'main'...
    git push origin master
)

echo.
echo ========================================
echo   LISTO!
echo ========================================
echo.
echo Netlify detectara el cambio automaticamente
echo y hara el build en 2-3 minutos.
echo.
echo Ve a: https://app.netlify.com/
echo Para ver el progreso del deploy.
echo.
pause

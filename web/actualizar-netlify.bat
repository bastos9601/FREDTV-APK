@echo off
echo ========================================
echo   Actualizar Deploy en Netlify
echo ========================================
echo.
echo Problema solucionado: CORS configurado
echo.

echo [1/2] Creando nuevo build con proxy...
call npm run build
if %errorlevel% neq 0 (
    echo Error al crear el build
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Build completado!
echo.
echo ========================================
echo   LISTO PARA ACTUALIZAR
echo ========================================
echo.
echo Ahora sube el nuevo build a Netlify:
echo.
echo 1. Ve a: https://app.netlify.com/
echo 2. Entra a tu sitio
echo 3. Clic en "Deploys"
echo 4. Arrastra la carpeta "build" aqui
echo.
echo La carpeta "build" esta actualizada con:
echo   - Proxy configurado (/api)
echo   - URLs corregidas
echo   - Sin errores de CORS
echo.
echo ========================================
pause

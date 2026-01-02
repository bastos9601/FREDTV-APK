@echo off
echo ========================================
echo   Deploy a Netlify - IPTV Web App
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Creando build de produccion...
call npm run build
if %errorlevel% neq 0 (
    echo Error al crear el build
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Build completado exitosamente!
echo.
echo ========================================
echo   SIGUIENTE PASO: Subir a Netlify
echo ========================================
echo.
echo Opcion 1 - Manual (Mas facil):
echo   1. Ve a https://app.netlify.com/
echo   2. Haz clic en "Add new site" - "Deploy manually"
echo   3. Arrastra la carpeta "build" a la zona de drop
echo.
echo Opcion 2 - Con CLI:
echo   1. Instala: npm install -g netlify-cli
echo   2. Login: netlify login
echo   3. Deploy: netlify deploy --prod
echo.
echo La carpeta "build" esta lista para subir!
echo ========================================
pause

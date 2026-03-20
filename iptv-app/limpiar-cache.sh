#!/bin/bash

echo "Limpiando caché de Expo y Metro..."
echo ""

echo "1. Limpiando caché de Expo..."
expo cache clean

echo ""
echo "2. Limpiando caché de Metro..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "   Caché de Metro eliminado"
else
    echo "   No hay caché de Metro"
fi

echo ""
echo "3. Reinstalando dependencias..."
npm install

echo ""
echo "✅ Caché limpio. Ahora puedes compilar."
echo ""

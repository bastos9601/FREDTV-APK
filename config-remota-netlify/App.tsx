import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexto/AuthContext';
import { NavegacionPrincipal } from './src/navegacion/NavegacionPrincipal';
import configRemotaServicio from './src/servicios/configRemotaServicio';
import iptvServicio from './src/servicios/iptvServicio';

export default function App() {
  useEffect(() => {
    // Cargar configuración remota al iniciar la app
    cargarConfiguracionRemota();
  }, []);

  const cargarConfiguracionRemota = async () => {
    try {
      console.log('Cargando configuración remota...');
      const config = await configRemotaServicio.obtenerConfiguracion();
      
      if (config) {
        // Actualizar el servidor IPTV
        iptvServicio.setBaseURL(config.servidor);
        console.log('✅ Servidor actualizado desde configuración remota:', config.servidor);
        
        // Verificar si la app está en mantenimiento
        if (config.mantenimiento) {
          console.log('⚠️ Modo mantenimiento activado:', config.mensaje_mantenimiento);
        }
      } else {
        console.log('⚠️ No se pudo obtener configuración remota, usando servidor por defecto');
      }
    } catch (error) {
      console.error('Error cargando configuración remota:', error);
    }
  };

  return (
    <AuthProvider>
      <NavegacionPrincipal />
      <StatusBar style="light" backgroundColor="#141414" />
    </AuthProvider>
  );
}

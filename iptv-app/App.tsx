// App con automatización de builds
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexto/AuthContext';
import { NavegacionPrincipal } from './src/navegacion/NavegacionPrincipal';
import configRemotaServicio from './src/servicios/configRemotaServicio';
import iptvServicio from './src/servicios/iptvServicio';

export default function App() {
  useEffect(() => {
    // Cargar configuración remota al iniciar la app
    const cargarConfiguracion = async () => {
      try {
        const config = await configRemotaServicio.obtenerConfiguracion();
        if (config) {
          // Actualizar el servidor IPTV con la configuración remota
          iptvServicio.setBaseURL(config.servidor);
          console.log('Configuración remota cargada:', config);
        }
      } catch (error) {
        console.error('Error cargando configuración remota:', error);
      }
    };

    cargarConfiguracion();
  }, []);

  return (
    <AuthProvider>
      <NavegacionPrincipal />
      <StatusBar style="light" backgroundColor="#141414" />
    </AuthProvider>
  );
}

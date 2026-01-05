// App v2 - Build automation
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexto/AuthContext';
import { NavegacionPrincipal } from './src/navegacion/NavegacionPrincipal';
import configRemotaServicio from './src/servicios/configRemotaServicio';
import iptvServicio from './src/servicios/iptvServicio';
import actualizacionServicio from './src/servicios/actualizacionServicio';

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

    // Verificar actualizaciones al iniciar
    const inicializar = async () => {
      await cargarConfiguracion();
      // Esperar 2 segundos antes de verificar actualizaciones
      setTimeout(() => {
        actualizacionServicio.verificarActualizacion();
      }, 2000);
    };

    inicializar();
  }, []);

  return (
    <AuthProvider>
      <NavegacionPrincipal />
      <StatusBar style="light" backgroundColor="#141414" />
    </AuthProvider>
  );
}

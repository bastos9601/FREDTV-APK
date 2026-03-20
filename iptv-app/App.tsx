// App v2.2.0 - Supabase integrado
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from './src/contexto/AuthContext';
import { PerfilProvider } from './src/contexto/PerfilContext';
import { SupabaseProvider } from './src/contexto/SupabaseContext';
import { NavegacionPrincipal } from './src/navegacion/NavegacionPrincipal';
import { ModalFlyerInicio } from './src/componentes/ModalFlyerInicio';
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
    <SupabaseProvider>
      <AuthProvider>
        <PerfilProvider>
          <ModalFlyerInicio numeroWhatsApp="+51936185088" />
          <NavegacionPrincipal />
          <StatusBar style="light" backgroundColor="#141414" />
        </PerfilProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}

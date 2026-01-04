import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface ConfigRemota {
  servidor: string;
  servidores_backup: string[];
  version_minima: string;
  mensaje_bienvenida: string;
  mantenimiento: boolean;
  mensaje_mantenimiento: string;
  ultima_actualizacion: string;
}

class ConfigRemotaServicio {
  // ⚠️ IMPORTANTE: Cambia esta URL por tu URL de Netlify
  // Ejemplo: 'https://fred-tv.netlify.app/config.json'
  private CONFIG_URL = 'https://tu-sitio.netlify.app/config.json';
  
  private CACHE_KEY = '@config_remota';
  private LAST_CHECK_KEY = '@config_last_check';
  private CHECK_INTERVAL = 3600000; // 1 hora en milisegundos

  /**
   * Obtiene la configuración remota desde Netlify
   * Si falla, usa la configuración en cache
   */
  async obtenerConfiguracion(): Promise<ConfigRemota | null> {
    try {
      // Verificar si necesitamos actualizar (cada 1 hora)
      const lastCheck = await AsyncStorage.getItem(this.LAST_CHECK_KEY);
      const now = Date.now();
      
      if (lastCheck && (now - parseInt(lastCheck)) < this.CHECK_INTERVAL) {
        // Usar cache si la última verificación fue hace menos de 1 hora
        console.log('Usando configuración en cache');
        return await this.obtenerConfigCache();
      }

      // Obtener configuración remota
      console.log('Obteniendo configuración remota desde Netlify...');
      const response = await axios.get<ConfigRemota>(this.CONFIG_URL, {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.data) {
        // Guardar en cache
        await this.guardarConfigCache(response.data);
        await AsyncStorage.setItem(this.LAST_CHECK_KEY, now.toString());
        console.log('Configuración remota obtenida:', response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo configuración remota:', error);
      // Si falla, usar cache
      return await this.obtenerConfigCache();
    }
  }

  /**
   * Guarda la configuración en cache local
   */
  private async guardarConfigCache(config: ConfigRemota): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error guardando config en cache:', error);
    }
  }

  /**
   * Obtiene la configuración desde el cache local
   */
  private async obtenerConfigCache(): Promise<ConfigRemota | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo config del cache:', error);
      return null;
    }
  }

  /**
   * Fuerza la actualización de la configuración
   */
  async forzarActualizacion(): Promise<ConfigRemota | null> {
    await AsyncStorage.removeItem(this.LAST_CHECK_KEY);
    return await this.obtenerConfiguracion();
  }

  /**
   * Configura la URL del archivo config.json
   */
  setConfigURL(url: string): void {
    this.CONFIG_URL = url;
  }

  /**
   * Obtiene la URL actual del config
   */
  getConfigURL(): string {
    return this.CONFIG_URL;
  }
}

export default new ConfigRemotaServicio();

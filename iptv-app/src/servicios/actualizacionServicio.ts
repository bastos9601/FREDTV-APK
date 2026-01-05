import Constants from 'expo-constants';

interface VersionInfo {
  versionActual: string;
  versionDisponible: string;
  hayActualizacion: boolean;
  urlDescarga: string;
}

/**
 * Servicio para verificar actualizaciones de la app
 */
class ActualizacionServicio {
  // URL del archivo de versión en GitHub (puedes crear un archivo version.json en tu repo)
  private readonly VERSION_URL = 'https://raw.githubusercontent.com/bastos9601/FREDTV-APK/main/version.json';
  
  // URL de descarga del APK
  private readonly APK_URL = 'https://github.com/bastos9601/FREDTV-APK/releases/download/v{VERSION}/app.apk';

  /**
   * Obtiene la versión actual de la app desde app.json
   */
  private obtenerVersionActual(): string {
    try {
      // Intenta obtener la versión desde expo-constants
      return Constants.expoConfig?.version || '2.0.4';
    } catch (error) {
      console.error('Error obteniendo versión actual:', error);
      return '2.0.4';
    }
  }

  /**
   * Compara dos versiones en formato semántico (x.y.z)
   * Retorna: 1 si v1 > v2, -1 si v1 < v2, 0 si son iguales
   */
  private compararVersiones(v1: string, v2: string): number {
    const partes1 = v1.split('.').map(Number);
    const partes2 = v2.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      const num1 = partes1[i] || 0;
      const num2 = partes2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  /**
   * Verifica si hay una actualización disponible
   */
  async verificarActualizacion(): Promise<VersionInfo> {
    const versionActual = this.obtenerVersionActual();
    
    try {
      // Intenta obtener la versión desde GitHub
      const response = await fetch(this.VERSION_URL, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        console.log('No se encontró version.json en GitHub, usando valores por defecto');
        // Si no existe el archivo, asumir que no hay actualización
        return {
          versionActual,
          versionDisponible: versionActual,
          hayActualizacion: false,
          urlDescarga: this.APK_URL.replace('{VERSION}', versionActual),
        };
      }

      const data = await response.json();
      const versionDisponible = data.version || '2.0.4';
      const urlDescarga = data.downloadUrl || this.APK_URL.replace('{VERSION}', versionDisponible);

      // Comparar versiones
      const comparacion = this.compararVersiones(versionDisponible, versionActual);
      const hayActualizacion = comparacion > 0;

      console.log('Verificación de actualización:', {
        versionActual,
        versionDisponible,
        hayActualizacion,
      });

      return {
        versionActual,
        versionDisponible,
        hayActualizacion,
        urlDescarga,
      };
    } catch (error) {
      console.log('Error al verificar actualización (normal si version.json no existe):', error.message);
      
      // En caso de error, retornar que no hay actualización
      return {
        versionActual,
        versionDisponible: versionActual,
        hayActualizacion: false,
        urlDescarga: this.APK_URL.replace('{VERSION}', versionActual),
      };
    }
  }

  /**
   * Obtiene la URL de descarga del APK más reciente
   */
  async obtenerUrlDescarga(): Promise<string> {
    const info = await this.verificarActualizacion();
    return info.urlDescarga;
  }
}

export default new ActualizacionServicio();

import { Alert, Linking, Platform } from 'react-native';
import { Paths, File } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';

const URL_CONFIG = 'https://panelfredtv.netlify.app/config.json';

interface ConfigActualizacion {
  versionActual: string;
  urlDescargaApk: string;
  fechaActualizacion: string;
}

class ActualizacionServicio {
  /**
   * Compara dos versiones en formato "X.Y.Z"
   * Retorna: -1 si v1 < v2, 0 si son iguales, 1 si v1 > v2
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
  async verificarActualizacion(): Promise<void> {
    // Solo funciona en Android
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Obtener versión instalada
      const versionInstalada = Constants.expoConfig?.version || '1.0.0';

      // Consultar servidor
      const response = await fetch(URL_CONFIG);
      if (!response.ok) {
        console.log('No se pudo verificar actualizaciones');
        return;
      }

      const config: ConfigActualizacion = await response.json();

      // Comparar versiones
      const comparacion = this.compararVersiones(versionInstalada, config.versionActual);

      if (comparacion < 0) {
        // Hay una versión más nueva disponible
        this.mostrarDialogoActualizacion(config, versionInstalada);
      } else {
        console.log('App actualizada a la última versión');
      }
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
    }
  }

  /**
   * Muestra el diálogo de actualización al usuario
   */
  private mostrarDialogoActualizacion(config: ConfigActualizacion, versionActual: string): void {
    Alert.alert(
      '🔄 Actualización Disponible',
      `Nueva versión ${config.versionActual} disponible\n` +
        `Versión actual: ${versionActual}\n\n` +
        `¿Deseas descargar e instalar la actualización?`,
      [
        {
          text: 'Después',
          style: 'cancel',
        },
        {
          text: 'Actualizar Ahora',
          onPress: () => this.descargarEInstalarAPK(config.urlDescargaApk),
        },
      ]
    );
  }

  /**
   * Descarga e instala el APK
   */
  private async descargarEInstalarAPK(url: string): Promise<void> {
    try {
      Alert.alert('Descargando...', 'Por favor espera mientras se descarga la actualización');

      // Crear archivo en el directorio de cache
      const apkFile = new File(Paths.cache, 'update.apk');

      // Descargar APK
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error descargando APK');
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      await apkFile.create();
      await apkFile.write(uint8Array);

      console.log('APK descargado exitosamente');

      // Instalar APK
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: apkFile.uri,
        flags: 1,
        type: 'application/vnd.android.package-archive',
      });
    } catch (error) {
      console.error('Error descargando actualización:', error);
      Alert.alert('Error', 'No se pudo descargar la actualización. Intenta más tarde.');
    }
  }

  /**
   * Verifica actualizaciones manualmente (para botón)
   */
  async verificarActualizacionManual(): Promise<void> {
    const versionInstalada = Constants.expoConfig?.version || '1.0.0';

    try {
      const response = await fetch(URL_CONFIG);
      if (!response.ok) {
        Alert.alert('Error', 'No se pudo conectar al servidor de actualizaciones');
        return;
      }

      const config: ConfigActualizacion = await response.json();
      const comparacion = this.compararVersiones(versionInstalada, config.versionActual);

      if (comparacion < 0) {
        this.mostrarDialogoActualizacion(config, versionInstalada);
      } else {
        Alert.alert('✅ App Actualizada', 'Ya tienes la última versión instalada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar actualizaciones');
    }
  }
}

export default new ActualizacionServicio();

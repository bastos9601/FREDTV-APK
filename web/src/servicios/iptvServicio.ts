import axios from 'axios';
import { IPTV_CONFIG } from '../utils/constantes';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  password: string;
  auth: number;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  created_at: string;
  max_connections: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface VodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

export interface SeriesInfo {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

class IPTVService {
  private baseURL = IPTV_CONFIG.HOST;
  private credentials: AuthCredentials | null = null;

  setCredentials(credentials: AuthCredentials) {
    this.credentials = credentials;
  }

  private getAuthParams() {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    return {
      username: this.credentials.username,
      password: this.credentials.password,
    };
  }

  async login(username: string, password: string): Promise<UserInfo> {
    try {
      console.log('Iniciando petición de login...');
      console.log('URL:', `${this.baseURL}/player_api.php`);
      console.log('Params:', { username, password: '***' });
      
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          username,
          password,
        },
        timeout: 10000,
      });

      console.log('Respuesta recibida:', response.data);

      if (response.data.user_info && response.data.user_info.auth === 1) {
        this.setCredentials({ username, password });
        return response.data.user_info;
      } else {
        console.error('Autenticación fallida:', response.data);
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      
      if (error.response) {
        console.error('Error de respuesta del servidor:', error.response.status, error.response.data);
        throw new Error(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        console.error('Error de red - no se recibió respuesta');
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión o el servidor puede estar bloqueando peticiones desde el navegador (CORS).');
      } else {
        console.error('Error al configurar la petición:', error.message);
        throw new Error('Error al iniciar sesión: ' + error.message);
      }
    }
  }

  async getLiveCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          ...this.getAuthParams(),
          action: 'get_live_categories',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías de TV en vivo');
    }
  }

  async getLiveStreams(categoryId?: string): Promise<LiveStream[]> {
    try {
      const params: any = {
        ...this.getAuthParams(),
        action: 'get_live_streams',
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener canales');
    }
  }

  async getVodCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          ...this.getAuthParams(),
          action: 'get_vod_categories',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías de películas');
    }
  }

  async getVodStreams(categoryId?: string): Promise<VodStream[]> {
    try {
      const params: any = {
        ...this.getAuthParams(),
        action: 'get_vod_streams',
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener películas');
    }
  }

  async getSeriesCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          ...this.getAuthParams(),
          action: 'get_series_categories',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías de series');
    }
  }

  async getSeries(categoryId?: string): Promise<SeriesInfo[]> {
    try {
      const params: any = {
        ...this.getAuthParams(),
        action: 'get_series',
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener series');
    }
  }

  async getSeriesInfo(seriesId: number) {
    try {
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          ...this.getAuthParams(),
          action: 'get_series_info',
          series_id: seriesId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener información de la serie');
    }
  }

  getLiveStreamUrl(streamId: number, extension: string = 'm3u8'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    // Si hay proxy, usar ruta relativa, sino usar baseURL completo
    const host = this.baseURL || 'http://zona593.live:8080';
    // Para TV en vivo, usar .m3u8 por defecto (HLS)
    return `${host}/live/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }

  getVodStreamUrl(streamId: number, extension: string = 'mp4'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    const host = this.baseURL || 'http://zona593.live:8080';
    return `${host}/movie/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }

  getSeriesStreamUrl(streamId: number, extension: string = 'mp4'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    const host = this.baseURL || 'http://zona593.live:8080';
    return `${host}/series/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }
}

const iptvServicio = new IPTVService();
export default iptvServicio;

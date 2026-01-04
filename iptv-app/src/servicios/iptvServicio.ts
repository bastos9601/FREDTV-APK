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

  /**
   * Actualiza la URL base del servidor
   */
  setBaseURL(url: string) {
    this.baseURL = url;
    console.log('Servidor IPTV actualizado a:', url);
  }

  /**
   * Obtiene la URL base actual
   */
  getBaseURL(): string {
    return this.baseURL;
  }

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
      const response = await axios.get(`${this.baseURL}/player_api.php`, {
        params: {
          username,
          password,
        },
        timeout: 10000,
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.user_info && response.data.user_info.auth === 1) {
        this.setCredentials({ username, password });
        return response.data.user_info;
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      if (error.response) {
        throw new Error(`Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar al servidor');
      } else {
        throw new Error('Error al iniciar sesión');
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

  getLiveStreamUrl(streamId: number, extension: string = 'ts'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    return `${this.baseURL}/live/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }

  getVodStreamUrl(streamId: number, extension: string = 'mp4'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    return `${this.baseURL}/movie/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }

  getSeriesStreamUrl(streamId: number, extension: string = 'mp4'): string {
    if (!this.credentials) {
      throw new Error('No hay credenciales configuradas');
    }
    return `${this.baseURL}/series/${this.credentials.username}/${this.credentials.password}/${streamId}.${extension}`;
  }
}

export default new IPTVService();

import axios from 'axios';
import { TMDB_CONFIG } from '../utils/constantes';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
}

interface TMDBTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  videos: {
    results: TMDBTrailer[];
  };
}

class TMDBServicio {
  /**
   * Limpia el nombre de la película removiendo sufijos comunes
   */
  private limpiarNombrePelicula(nombre: string): string {
    // Remover sufijos comunes como (Dual), (Sub), (Lat), etc.
    return nombre
      .replace(/\s*\([^)]*\)\s*/g, '') // Remover todo entre paréntesis
      .replace(/\s+/g, ' ') // Remover espacios múltiples
      .trim();
  }

  /**
   * Busca una película en TMDB por nombre
   */
  async buscarPelicula(nombrePelicula: string): Promise<TMDBMovie | null> {
    // Limpiar el nombre antes de buscar
    const nombreLimpio = this.limpiarNombrePelicula(nombrePelicula);
    
    try {
      const response = await axios.get(`${TMDB_CONFIG.BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_CONFIG.API_KEY,
          query: nombreLimpio,
          language: 'es-ES',
        },
        timeout: 5000,
      });

      if (response.data.results && response.data.results.length > 0) {
        console.log(`Película encontrada en TMDB: ${nombreLimpio}`);
        return response.data.results[0];
      }

      console.log(`No se encontró película en TMDB: ${nombreLimpio}`);
      return null;
    } catch (error) {
      console.error('Error buscando película en TMDB:', error);
      return null;
    }
  }

  /**
   * Obtiene los detalles de una película incluyendo trailers
   */
  async obtenerDetallesPelicula(movieId: number): Promise<TMDBMovieDetails | null> {
    try {
      console.log(`Obteniendo detalles de película con ID: ${movieId}`);
      const response = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_CONFIG.API_KEY,
          language: 'es-ES',
          append_to_response: 'videos',
        },
        timeout: 5000,
      });

      console.log(`Detalles obtenidos para: ${response.data.title}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo detalles de película:', error);
      return null;
    }
  }

  /**
   * Obtiene el trailer de YouTube de una película
   */
  async obtenerTrailerYouTube(movieId: number): Promise<string | null> {
    try {
      const detalles = await this.obtenerDetallesPelicula(movieId);

      if (!detalles) {
        console.log('No se obtuvieron detalles de la película');
        return null;
      }

      if (!detalles.videos || !detalles.videos.results) {
        console.log('No hay videos disponibles para esta película');
        return null;
      }

      console.log(`Videos encontrados: ${detalles.videos.results.length}`);
      
      // Buscar trailer oficial en YouTube (primero en español, luego en inglés)
      let trailer = detalles.videos.results.find(
        (video: TMDBTrailer) =>
          video.site === 'YouTube' &&
          (video.type === 'Trailer' || video.type === 'Teaser')
      );

      if (trailer) {
        console.log(`Trailer encontrado: ${trailer.name} (${trailer.key})`);
        // Retornar solo el video ID
        return trailer.key;
      }

      console.log('No se encontró trailer en YouTube');
      return null;
    } catch (error) {
      console.error('Error obteniendo trailer:', error);
      return null;
    }
  }

  /**
   * Busca una película y obtiene su trailer en una sola llamada
   */
  async buscarPeliculaConTrailer(nombrePelicula: string): Promise<{
    pelicula: TMDBMovie | null;
    trailerUrl: string | null;
  }> {
    try {
      const pelicula = await this.buscarPelicula(nombrePelicula);

      if (!pelicula) {
        console.log('No se encontró película');
        return { pelicula: null, trailerUrl: null };
      }

      console.log(`Buscando trailer para película ID: ${pelicula.id}`);
      let trailerUrl = await this.obtenerTrailerYouTube(pelicula.id);

      // Si no encuentra trailer en español, intentar en inglés
      if (!trailerUrl) {
        console.log('No se encontró trailer en español, intentando en inglés...');
        trailerUrl = await this.obtenerTrailerYouTubeEnIngles(pelicula.id);
      }

      return { pelicula, trailerUrl };
    } catch (error) {
      console.error('Error en buscarPeliculaConTrailer:', error);
      return { pelicula: null, trailerUrl: null };
    }
  }

  /**
   * Obtiene el trailer en inglés si no está disponible en español
   */
  private async obtenerTrailerYouTubeEnIngles(movieId: number): Promise<string | null> {
    try {
      const response = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_CONFIG.API_KEY,
          language: 'en-US',
          append_to_response: 'videos',
        },
        timeout: 5000,
      });

      if (!response.data.videos || !response.data.videos.results) {
        return null;
      }

      const trailer = response.data.videos.results.find(
        (video: TMDBTrailer) =>
          video.site === 'YouTube' &&
          (video.type === 'Trailer' || video.type === 'Teaser')
      );

      if (trailer) {
        console.log(`Trailer en inglés encontrado: ${trailer.name}`);
        // Retornar solo el video ID
        return trailer.key;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo trailer en inglés:', error);
      return null;
    }
  }
}

export default new TMDBServicio();

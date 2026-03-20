import axios from 'axios';

class TrailerServicio {
  /**
   * Busca un trailer en YouTube usando el nombre de la película
   * Retorna la URL del video de YouTube o null si no encuentra
   */
  async buscarTrailerYouTube(nombrePelicula: string): Promise<string | null> {
    try {
      // Construir URL de búsqueda de YouTube
      // Nota: Esta es una búsqueda simple sin API key
      // Para una solución más robusta, se recomienda usar YouTube Data API
      
      const searchQuery = `${nombrePelicula} trailer`;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      
      // Intentar obtener el HTML de la página de búsqueda
      const response = await axios.get(youtubeSearchUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Buscar el primer video en los resultados
      const videoIdMatch = response.data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      
      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return null;
    } catch (error) {
      console.error('Error buscando trailer en YouTube:', error);
      return null;
    }
  }

  /**
   * Extrae el ID de video de una URL de YouTube
   */
  extractYouTubeId(url: string): string | null {
    try {
      // Soporta múltiples formatos de URL de YouTube
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Error extrayendo ID de YouTube:', error);
      return null;
    }
  }

  /**
   * Construye una URL de embed de YouTube
   */
  getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  }
}

export default new TrailerServicio();

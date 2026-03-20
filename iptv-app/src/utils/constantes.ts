export const IPTV_CONFIG = {
  HOST: 'http://zgazy.com:8880', // Servidor principal
  ENDPOINTS: {
    LOGIN: '/player_api.php',
    LIVE_CATEGORIES: '/player_api.php',
    LIVE_STREAMS: '/player_api.php',
    VOD_CATEGORIES: '/player_api.php',
    VOD_STREAMS: '/player_api.php',
    SERIES_CATEGORIES: '/player_api.php',
    SERIES: '/player_api.php',
    SERIES_INFO: '/player_api.php',
  }
};

export const TMDB_CONFIG = {
  API_KEY: '3dcbd9b3ad936919d46c1584590c9a6b',
  BASE_URL: 'https://api.themoviedb.org/3',
};

export const COLORS = {
  primary: '#E50914',
  background: '#141414',
  card: '#2F2F2F',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#404040',
};

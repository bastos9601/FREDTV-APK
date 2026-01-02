// Usar variable de entorno o fallback
const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : '');

export const IPTV_CONFIG = {
  // En desarrollo usa el proxy de package.json
  // En producción usa el proxy de Netlify (/api)
  HOST: API_BASE,
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

export const COLORS = {
  primary: '#E50914',
  background: '#141414',
  card: '#2F2F2F',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#404040',
};

// ============================================
// MODIFICACIONES PARA iptvServicio.ts
// ============================================
// Agrega estos métodos a tu clase IPTVService existente

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

// ============================================
// EJEMPLO DE CÓMO DEBERÍA QUEDAR LA CLASE:
// ============================================

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

  // ... resto de tus métodos existentes
}

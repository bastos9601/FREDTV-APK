const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const IPTV_HOST = 'http://zona593.live:8080';
const PORT = 3001;

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta para todas las peticiones API
app.get('/api/*', async (req, res) => {
  try {
    const path = req.path.replace('/api', '');
    const url = `${IPTV_HOST}${path}`;
    
    console.log('📡 Proxy request:', url);
    console.log('📋 Query params:', req.query);
    
    const response = await axios.get(url, {
      params: req.query,
      timeout: 10000,
      headers: {
        'User-Agent': 'FRED-TV-Web/1.0'
      }
    });
    
    console.log('✅ Response status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Error del servidor IPTV',
        details: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'No se pudo conectar al servidor IPTV',
        details: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error interno del proxy',
        details: error.message
      });
    }
  }
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    iptvHost: IPTV_HOST
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log('✅ Proxy Server FRED TV');
  console.log('🌐 Running on: http://localhost:' + PORT);
  console.log('📡 IPTV Host: ' + IPTV_HOST);
  console.log('🔧 Health check: http://localhost:' + PORT + '/health');
  console.log('================================');
  console.log('');
  console.log('💡 Configura tu app web para usar:');
  console.log('   HOST: "http://localhost:' + PORT + '/api"');
  console.log('');
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

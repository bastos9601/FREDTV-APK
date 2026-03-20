const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimizaciones de Metro para mejor rendimiento
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    output: {
      ascii_only: true,
    },
  },
};

// Optimizar resolución de módulos
config.resolver = {
  ...config.resolver,
  sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;

const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidNetworkConfig(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Asegurar que application existe
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }

    // Agregar usesCleartextTraffic
    androidManifest.application[0].$['android:usesCleartextTraffic'] = 'true';

    return config;
  });
};

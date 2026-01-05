const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withInstallApkPermission(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Asegurar que existe el array de permisos
    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    // Verificar si el permiso ya existe
    const hasPermission = androidManifest['uses-permission'].some(
      (permission) =>
        permission.$['android:name'] === 'android.permission.REQUEST_INSTALL_PACKAGES'
    );

    // Agregar el permiso si no existe
    if (!hasPermission) {
      androidManifest['uses-permission'].push({
        $: {
          'android:name': 'android.permission.REQUEST_INSTALL_PACKAGES',
        },
      });
    }

    return config;
  });
};

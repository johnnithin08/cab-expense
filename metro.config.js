function safeRequire(name) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(name);
  } catch (_e) {
    return null;
  }
}

const rnMetro = safeRequire('@react-native/metro-config');
const exclusionList =
  safeRequire('metro-config/src/defaults/exclusionList') ||
  safeRequire('metro-config/src/defaults/exclusionList.js');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = exclusionList
  ? {
      resolver: {
        blacklistRE: exclusionList([/#current-cloud-backend\/.*/]),
      },
    }
  : {};

// If `@react-native/metro-config` isn't installed (common when you’re only running the Expo app),
// don’t crash while loading this config.
if (rnMetro?.getDefaultConfig && rnMetro?.mergeConfig) {
  module.exports = rnMetro.mergeConfig(rnMetro.getDefaultConfig(__dirname), config);
} else {
  module.exports = config;
}

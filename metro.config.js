// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);
config.resolver.assetExts.push(
  // Adds support for `.html` files for web views
  'html'
);
config.resolver.assetExts.push(
  // Adds support for `.json` files for hashes
  'json'
);


module.exports = config;
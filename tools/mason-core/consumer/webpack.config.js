const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);
  const config = webpack.resolveConfig();
  // Mason core branches on __WINDOWS__, which @nativescript/webpack doesn't
  // define; the plugin's own nativescript.webpack.js does the same shim.
  config.plugins = [...(config.plugins || []), new (require('webpack').DefinePlugin)({ __WINDOWS__: webpack.Utils.platform.getPlatformName() === 'windows' })];
  return config;
};

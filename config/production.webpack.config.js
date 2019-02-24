const webpack = require('webpack');

const commonWebpackConfig = require('./common.webpack.config');

commonWebpackConfig.mode = 'production';
commonWebpackConfig.plugins.push(
  new webpack.DefinePlugin({
    ENV: {
      showDebugInfo: false,
    },
  }),
);

module.exports = commonWebpackConfig;

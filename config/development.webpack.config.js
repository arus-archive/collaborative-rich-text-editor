const webpack = require('webpack');

const commonWebpackConfig = require('./common.webpack.config');

commonWebpackConfig.mode = 'development';
commonWebpackConfig.devtool = 'inline-source-map';
commonWebpackConfig.plugins.push(
  new webpack.DefinePlugin({
    ENV: {
      showDebugInfo: true,
    },
  }),
);

module.exports = commonWebpackConfig;

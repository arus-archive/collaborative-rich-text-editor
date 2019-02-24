const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const clientSrcPath = path.join(__dirname, '..', 'src', 'client');
const clientBuildPath = path.join(__dirname, '..', 'build');

module.exports = {
  entry: path.join(clientSrcPath, 'app', 'app.js'),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          }],
      }, {
        test: /\.html$/,
        use: ['html-loader'],
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },

  output: {
    filename: '[name].js',
    path: clientBuildPath,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(clientSrcPath, 'index.html'),
    }),
  ],
};

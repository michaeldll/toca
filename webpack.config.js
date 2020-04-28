const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000,
  },
  plugins: [
    new CopyPlugin([
      {
        from: './src/index.html',
        to: path.resolve(__dirname, 'dist'),
      },
      {
        from: 'src/assets/',
        to: path.resolve(__dirname, 'dist', 'assets'),
      },
      {
        from: 'src/css/',
        to: path.resolve(__dirname, 'dist', 'css'),
      },
    ]),
  ],
};

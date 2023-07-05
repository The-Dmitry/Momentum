const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

module.exports = ({ dev }) => ({
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[hash][ext]',
    clean: true,
  },
  performance: {
    hints: false,
  },
  devtool: dev ? 'inline-source-map' : false,
  mode: dev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      /*title: 'Base',*/ template: './src/index.html',
      filename: 'index.html',
      minify: dev ? false : true,
    }),
    new MiniCssExtractPlugin({
      /*filename: '[name].[contenthash].css'*/
    }),
    new EslintPlugin({ extensions: 'ts', emitError: false, emitWarning: false }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    hot: true,
    open: true,
    port: 8080,
    static: './dist',
  },
});

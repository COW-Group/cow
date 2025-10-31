const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Debug: Log environment variables
console.log('🔧 TULA App Webpack Config - Environment Variables:');
console.log('  SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('  SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false
            }
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'TULA - Legal & Compliance Platform',
    }),
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4204,
    open: true,
    historyApiFallback: true,
    hot: true,
  },
};

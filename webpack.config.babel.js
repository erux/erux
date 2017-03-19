import webpack from 'webpack';

// eslint-disable-next-line no-undef
const { NODE_ENV } = process.env;
const filename = `erux${NODE_ENV === 'production' ? '.min' : ''}.js`;

export default {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },

  entry: ['./src/index'],

  output: {
    path: 'dist',
    filename,
    library: 'Erux',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    ...(NODE_ENV === 'production' && [
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ])
  ]
};

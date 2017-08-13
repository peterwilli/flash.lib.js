module.exports = {
  entry: './src/main.js',
  output: {
    library: "flash.lib",
    libraryTarget: "umd",
    filename: "dist/flash.lib.js",
    auxiliaryComment: "Test Comment"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  }
};

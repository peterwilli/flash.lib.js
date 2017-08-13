module.exports = {
  entry: './src/main.js',
  output: {
    library: "flash.lib",
    libraryTarget: "umd",
    filename: "dist/flash.lib.js",
    auxiliaryComment: "Test Comment"
  }
};

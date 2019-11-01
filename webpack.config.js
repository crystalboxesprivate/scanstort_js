/** Callbacks with global UMD-name of material-ui imports */
function externalMaterialUI (_, module, callback) {
    var isMaterialUIComponent = /^@material-ui\/core\/([^/]+)$/;
    var match = isMaterialUIComponent.exec(module);
    if (match !== null) {
        var component = match[1];
        return callback(null, `window["material-ui"].${component}`);
    }
    callback();
}

module.exports = {
  mode: "production",
  devtool: "source-map",
  resolve: {
      extensions: [".ts", ".tsx"]
  },
  module: {
      rules: [
          {
              test: /\.ts(x?)$/,
              exclude: /node_modules/,
              use: [
                  {
                      loader: "ts-loader"
                  }
              ]
          },
          {
              enforce: "pre",
              test: /\.js$/,
              loader: "source-map-loader"
          }
      ]
  },
  externals: [
    {
      "react": "React",
      "react-dom": "ReactDOM"
    },
  ]
}
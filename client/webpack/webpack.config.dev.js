const path = require("path")
const webpack = require("webpack")

const relativeToRoot = relativePath =>
  path.resolve(__dirname, "../", relativePath)

const common_config = require("./webpack.config.common")

module.exports = {
  ...common_config,
  mode: "development",

  output: {
    filename: "[name].[hash].js",
    path: relativeToRoot("./dist"),
    publicPath: "/",
  },

  devtool: "inline-source-map",

  devServer: {
    hot: false,
    port: 3000,
    historyApiFallback: true,
  },

  plugins: [
    ...common_config.plugins,
    new webpack.EnvironmentPlugin({
      APP_MODE: "development",
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
}

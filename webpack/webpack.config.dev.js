const path = require("path")
const webpack = require("webpack")

const relativeToRoot = (relativePath) =>
  path.resolve(__dirname, "../", relativePath)

const common_config = require("./webpack.config.common")

module.exports = {
  ...common_config,
  mode: "development",

  output: {
    filename: "[name].[hash].js",
    path: relativeToRoot("./dist"),
    publicPath: "/",
    globalObject: "self",
  },

  devtool: "inline-source-map",

  devServer: {
    hot: false,
    port: 7000,
    historyApiFallback: true,
    publicPath: "/",
    contentBase: relativeToRoot("static"),
  },

  plugins: [
    ...common_config.plugins,
    new webpack.EnvironmentPlugin({
      APP_MODE: process.env.APP_MODE || "staging",
      NODE_ENV: process.env.NODE_ENV || "development",
    }),
  ],
}

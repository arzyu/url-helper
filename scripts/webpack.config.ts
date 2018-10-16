import { resolve } from "path";

import * as webpack from "webpack";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackInlineSourcePlugin from "html-webpack-inline-source-plugin";

const isDev = process.env.NODE_ENV === "development";

const root = resolve(__dirname, "..");
const dist = resolve(root, "www");

const config: webpack.Configuration = {
  context: resolve(root, "src"),
  resolve: {
    extensions: [".ts", ".js"]
  },
  mode: isDev ? "development" : "production",
  devtool: isDev ? "cheap-module-eval-source-map" : false,
  entry: {
    router: "./app.ts"
  },
  output: {
    filename: "[name].[hash:7].js",
    path: dist
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          { loader: "awesome-typescript-loader" }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(dist, { root }),
    new HtmlWebpackPlugin({
      template: "app.ejs",
      filename: "app.html",
      inlineSource: "\.js$"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};

export default config;

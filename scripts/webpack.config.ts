import { resolve } from "path";

import webpack from "webpack";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackInlineSourcePlugin from "html-webpack-inline-source-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

const isDev = process.env.NODE_ENV === "development";

const root = resolve(__dirname, "..");
const dist = resolve(root, "www");

const config: webpack.Configuration = {
  context: resolve(root, "src"),
  resolve: {
    extensions: [".ts", ".js"]
  },
  mode: isDev ? "development" : "production",
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  devtool: isDev ? "cheap-module-eval-source-map" : false,
  entry: {
    app: "./app.ts"
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
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              module: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-preset-env")({
                  stage: 3,
                  features: {
                    "nesting-rules": true
                  }
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          { loader: "url-loader" }
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

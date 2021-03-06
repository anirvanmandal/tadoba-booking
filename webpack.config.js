const path = require('path')
const { DefinePlugin } = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')

const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const { name, version } = require('./package.json')

const SRC_PATH = path.resolve('./app/src')
const PUBLIC_PATH = path.resolve('./app')

module.exports = (_, argv) => {
  return {
    mode: 'development',
    devtool: 'source-map',
    cache: true,

    entry: {
      options: `${SRC_PATH}/js/options`,
      popup: `${SRC_PATH}/js/popup`,
      'service-worker': `${SRC_PATH}/js/service-worker`,
      'content-script': `${SRC_PATH}/js/content-script`,
      app: `${SRC_PATH}/scss/app.scss`,
      vendor: `${SRC_PATH}/scss/vendor.scss`
    },

    output: {
      path: `${PUBLIC_PATH}`,
      filename: '[name].min.js',
      chunkFilename: '[name].bundle.js'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'app/src/js'),
          use: [
            'babel-loader'
          ]
        },

        {
          test: /\.scss$/,
          include: path.resolve(__dirname, 'app/src/scss'),
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [require('autoprefixer')()]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'expanded'
                }
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|ttf|otf|png)([?]?.*)$/,
          exclude: /(node_modules)/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]'
          }
        }
      ]
    },

    plugins: [
      new DefinePlugin({
        __VERSION__: JSON.stringify(version),
        __NAME__: JSON.stringify(name),
        __TEST__: false
      }),

      new StylelintPlugin({
        fix: true
      }),

      new ESLintPlugin({
        fix: true
      }),

      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].css',
        chunkFilename: 'assets/css/[id].css'
      }),
      new RemoveEmptyScriptsPlugin()
    ],

    resolve: {
      alias: {
        waypoints: 'waypoints/lib/noframework.waypoints.js'
      }
    }
  }
}

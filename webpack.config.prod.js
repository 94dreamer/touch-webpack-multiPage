/**
 * Created by zhouzhen on 2017/2/17.
 */
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');


const isOnline = (process.env.NODE_ENV === 'online');

var AssetsPlugin = require('assets-webpack-plugin');//生成文件路径JSON的插件
var assetsPluginInstance = new AssetsPlugin({
  filename: isOnline ? 'assets_online.json' : 'assets_dev.json',
  path: path.join(__dirname),
  //includeManifest: 'manifest',
  //prettyPrint: true,//美化输出
  /*processOutput: function (assets) {//格式化输出
   return 'window.staticMap = ' + JSON.stringify(assets)
   }*/
  update: true,//非覆盖式更新
  metadata: {version: 123}//注入额外版本号

});

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var autoprefixer = require('autoprefixer');

var WebpackMd5Hash = require('webpack-md5-hash');

const settings = {
  devtools: 'cheap-module-eval-source-map',
  entry: {
    home: [
      /*'webpack-dev-server/client?http://localhost:8080',
       'webpack/hot/dev-server',*/
      './src/js/home.js'
    ],
    detail: [
      './src/js/detail.js'
    ],
    vendors: ['jquery', `${__dirname}/src/js/lib/jquery.lazyload.js`, `${__dirname}/src/js/lib/baiduTemplate.js`, `${__dirname}/src/js/lib/spin.js`]
  },
  output: {
    filename: isOnline ? '[name].[chunkhash:6].js' : '[name].js?[chunkhash:6]',//[hash:6]用来管理整体版本，可以用来表示文件夹
    //filename: '[name].js',
    path: `${__dirname}/dist/`,
    chunkFilename: isOnline ? 'chunk/[id][name]-[chunkhash:6].js' : 'chunk/[id][name].js?[chunkhash:6]',
    publicPath: 'http://res2.esf.leju.com/new_leju/dist/'
  },
  postcss: function () {
    return {
      defaults: [autoprefixer],
      cleaner: [autoprefixer({browsers: ["ios >= 7", "android >= 4.0"]})]
    };
  },
  resolve: {
    alias: {//它的作用是把用户的一个请求重定向到另一个路径
      //'redux-devtools/lib': path.join(__dirname, '..', '..', 'src'),//这些但是demo自定义的
      //'redux-devtools': path.join(__dirname, '..', '..', 'src'),
      //'react': path.join(__dirname, 'node_modules', 'react'),
      //'moment': "moment/min/moment-with-locales.min.js"
    },
    extensions: ['', '.js', '.scss', '.css', '.png', 'jpg', 'jpeg']
  },
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules')//定义绝对路径
  },
  module: {
    //noParse: [/moment-with-locales/],//将不再扫描这个文件中的依赖
    /*preLoaders: [
     {
     test: /\.jsx$|\.js$/,
     loader: 'eslint-loader',
     include: `${__dirname}/src`,
     exclude: /bundle\.js$/
     }
     ],*/
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }, {
        //test: /\.css$/, loader: ExtractTextPlugin.extract('style!css')
        test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader?importLoaders=1!postcss-loader")
        //test: /\.css$/, loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
      }, {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        //loader: ExtractTextPlugin.extract('style!css!sass')
        //loader: 'style!css!sass?importLoaders=1!postcss-loader'
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader?importLoaders=1!postcss-loader")
      }, {
        test: /\.(png|jpg|gif)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
      },
      {// expose-loader将需要的变量从依赖包中暴露出来
        test: require.resolve("jquery"),
        loader: "expose-loader?$!expose-loader?jQuery"
      }
    ]
  },
  plugins: [
    assetsPluginInstance,
    require('autoprefixer'),
    new WebpackMd5Hash(),
    new ExtractTextPlugin(path.join('css', isOnline ? '[name].[contenthash:6].[id].css' : '[name].[id].css?[contenthash:6]')),
    //new ExtractTextPlugin("../css/[name].[id].css"),
    new webpack.optimize.CommonsChunkPlugin({
      //names: ['vendors', 'manifest']
      name: 'vendors',// 将公共模块提取，生成名为`vendors`的chunk
      //filename: "[name].[chunkhash:6].js"
    }),
    /*new webpack.optimize.CommonsChunkPlugin({
     name: 'commom',// 将公共模块提取，生成名为`vendors`的chunk
     chunks: ['home', 'detail'], //提取哪些模块共有的部分
     minChunks: 3
     }),*/
    new webpack.optimize.DedupePlugin(),//删除类似的重复代码
    new webpack.optimize.OccurrenceOrderPlugin(),//计算优化分配模块
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: false
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.NoErrorsPlugin()
  ]
};

process.env.NODE_ENV && settings.plugins.push(
  new webpack.optimize.UglifyJsPlugin({//压缩
    compressor: {
      warnings: false
    }
  })
);

console.log(process.env.NODE_ENV);

module.exports = settings;
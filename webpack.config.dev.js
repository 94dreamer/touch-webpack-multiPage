/**
 * Created by zhouzhen on 2017/2/17.
 */
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var autoprefixer = require('autoprefixer');
//var precss = require('precss');//不用了吧

module.exports = {
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    inline: true,
    progress: true,
    contentBase: './',
    port: 8080
  },
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
    vendors: ['jquery', `${__dirname}/src/js/lib/jquery.lazyload.js`,`${__dirname}/src/js/lib/spin.js`]
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist/js`,
    //chunkFilename: 'chunk[id].js?ver' + new Date().getTime(),
    //chunkFilename: 'chunk/chunk[id][name]-[chunkhash:6].js',
    chunkFilename: 'chunk/chunk[id][name].js',
    //publicPath: 'http://res2.esf.leju.com/new_leju/'
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
    //require('autoprefixer'),
    new ExtractTextPlugin("./css/[name].[id].css"),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',// 将公共模块提取，生成名为`vendors`的chunk
      filename: 'vendors.js',
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
      __DEV__: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),//热加载
    new HtmlWebpackPlugin({
      template: './html/home.html',//html模板路径
      favicon: './favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/home.html', //生成的html存放路径，相对于path
      inject: true, //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'home'],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: './favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/detail.html', //生成的html存放路径，相对于path
      template: './html/detail.html', //html模板路径
      inject: true, //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'detail'],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    })
    /*, new webpack.optimize.UglifyJsPlugin({//压缩
     compressor: {
     warnings: false
     }
     })*/
  ]
};
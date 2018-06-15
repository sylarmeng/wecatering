var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')
var HappyPack = require('happypack');

module.exports = {
  // 注意target选项，这里如果选node，会导致浏览器加载时require not defined
  // target:'node',
  entry: {
    // client: './client/client.js'
    vendor: './vendor/vendor.js'
    // vendor: ['react'],
  },
  externals : {
          // 'react': 'window.React',
          'react': 'React',
         'react-dom': 'ReactDOM',
          "echarts": "echarts"
  },
  output: {
    // path: 'public',
	// filename: 'bundle.js',
    path: __dirname + '/public/static',
    filename: '[name].js',
    publicPath: '/static/',
    chunkFilename: '[name].bundle.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    
    new webpack.optimize.OccurrenceOrderPlugin(),
    // uglify模块非常影响打包时间生产时再打开
    // new webpack.optimize.UglifyJsPlugin(),

    new webpack.optimize.AggressiveMergingPlugin(),

	new HappyPack({
    // loaders is the only required parameter:
    loaders: [ 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-1&compact=false' ],
    // customize as needed, see Configuration below
	}),

    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),

/*    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      filename: 'vendor.js'
    })*/

  ],

  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loaders: [ 'happypack/loader' ],
      }
    ]
  }
/*  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader',
        query: {
          compact: false,
          presets: ['es2015','stage-1', 'react']
          ,plugins:['syntax-dynamic-import']
        }
      }
    ]
  }*/
}

/*正常使用的code
  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader',
        query: {
          compact: false,
          presets: ['es2015','stage-1', 'react']
          ,plugins:['syntax-dynamic-import']
        }
      }
    ]
  }
*/

//loader配置方式二
/*  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel-loader?presets[]=es2015&presets[]=react&compact=false'
        // query: {compact: false}
         }
    ]
  }*/

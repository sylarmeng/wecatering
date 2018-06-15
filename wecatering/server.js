
var express = require('express')
var path = require('path')
var compression = require('compression')

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs  = require('express-handlebars');
// upload img
//全局事件发射器
var pubsub = require('./eventhandle.js').pubsub;

var apiroutes = require('./routes/index')
//预防Web 漏洞
var helmet = require('helmet');


var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Mongoose = require('./models/mongooseConn.js');
var db =Mongoose()
var redis = require('./redis/redisconfig.js');
//记录所有ip动作
var accesslog = require('access-log');
// var format = 'url=":url" delta=":delta" ip=":ip"';
var format = 'url=":url" delta=":delta" ip=":Xip"';
// 禁用 X-Powered-By 头,
// app.disable('x-powered-by');
// helmet自动添加了禁用x-powered-by属性
app.use(helmet());
app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({extname: '.hbs',
      defaultLayout: __dirname + '/views/layouts/default.hbs',
      partialsDir: __dirname + '/views/partials',
      layoutsDir: __dirname + '/views/layouts',
      // helpers: new require('./routes/helpers')(),
          }));

app.set('view engine', '.hbs');

app.use(compression())

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb',extended: false }));
// 把这个放置到post路由中间件中******
app.use(cookieParser());
app.use('/',express.static('public/static'));
app.use('/static',express.static('public/static'));


app.use(function (req, res, next) {
	accesslog(req, res,format);
  next();
});

app.use('/',apiroutes)

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  next();
})


var socket = require('socket.io-client')('http://localhost:3001');
socket.on('connect', function(){
  // console.log('connected to srv:'+new Date());
  socket.emit('serverRoom');
  socket.emit('authen','2017_server');
});
pubsub.on('serverorderinfo', function(data) {
    // reveive new order
    console.log('receive new order')
    socket.emit('data2client',data);
    // socket.emit('data2client',data);
  });

// receive order status change
pubsub.on('revChange', function(data) {
    socket.emit('stateChange',data);
  });
pubsub.on('orderChecked', function(updateContent) {
    socket.emit('orderupdate',updateContent);
  });

var PORT = process.env.PORT || 3000
/*app.listen(PORT, function() {
  console.log('server running at localhost:' + PORT)
})*/

// 目前在用这个
/*http.listen(PORT, function(){
  console.log('listening on *:3000');
});*/

http.listen(PORT, function(){
  console.log('listening on *:3000');
});



/*io.on('connection', function(socket){
  console.log('a user connected',socket.id);
  io.sockets.connected[socket.id].emit('reqroom');
  socket.on('ack', function (data) {
    console.log('accept msg',data)
  });
  socket.on('room', function (data) {

    console.log('recv room id ')
    redis.get(data+'_sk',function(err,socketid){
      if(socketid){
        redis.del(socketid);
      }
      // 此处逻辑不必顺序执行
      redis.set(data+'_sk',socket.id)
      redis.set(socket.id,data+'_sk')
      socket.join(data)
    })
    console.log('recv uer:'+socket.id+'--with ID:'+data)
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected'+socket.id);
    redis.get(socket.id,function(err,shopid){
      if(shopid){
        console.log('del shopid**'+shopid)
        redis.del(shopid);
      }
      redis.del(socket.id);
    })
  });
});*/

/*pubsub.on('serverorderifo', function (data) {
    // console.log('receive order')
    redis.get(data.shopid+'_sk',function(err,shop_socketid){

      // console.log('send order to*******************',shop_socketid)
      //注意此处加出错处理，确认socket处于连接状态
      if(shop_socketid){
        io.sockets.connected[shop_socketid].emit('neworder', data.order);
      }
      // io.to(shopid).emit('neworder', data.order);
    })
  });*/
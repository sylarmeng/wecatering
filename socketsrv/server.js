
var express = require('express')
var path = require('path')

var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis').createClient();

var moment = require('moment');
// save connected server ID
var serverAlive=[];
// save all connection count
var connectCount = 0;
redis.on('connect', function(err) {
    // handle async errors here
    console.log('redis connect......');
  });
redis.on('error', function(err) {
    // handle async errors here
    console.log(err);
  });

// moment(new Date()).format("HH:mm")

io.on('connection', function(socket){
  
  // console.log(moment(new Date()).format("HH:mm")+ '  connect');
  connectCount++;
  console.log(moment(new Date()).format("HH:mm")+ '  current count:'+connectCount);
  // access control访问控制
  socket.auth = false;
  socket.on('authen', function(data){
    // server auth data
    if(data==='2017_server'){
      socket.auth = true;
    }
    //user auth data
    else{
      redis.get(data.user, function(err, token) {
        if(!err && (token===data.token))
          socket.auth = true;
      });
    }
    
  });
 
  setTimeout(function(){
    //If the socket didn't authenticate, disconnect it
    if (!socket.auth) {
      console.log("Disconnect:", socket.id);
      socket.disconnect('true');
    }
  }, 1000);

  // request room id
  io.sockets.connected[socket.id].emit('reqroom');

  socket.on('ack', function (data) {
    // console.log('accept msg',data)
  });

  socket.on('room', function (data) {
    // console.log('room data============'+data)
    if(data){
      console.log(moment(new Date()).format("HH:mm")+ '  recv id:'+data)
      redis.get(data+'_sk',function(err,socketid){
        if(err){
          console.log('room err:'+err)
        }
        

        if(data.length!==11){
          // 小号连接,加入主帐号命名的room
          redis.get(data+'_admin',function(err,adminAccount){
            // 先发送重置room消息
            socket.join(adminAccount);
            console.log('resetRoom')
            // 这里逻辑?
            if(io.sockets.connected[socket.id]!==undefined){
              // 如果直接发送，可能存在刚好socket断开连接的状况
              io.sockets.connected[socket.id].emit('resetRoom',adminAccount);
            }
            
            // 然后判断该账号是否已经连接过，如果连接了，断开，删除ID
            if(socketid){
                // if(io.sockets.connected[socketid]!==undefined){
                // 加id比较，不要把当前的id关闭了
                if(io.sockets.connected[socketid]!==undefined&&socketid!==socket.id){
                  io.sockets.connected[socketid].disconnect();
                  console.log(new Date()+ ':close last')
                }
                redis.del(socketid);
            }
            
          })

        }
        else{
          // 主帐号连接,加入自己命名的room
          socket.join(data)
          // io.sockets.connected[socket.id].emit('resetRoom',data);
          if(io.sockets.connected[socket.id]!==undefined){
              // 如果直接发送，可能存在刚好socket断开连接的状况
              io.sockets.connected[socket.id].emit('resetRoom',data);
            }
          if(socketid){
                if(io.sockets.connected[socketid]!==undefined&&socketid!==socket.id){
                  io.sockets.connected[socketid].disconnect();
                  console.log(moment(new Date()).format("HH:mm")+ ':close last')
                }
                redis.del(socketid);
            }
        }
        // 此处逻辑不必顺序执行
        redis.set(data+'_sk',socket.id)
        redis.set(socket.id,data+'_sk')

        

      })
    }
    
  });

// clear saved id after disconnect
  socket.on('disconnect', function () {
    
    console.log(moment(new Date()).format("HH:mm")+ '  disconnect');
    redis.get(socket.id,function(err,shopid){
      if(shopid){
        // console.log('del shopid**'+shopid)
        // console.log(moment(new Date()).format("HH:mm")+ ':disconnected shopid===='+shopid)
        // redis.del(shopid);
      }
      redis.del(socket.id);
    })
    // 如果是服务器离线了，从数组中删除服务器socketID
    if(serverAlive.indexOf(socket.id)!==-1){
      serverAlive.splice(serverAlive.indexOf(socket.id), 1);
      console.log('del serverID:'+serverAlive.length);
    }
    connectCount--;
    console.log(moment(new Date()).format("HH:mm")+ '  current count:'+connectCount);
  });

// transfer data from client to server
  socket.on('data2server', function (data) {
    // console.log('serverAlive:'+serverAlive.length)
    var Range = serverAlive.length;   
    if(Range==0){
      console.log('no server alive')
      return;
    }
    if(Range==1){
      var tmp_socket = serverAlive[0]
      io.sockets.connected[tmp_socket].emit('data','123');
    }
    else{
      var randomIndex =Math.floor(Math.random() * (Range))
      // console.log('randomIndex'+randomIndex)
      var tmp_socket = serverAlive[randomIndex];
      io.sockets.connected[tmp_socket].emit('data','456');
    }
  });
  // transfer data from server to client
  socket.on('data2client', function (data) {
    console.log('data2client----'+data.shopid);
    socket.to(data.shopid).emit('neworder', data.order);
    // socket.to(data.shopid).emit('neworder', data.order);
    //下面的方法适用单个账户，直接发给ID
    /*redis.get(data.shopid+'_sk',function(err,shop_socketid){
      // console.log('send order to*******************',shop_socketid)
      //注意此处加出错处理，确认socket处于连接状态
      if(shop_socketid){
        io.sockets.connected[shop_socketid].emit('neworder', data.order);
      }
    })*/
  });

// update order after an order was checked(close)
  socket.on('orderupdate', function (updateContent) {
    console.log('req order--'+updateContent.updateTarget);
    socket.to(updateContent.updateTarget).emit('clientUpdate',updateContent.checkedID);

  });
  
  // 测试后台任务的代码
  socket.on('keepConnect', function (msg) {
    // console.log('msg'+msg);
    console.log(moment(new Date()).format("HH:mm")+"===="+msg);

  });
  var tmpCount = 0
  setInterval(function(){
        tmpCount++;
        socket.emit('keepConnect',tmpCount);
      },2000);

// update single order
  socket.on('stateChange', function (data) {
    console.log('clientUpdate----'+data.to);
    socket.to(data.to).emit('revChange',data);

  });
  //--------------------------http server logic
  socket.on('serverRoom', function (data) {
    //注意disconnect时删除id
    serverAlive.push(socket.id)
    console.log('server connect:'+serverAlive.length)
  });
});

var PORT = process.env.PORT || 3001;
http.listen(PORT, function(){
  console.log('listening on:'+PORT);
});

/*    redis.get('serverCount',function(err,result){
      console.log('serverCount:'+result);
      if(result==null){
        redis.set('serverCount',1);
        redis.set('server_'+0,socket.id);
      }  
      else{
        redis.set('serverCount',parseInt(result)+1);
        redis.set('server_'+result,socket.id);
      }
    });*/
/*const spawn = require('child_process').spawn;


const ls = spawn('ls', ['-lh', '/usr']);*/

var child_process = require('child_process');
var p_process = child_process.fork('./reportAnalysis.js');

p_process.on('message',function(result){
	console.log(result);
})
p_process.send('message');

/*var child = child_process.fork('./child.js');
child.on('message', function(m) {
  console.log('收到了父进程的消息:', m);
});

//发送消息到子进程
child.send({ hello: 'world' });*/
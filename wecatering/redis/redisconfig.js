var redis = require("redis"),
    client = redis.createClient();
	client.on('error', function(err) {
	  // handle async errors here
	  console.log(err);
	});
	client.on('ready', function() {
	  // handle async errors here
	  console.log('redis connected');
	});
module.exports = client;

// module.exports = require('redis').createClient();
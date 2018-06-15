var EventEmitter = require('events').EventEmitter
  , pubsub = new EventEmitter();

exports.pubsub = pubsub;

/*pubsub.on('loggedIn', function(msg) {
    console.log(msg);
});*/
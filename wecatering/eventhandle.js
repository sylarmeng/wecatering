var EventEmitter = require('events').EventEmitter,
	pubsub = new EventEmitter();

exports.pubsub = pubsub;
var config = require('./config.js'),
    mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

// var config=require('./config.js');
var dburl='mongodb://'+config.dbip+'/'+config.dbname;

module.exports = function(){
    var db = mongoose.connect(dburl,function(err) {
        if(err) {
            console.log('db error', err);
        } else {
            console.log('db:' + dburl);
        }
    });
    return db;
};


/*var config = require('./config.js'),
    mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

// var config=require('./config.js');
var dburl='mongodb://'+config.user+':'+config.pwd+'@'+config.dbip+'/'+config.dbname;

module.exports = function(){
    var db = mongoose.connect(dburl,function(err) {
        if(err) {
            console.log('db error', err);
        } else {
            console.log('db:' + dburl);
        }
    });
    return db;
};*/

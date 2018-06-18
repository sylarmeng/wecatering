var config = require('./config.js'),
    mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

//使用环境变量来选择配置，生产环境要加上账户和密码
var dburl='mongodb://'+config.dbip+'/'+config.dbname;
// var dburl='mongodb://'+config.user+':'+config.pwd+'@'+config.dbip+'/'+config.dbname;
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

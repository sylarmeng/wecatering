
/*var Mongoose = require('./model/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('./model/shop.js').Shop;
var usermodel = require('./model/user.js').User;
var dishmodel = require('./model/dish.js').Dish;
var waitermodel = require('./model/waiter.js').Waiter;*/

var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var waitermodel = require('../models/waiter.js').Waiter;

var async = require("async");

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'deep2017';

var encrypt = function (text){
  // test return original password
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
var decrypt = function (text){
  console.log(text);
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
var updatePwd = function(user, doneCallback){
  console.log(user.password);
	var encryprPwd = encrypt(user.password);
	usermodel.findOneAndUpdate({'_id':user._id},
		{$set:{'password':encryprPwd}},
    // {$set:{'password':'12345'}},
		function(err,updateResult){
			// console.log(err)
			// console.log('updateResult=='+updateResult)
			return doneCallback(null);
		})
	
}

var updateWaiterPwd = function(user, doneCallback){
  console.log(user.password);
  var encryprPwd = encrypt(user.password);
  waitermodel.findOneAndUpdate({'_id':user._id},
    {$set:{'password':encryprPwd}},
    // {$set:{'password':'12345'}},
    function(err,updateResult){
      // console.log(err)
      // console.log('updateResult=='+updateResult)
      return doneCallback(null);
    })
  
}

var asyncTask = function(userList,updateModel){
	async.eachLimit(userList,3,updateModel,function(err,results){
		
        console.log("Finished!");
        // process.exit();
    })
}

var queryshop = usermodel.find({}).exec();
queryshop.then(function(result){
	console.log('batch');
	console.log(result.length);
	asyncTask(result,updatePwd);
	// process.exit();

})
.fail(function (error) {
    console.log(error);
    process.exit();
});

var querywaiter = waitermodel.find({}).exec();
querywaiter.then(function(result){
  console.log('batch');
  console.log(result.length);
  asyncTask(result,updateWaiterPwd);
  // process.exit();

})
.fail(function (error) {
    console.log(error);
    process.exit();
});





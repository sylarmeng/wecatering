
/*var Mongoose = require('./model/mongooseConn.js');
var db =Mongoose();
var shopmodel = require('./model/shop.js').Shop;
var usermodel = require('./model/user.js').User;
var dishmodel = require('./model/dish.js').Dish;*/

// 使用统一的模型
var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var waitermodel = require('../models/waiter.js').Waiter;

var async = require("async");

/*setTimeout(function(){
	console.log('hi');
	
},1000)*/

var updateCount = function(shop, doneCallback){
	console.log('countBefore:=='+shop.recipeCount);
	dishmodel.count({'shop':shop._id},function(err,dishCount){
		console.log('dishCount--'+dishCount);
		shopmodel.findOneAndUpdate({'_id':shop._id},
			{$set:{'recipeCount':dishCount}},
			function(err,updateResult){
				// console.log(err)
				// console.log('updateResult=='+updateResult)
				return doneCallback(null);
			})
		
	})
	
}
var asyncTask = function(shopList){
	async.eachLimit(shopList,3,updateCount,function(err,results){
		
        console.log("Finished!");
        process.exit();
    })
}

var queryshop = shopmodel.find({}).exec();
queryshop.then(function(result){
	console.log('batch');
	console.log(result.length);
	asyncTask(result);
	// process.exit();

})
.fail(function (error) {
    console.log(error);
    process.exit();
});





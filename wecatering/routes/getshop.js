var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var waitermodel = require('../models/waiter.js').Waiter;
var uuidv1 = require('uuid/v1');
var async = require("async");
var ERRORCODE = require('../errorcode');

/*
OK:'OK',//SUCCESS RESPONSE
	FAIL:'FAIL',

	DBERR:'DBERR',
	// do not use now
    DB1ERR:'DB1ERR',//mongodb err
    DB2ERR:'DB2ERR',//redis err

    IMGMODERR:'IMGMODERR',
    LIMITED:'LIMITED',
    ILLEGAL:'ILLEGAL',//unauthorized request
    // SIGNUP RESPONSE登录提示
    INUSE:'INUSE',
    // LOGIN RESPONSE注册提示
    NORECORD:'NORECORD',
 */
var queryHandle = function(req,res,adminMobile){
	// adminMobile
	// req.body.user
	var queryuser = usermodel.findOne({ 'mobile': adminMobile})
					.select('name mobile')
					.exec();

	queryuser.then(function(result){
		if(!result){
			return res.json(ERRORCODE.NORECORD)
		}
		var responseObj={};
		responseObj.user=result;

		async.parallel({
		    shop: function(callback) {
		    	var shopquery = shopmodel.find({owner:result._id}).exec();

				shopquery.then(function(shopresult){
					var time =new Date().toLocaleString();
					// console.log(shopresult);
					if(shopresult.length ==0){
						var newshop = new shopmodel({
							id: uuidv1(),
							name:'默认样本店',
							addr:'默认地址',
							opentime_start:0,
							opentime_end:0,
							//time unit is second
							// 43200/3600 = 12clock
							tables:0,
							seats:0,
							category:'快餐',
							owner:result._id
						});
						

						newshop.save(function(err,defaultshop){
							// console.log('save----------'+err);
							var newshop=[];
							if(!err){
								newshop.push(defaultshop);
							}
							responseObj.shop=newshop;
				  			// return res.json(responseObj);
				  			callback(err, newshop);
							});
					}
					else{
						responseObj.shop=shopresult;
						// return res.json(responseObj);
						callback(null, shopresult);
					}
					
				})
		        
		    },
		    waiter: function(callback) {
		    	var querywaiter = waitermodel.find({admin:result._id})
		    		.select('name')
		    		.exec();
		    	querywaiter.then(function(queryresult){
		    		callback(null, queryresult);
		    	});
		        
		    }
		}, function(err, asyncresult){
			if(err){
				console.log('getshop:'+err);
				return res.json(ERRORCODE.DBERR);
			}
		    asyncresult.user = result;
		    return res.json(asyncresult);
		});
		
		
	})
	.fail(function (error) {

	    console.log('getshop:'+error)
	    return res.json(ERRORCODE.DBERR);
	});
}
exports = module.exports = {

	post:function(req, res) {
		// console.log(redis.get(req.body.user));
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json(ERRORCODE.DBERR);
		    if (token!==req.body.token)
				return res.json(ERRORCODE.AUTHFAIL);
			if(req.body.user.length!==11){
				redis.get(req.body.user+'_admin',function(err,reply){
					// add err handle **********
					queryHandle(req,res,reply);
				})
			}
			else{
				queryHandle(req,res,req.body.user);
			}

			
		});
		
	}
}


/*
	post:function(req, res) {
		// console.log(redis.get(req.body.user));
		console.log('---------------route in getshop')
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json('dbr fail');
		    if (token!==req.body.token)
				return res.json('auth fail');
			var queryuser = usermodel.findOne({ 'mobile': req.body.user })
							.select('name mobile')
							.exec();

			queryuser.then(function(result){
				var responseObj={};
				responseObj.user=result;
				var shopquery = shopmodel.find({owner:result._id}).exec();

				shopquery.then(function(shopresult){
					var time =new Date().toLocaleString();
					// console.log(shopresult);
					if(shopresult.length ==0){
						console.log('create default shop');
						var newshop = new shopmodel({
							id: uuidv1(),
							name:'默认样本店',
							addr:'默认地址',
							opentime_start:0,
							opentime_end:0,
							//time unit is second
							// 43200/3600 = 12clock
							tables:0,
							seats:0,
							category:'快餐',
							owner:result._id
						});
						

						newshop.save(function(err,defaultshop){
							console.log('error----------'+err);
							var newshop=[];
							newshop.push(defaultshop);
							responseObj.shop=newshop;
				  			return res.json(responseObj);
							});
					}
					else{
						// var time =new Date().toLocaleString();
						// console.log('time,result----'+time+'****'+shopresult.length);
						responseObj.shop=shopresult;
						return res.json(responseObj);
					}
					
				})
			})
			.fail(function (error) {
			    console.log(error)
			    return res.json('dbm fail');
			});
		});
		
	}
 */
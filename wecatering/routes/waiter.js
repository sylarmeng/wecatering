var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var waitermodel = require('../models/waiter.js').Waiter;
var uuidv1 = require('uuid/v1');
var async = require("async");
var encrypter = require('./encrypter');

var ERRORCODE = require('../errorcode');
/*
response code
ERRORCODE.FAIL:form error ,gm error
ERRORCODE.DBERR: mongo redis error
ERRORCODE.OK: any success
ERRORCODE.ILLEGAL: unkonwn type or token expired
ERRORCODE.LIMITED: over limit
 */

exports = module.exports = {

	post:function(req, res) {
		// console.log(redis.get(req.body));
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json(ERRORCODE.DBERR);
		    if (token!==req.body.token)
				return res.json(ERRORCODE.ILLEGAL);
			
			if(req.body.data.action=='add'){
				var encrypt_pwd = encrypter.encrypt(req.body.data.password);

				var queryuser = usermodel.findOne({ 'mobile': req.body.user}).exec();
				queryuser.then(function(result){
					var querywaiter = waitermodel.find({admin:result._id})
				    		.select('name')
				    		.exec();
					querywaiter.then(function(waiterresult){
			    		// console.log('queryresult'+waiterresult.length)
			    		if(waiterresult.length<3){
			    			//结果已经获取到了，可以省略这一次查询
			    			var querywaiter = waitermodel.findOne({'name': req.body.data.name }).exec();
					    	querywaiter.then(function(queryresult){
					    		// console.log('waiter-------'+queryresult);
					    		if(queryresult ==null){
									var newwaiter = new waitermodel({
										name:req.body.data.name,
										// password:req.body.data.password,
										password:encrypt_pwd,
										createTime:new Date(),
										admin:result._id
									});
									
									newwaiter.save(function(err,newwaiterObj){
										if(err){
											console.log('waiter err:'+err);
											return res.json(ERRORCODE.DBERR);
										}
										var newObj={};
										newObj._id=newwaiterObj._id;
										newObj.name=newwaiterObj.name;
										waiterresult.push(newObj);
										return res.json(waiterresult);
									});
								}
								else{
									return res.json(ERRORCODE.INUSE);
								}
					    	});
			    		}
			    		else{
			    			return res.json(ERRORCODE.LIMITED);
			    		}
			    	})
			    	.fail(function (error) {
					    console.log('fail catch---------'+error)
					    return res.json(ERRORCODE.DBERR);
					});
					
				})
				.fail(function (error) {
				    console.log('fail catch---------'+error)
				    return res.json(ERRORCODE.DBERR);
				});
			}
			if(req.body.data.action=='del'){
				waitermodel.remove({'_id': req.body.data._id })
				.exec(function(err){
					if(err)
						return res.json(ERRORCODE.DBERR);

					var queryuser = usermodel.findOne({ 'mobile': req.body.user}).exec();
					queryuser.then(function(result){
						var querywaiter = waitermodel.find({admin:result._id})
				    		.select('name')
				    		.exec();

				    	querywaiter.then(function(queryresult){
				    		// console.log('queryresult'+queryresult.length)
				    		return res.json(queryresult);
				    	})
				    	.fail(function (error) {
						    console.log('fail catch---------'+error)
						    return res.json(ERRORCODE.DBERR);
						});

					})
					.fail(function (error) {
					    console.log('fail catch---------'+error)
					    return res.json(ERRORCODE.DBERR);
					});
					
				});
			}
		});
	}
}


				
var redis = require('../redis/redisconfig.js');
var usermodel = require('../models/user.js').User;
// var async = require("async");
var ERRORCODE = require('../errorcode');
/*
response code
ERRORCODE.FAIL:form error ,gm error
ERRORCODE.DBERR: mongo redis error
ERRORCODE.OK: any success
ERRORCODE.ILLEGAL: unkonwn type or token expired
ERRORCODE.LIMITED: over limit
 */

var queryHandle = function(req,res,adminMobile){
	queryuser = usermodel.findOne({ 'mobile': adminMobile}).exec();
	usermodel.findOneAndUpdate({ 'mobile': adminMobile},
		{$set:{
			showMode: req.body.option.showMode
		}},
		// {new: true},
		function(err, doc){
	    if(err){
	    	console.log(err);
	        return res.json(ERRORCODE.DBERR);
	    }
	    return res.json(ERRORCODE.OK);
	});
}


exports = module.exports = {
	post:function(req, res) {
		// console.log(req.body);
		// console.log(redis.get(req.body.user));
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is null
		    if(err)
		    	return res.json('dbr fail');
		    var queryuser;
		    if (token!==req.body.token)
				return res.json('auth fail');
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

/*exports = module.exports = {

	post:function(req, res) {
		// console.log(req.body);
		// console.log(redis.get(req.body.user));
		console.log('---------------route in getorder')
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is null
		    if(err)
		    	return res.json('dbr fail');
		    // console.log(token);
		    var queryuser;
		    if (token!==req.body.token)
				return res.json('auth fail');
			if(req.body.user.length!==11){
				redis.get(req.body.user+'_admin',function(err,reply){
					// add err handle 
					console.log('reply:----'+reply);

					queryuser = usermodel.findOne({ 'mobile': reply}).exec();
					queryuser.then(function(result){
						// var getCount=shopmodel.count({}).exec();get count by result.length
						// 检查用户是否存在
						// console.log(result)
						if(!result){
							console.log('no record')
							return res.json('norecord!')
						}
						// console.log('result:'+result._id);
						var shopquery = shopmodel.find({owner:result._id}).exec();
						shopquery.then(function(shopresult){
							
							// console.log(shopresult);
							if(shopresult.length ==0){
								// 故意返回空数组，客户端需要数组类型
								return res.json(shopresult);
							}
							else{
								//get today's order
								var start = new Date();
								start.setHours(0,0,0,0);
								var end = new Date();
								end.setHours(23,59,59,999);
								let checkFlag;
								if(req.body.flag=='0')
									checkFlag=false;
								else
									checkFlag=true;
								// console.log(checkFlag)
								ordercartmodel.find({shop: shopresult[0]._id,
									ordertime:{$gte: start, $lt: end},'checked':checkFlag},
									function(err,orderresult){
										//add err handle here
										let replyObj={};
										replyObj.flag = checkFlag;
										replyObj.order = orderresult;
										return res.json(replyObj);
								})
							}
						})
					})
					.fail(function (error) {
					    console.log(error)
					    return res.json('dbm fail');
					});
				})
			}
			else{
				queryuser = usermodel.findOne({ 'mobile': req.body.user }).exec();
				queryuser.then(function(result){
				// var getCount=shopmodel.count({}).exec();get count by result.length
				// 检查用户是否存在
				// console.log(result)
					if(!result){
						console.log('no record')
						return res.json('norecord!')
					}
					// console.log('result:'+result._id);
					var shopquery = shopmodel.find({owner:result._id}).exec();
					shopquery.then(function(shopresult){
						
						// console.log(shopresult);
						if(shopresult.length ==0){
							// 故意返回空数组，客户端需要数组类型
							return res.json(shopresult);
						}
						else{
							//get today's order
							var start = new Date();
							start.setHours(0,0,0,0);
							var end = new Date();
							end.setHours(23,59,59,999);
							if(req.body.flag=='0')
									checkFlag=false;
								else
									checkFlag=true;
								// console.log(checkFlag)
							ordercartmodel.find({shop: shopresult[0]._id,ordertime:{$gte: start, $lt: end},'checked':checkFlag},
								
								function(err,orderresult){
									//add err handle here
									let replyObj={};
									replyObj.flag = checkFlag;
									replyObj.order = orderresult;
									return res.json(replyObj);
							})
						}
					})
				})
				.fail(function (error) {
				    console.log(error)
				    return res.json('dbm fail');
				});
			}
			
		});
		
	}
}*/

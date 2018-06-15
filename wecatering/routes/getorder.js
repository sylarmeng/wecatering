var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;

var async = require("async");
var uuidv1 = require('uuid/v1');

var queryHandle = function(req,res,adminMobile){
	queryuser = usermodel.findOne({ 'mobile': adminMobile}).exec();
	queryuser.then(function(result){
		if(!result){
			// 检查用户是否存在
			return res.json('norecord!')
		}
		// console.log('result:'+result._id);
		var shopquery = shopmodel.find({owner:result._id}).exec();
		shopquery.then(function(shopresult){
			var checkFlag;
			if(req.body.flag=='0')
				checkFlag=false;
			else
				checkFlag=true;
			// console.log(shopresult);
			if(shopresult.length ==0){
				// 故意返回空数组，客户端需要数组类型
				var resData={
					'order': shopresult,
					'count': 0,
					'flag': checkFlag
				};
				return res.json(resData);
			}
			else{
				//get today's order
				var start = new Date();
				start.setHours(0,0,0,0);
				var end = new Date();
				end.setHours(23,59,59,999);

				async.parallel({
				    order: function(callback) {
				    		// req.body.page*20
				    		var sortOption;
				    		if(result.showMode==='downmode')
				    			sortOption = -1;
				    		else
				    			sortOption = 1;
				    		
				    		if(req.body.page!==null){
				    			ordercartmodel.find({shop: shopresult[0]._id,ordertime:{$gte: start, $lt: end},'checked':checkFlag})
									.sort({'ordertime': sortOption })//latest result be the first
									.skip(req.body.page*20)
									.limit(20)
									.exec(function(err,orderresult){
										callback(err, orderresult);
								});
				    		}
							else{
								//for android request
								if(checkFlag==false){
									ordercartmodel.find({shop: shopresult[0]._id,ordertime:{$gte: start, $lt: end},'checked':checkFlag})
										.sort({'ordertime': -1 })//latest result be the first
										
										.exec(function(err,orderresult){
											callback(err, orderresult);
									});
								}
								else{
									// sort by checkedtime
									ordercartmodel.find({shop: shopresult[0]._id,ordertime:{$gte: start, $lt: end},'checked':checkFlag})
										.sort({'checkedtime': -1 })//latest result be the first
										
										.exec(function(err,orderresult){
											callback(err, orderresult);
									});
								}
								
							}
				        	
				    	},
				    count: function(callback) {
				    		ordercartmodel.count({shop: shopresult[0]._id,ordertime:{$gte: start, $lt: end},'checked':checkFlag})
								.exec(function(err,orderLength){
									
									callback(err, orderLength);
							});
				    	}
				}, function(err, asyncresult){
					if(err){
						console.log(err)
						return res.json('dbm fail');
					}
				    asyncresult.flag = checkFlag;
				    return res.json(asyncresult);
				});


			}
		})
	})
	.fail(function (error) {
	    console.log(error)
	    return res.json('dbm fail');
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

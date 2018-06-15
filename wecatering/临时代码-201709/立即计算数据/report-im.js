var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;

var moment =require('moment');
var _ = require('lodash');

var path = require('path');
var child_process = require('child_process');



exports = module.exports = {

	post:function(req, res) {

		
		// console.log(req.body);
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json('dbr fail');
		    // console.log(token);
		    if (token!==req.body.token)
				return res.json('auth fail');

		// var queryuser = usermodel.findOne({ 'mobile': req.body.user.mobilevalue, 'password': req.body.user.pwdvalue }).exec();
			var queryuser = usermodel.findOne({ 'mobile': req.body.user }).exec();
			queryuser.then(function(result){
				// var getCount=shopmodel.count({}).exec();get count by result.length
				// console.log(result)
				// 检查用户是否登录
				if(!result){
					return res.json('norecord!')
				}
				// console.log('result:'+result._id);
				// 根据用户id查询用户店铺
				var shopquery = shopmodel.find({owner:result._id}).exec();
				shopquery.then(function(shopresult){

					// console.log(shopresult);
					// 判断店铺是否存在
					if(shopresult.length ==0){

						// 此处返回一个空数组，避免客户端出错
						return res.json('noshop');
					}
					else{

						var start = new Date();
						var today = moment().startOf('day');
						var lastday = moment(today).subtract(1, 'days');

						ordercartmodel.find(
					    	{'shop':shopresult[0]._id,
					    		ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
					    		// ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
					    	},'totalprice products.title products.title products.quantity',
						    function(err,result){
						    	if(err){
							        return res.json('dbm fail');
							    }

							    
							    
								var start = new Date();
								var p_process = child_process.fork(path.dirname(require.main.filename)+'/routes/rptAnalysis.js');
								// var p_process = child_process.fork(path.dirname(require.main.filename)+'/routes/Analysis.js');
								p_process.send(result);

								// console.log('time elapsed:----'+ (new Date() - start));

								var replyFlag = false;
								p_process.on('message',function(result){
											// console.log(result);
											console.log('time elapsed:----'+ (new Date() - start));
											if(replyFlag ==false){
												replyFlag = true;
												p_process.kill('SIGINT');
												return res.json(result);
											}
											
										});
								setTimeout(function(){
									if(replyFlag ==false){
										replyFlag = true;
										console.log('report overtime');
										return res.json('notready');
									}
								},2000);

							});
					}
				})
			})
			.fail(function (error) {
			    console.log(error)
			    return res.json('dbm fail');
			});
		});
	}
}


/*var shopquery = shopmodel.find({}).exec();
	shopquery.then(function(shopresult){

		if(shopresult.length ==0){
			console.log('result is empty');
		}
		else{

			console.log('calculate-----last day')
			var start = new Date();
			var today = moment().startOf('day');
			var lastday = moment(today).subtract(1, 'days');

			ordercartmodel.find(
		    	// {'shop':shopresult[0]._id,
		    	{'shop':messageid,
		    		ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
		    		// ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
		    	},'totalprice products.title products.title products.quantity',
			    function(err,result){
			    	if(err){
				        console.log("dbm fail");
				        return console.log(err);
				        
				    }

				});
		}
	})*/
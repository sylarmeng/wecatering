var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;
var pubsub = require('../eventhandle.js').pubsub;
var uuidv1 = require('uuid/v1');

var updateHandle = function(req,res,queryMobile){
					var updateTarget =queryMobile;
					// add err handle 
					var queryuser = usermodel.findOne({ 'mobile': queryMobile}).exec();
					queryuser.then(function(result){
					
					// 检查用户是否存在
						if(!result){
							return res.json('norecord!')
						}
						// console.log('result:'+result._id);
						// 根据用户id查询用户店铺
						var shopquery = shopmodel.find({owner:result._id}).exec();
						shopquery.then(function(shopresult){

							// 判断店铺是否存在
							if(shopresult.length ==0){
								// 此处返回一个空数组，避免客户端出错
								return res.json(shopresult);
							}
							else{
								if(req.body.change.action =='status'){
									// console.log('action status')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
								    	{'$set': {
									        'products.$.status': true
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // console.log('update ok')
										    // console.log(result)
										    // result is modified status ,not doc
										    pubsub.emit('revChange',req.body.change);
										    // pubsub.emit('orderupdate',updateTarget);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='complete'){
									// console.log('action complete')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
								    	{'$set': {
									        'products.$.complete': req.body.change.param,
									        'finishtime':new Date()
									    }},
									    function(err,result){
									    	if(err){
										        
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // console.log('update ok')
										    // pubsub.emit('orderupdate',updateTarget);
										    pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='checked'){
									// console.log('action complete')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId},
								    	{'$set': {
									        'checked': true,
									        'checkedtime':new Date()
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // 注意结算与更新的发射内容不同
										    // 结算时，所有非首页页面重新刷新
										    // 首页内容删除结算对象
										    var updateContent ={};
										    updateContent.updateTarget = updateTarget;
										    updateContent.checkedID = req.body.change.orderId;
										    pubsub.emit('orderChecked',updateContent);
										    // pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='acked'){
									// console.log('action complete')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId},
								    	{'$set': {
									        'acked': 1
									        
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='cancel'){
									// 逻辑与订单结算完全相同
									ordercartmodel.update(
								    	{'id':req.body.change.orderId},
								    	{'$set': {
									        'checked': true,
									        'checkedtime':new Date(),
									        'acked': 2
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // 注意结算与更新的发射内容不同
										    // 结算时，所有非首页页面重新刷新
										    // 首页内容删除结算对象
										    var updateContent ={};
										    updateContent.updateTarget = updateTarget;
										    updateContent.checkedID = req.body.change.orderId;
										    pubsub.emit('orderChecked',updateContent);
										    // pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
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

		// console.log(req.body.change);
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json('dbr fail');
		    if (token!==req.body.token)
				return res.json('auth fail');
			//确认是小号还是主号登录，小号需要先获取主号id，
			if(req.body.user.length!==11){
				redis.get(req.body.user+'_admin',function(err,reply){
					updateHandle(req,res,reply);
				});
			}
			else{
				updateHandle(req,res,req.body.user);
			}
			
		});
	}
}
/*exports = module.exports = {

	post:function(req, res) {

		// console.log(req.body.change);
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json('dbr fail');
		    // console.log(token);
		    if (token!==req.body.token)
				return res.json('auth fail');
			//确认是小号还是主号登录，小号需要先获取主号id，
			//查询代码完全相同，可以抽象成一个函数
			if(req.body.user.length!==11){
				redis.get(req.body.user+'_admin',function(err,reply){

					var updateTarget =reply;
					// add err handle 
					var queryuser = usermodel.findOne({ 'mobile': reply}).exec();
					queryuser.then(function(result){
					
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
								return res.json(shopresult);
							}
							else{
								if(req.body.change.action =='status'){
									// console.log('action status')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
								    	{'$set': {
									        'products.$.status': true
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // console.log('update ok')
										    // console.log(result)
										    // result is modified status ,not doc
										    pubsub.emit('revChange',req.body.change);
										    // pubsub.emit('orderupdate',updateTarget);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='complete'){
									// console.log('action complete')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
								    	{'$set': {
									        'products.$.complete': req.body.change.param,
									        'finishtime':new Date()
									    }},
									    function(err,result){
									    	if(err){
										        
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // console.log('update ok')
										    // pubsub.emit('orderupdate',updateTarget);
										    pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
								if(req.body.change.action =='checked'){
									// console.log('action complete')
									ordercartmodel.update(
								    	{'id':req.body.change.orderId},
								    	{'$set': {
									        'checked': true,
									        'checkedtime':new Date()
									    }},
									    function(err,result){
									    	if(err){
										        console.log(err)
										        return res.json("dbm fail");
										    }
										    // console.log('update ok')
										    pubsub.emit('orderChecked',updateTarget);
										   
										    // pubsub.emit('revChange',req.body.change);
										    return res.json('orderupdate');
									});
								}
							}
							})
					})
					.fail(function (error) {
					    console.log(error)
					    return res.json('dbm fail');
					});
				});
			}
			else{
				var updateTarget = req.body.user;
				var queryuser = usermodel.findOne({ 'mobile': req.body.user }).exec();
				queryuser.then(function(result){
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
							return res.json(shopresult);
						}
						else{
							if(req.body.change.action =='status'){
								// console.log('action status')
								// ordercartmodel.findOneAndUpdate(
								ordercartmodel.update(
							    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
							    	{'$set': {
								        'products.$.status': true
								    }},
								    {'new':true},
								    function(err,result){
								    	if(err){
									        console.log(err)
									        return res.json("dbm fail");
									    }
									    // update result is modified status ,not doc
									    // findOneAndUpdate result is nwew doc
									    // console.log(result);
									    // pubsub.emit('orderupdate',updateTarget);
									    pubsub.emit('revChange',req.body.change);
									    return res.json('orderupdate');
								});
							}
							if(req.body.change.action =='complete'){
								// console.log('action complete')
								ordercartmodel.update(
							    	{'id':req.body.change.orderId,'products.item':req.body.change.itemId},
							    	{'$set': {
								        'products.$.complete': req.body.change.param,
								        'finishtime':new Date()
								    }},
								    function(err,result){
								    	if(err){
									        console.log(err)
									        return res.json("dbm fail");
									    }
									    // console.log('update ok')
									    // pubsub.emit('orderupdate',updateTarget);
									    pubsub.emit('revChange',req.body.change);
									    return res.json('orderupdate');
								});
							}
							if(req.body.change.action =='checked'){
								// console.log('action complete')
								ordercartmodel.update(
							    	{'id':req.body.change.orderId},
							    	{'$set': {
								        'checked': true,
								        'checkedtime':new Date()
								    }},
								    function(err,result){
								    	if(err){
									        console.log(err)
									        return res.json("dbm fail");
									    }

									    // console.log('update ok')
									    pubsub.emit('orderChecked',updateTarget);
									    // pubsub.emit('revChange',req.body.change);
									    return res.json('orderupdate');
								});
							}
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

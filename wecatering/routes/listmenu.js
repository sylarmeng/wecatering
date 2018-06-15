
var pubsub = require('../eventhandle.js').pubsub;

var dishmodel = require('../models/dish.js').Dish;
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;
var _ = require('lodash');
var uuidv1 = require('uuid/v1');

exports = module.exports = {
	get:function(req, res) {
			// console.log(req.params);
			var start = new Date();
			usermodel.findOne({mobile: req.params.id},function(err,user){
				// console.log(user);
				if(err){
					console.log(err);
					return res.json("error!");
				}
				if(user ==null){
					return res.redirect('/');
				}
				else{
					shopmodel.findOne({owner: user._id},function(err,shop){
						// console.log(shop);
						if(err){
								console.log(err);
								return res.json("error!");
							}
						if(shop){
							// console.log(shop._id)
							

							var queryDish = dishmodel.find({shop: shop._id});
							queryDish.select('title price category discount sampleImage fullImage');
							queryDish.sort({ category: -1});
							queryDish.exec(function(err,menulist){
								var end = new Date() - start;
					 			// console.info("Execution time: %dms", end);
								if(err){
									console.log(err);
									return res.json("error!");
								}
								else{
									// console.log(menulist)
									// console.log('get meunulist ok')
									/*var cateCount  = _(menulist)
									  .groupBy('category')
									  .map(function(item, itemId) {
									    console.log('itemId-----'+itemId)
									    obj[itemId] = _.countBy(item, 'category')
									    return obj
									  }).value();*/
							// 按照类别对菜单进行分类
									var cateCount = _.countBy(menulist,'category');
									// var index =0;
									// console.log('time elapsed:----'+ (new Date() - start));
									var i = 0, key;
									var cateIndex=[]
								    for (key in cateCount) {
								    	if(i==0){
								    		cateIndex[i]=cateCount[key];
								    		cateCount[key] = 0;
								    	}
								    	else{
								    		cateIndex[i]=cateCount[key]+cateIndex[i-1];
								        	cateCount[key]=cateIndex[i-1];
								    	}
								    	i++;
								    }
								    // console.log('time elapsed:----'+ (new Date() - start));
								    // console.log(cateIndex);
								  	// console.log(cateCount);
								  	cateIndex =null;
									var menuResult={};
									menuResult.menulist = menulist;
									menuResult.shop_id = shop._id;
									menuResult.cateCount = cateCount;
									return res.json(menuResult);
								}
							});
							/*dishmodel.find({shop: shop._id},
								'title price category discount',
								function(err,menulist){
								var end = new Date() - start;
					 			console.info("Execution time: %dms", end);
								if(err){
									console.log(err);
									return res.json("error!");
								}
								else{
									// console.log(menulist)
									console.log('get meunulist ok')
									var menuResult={};
									menuResult.menulist = menulist;
									menuResult.shop_id = shop._id;
									return res.json(menuResult);
								}
							})*/
						}
						else{
							return res.json("noshop!");
						}
						
					});
				}
			});

/*
//populate耗时要长一些
			dishmodel.find()
			.populate('shop')
			.populate({
			    path: 'owner',
			    match: { mobile: req.params.id},
			    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
			    select: 'mobile _id'
			    // ,options: { limit: 5 }
			  })
			.exec(function(err,doc){
				var end = new Date() - start;
				 console.info("Execution time: %dms", end);
				console.log(err)
				// console.log(doc)
				res.json('not ready')
			});*/
		},

	post:function(req, res) {

			// console.log(req.body.order);
			// 暂时在服务端生成订单id，以后完全去掉uuid，使用系统id
			req.body.order.id = uuidv1();
			// console.log(req.body.order);
			var neworder = new ordercartmodel(req.body.order);

			neworder.save(function(err,result){
				if(err){
					console.log(err);
					res.json('order fail');
				}
				else{
					// console.log(result);
					pubsub.emit('serverorderinfo',req.body);
					return res.json("order ok!");
				}
			})
	}
}


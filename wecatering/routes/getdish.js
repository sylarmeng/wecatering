
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var redis = require('../redis/redisconfig.js');
var uuidv1 = require('uuid/v1');
var _ = require('lodash');

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
	var queryuser = usermodel.findOne({ 'mobile': adminMobile}).exec();
	queryuser.then(function(result){

		if(result){

			dishmodel.find({'owner' : result._id})
			.select('id shop title price category discount sampleImage fullImage')
			.sort({'_id':-1})
			.exec(function(err, data){
			    if(err){
			    	console.log(err);
			        return res.json(ERRORCODE.DBERR);
			    }
			    // console.log('update ok')
			    if(!req.body.action)
			    	return res.json(data);
			    else{
			    	// var cateCount = _.countBy(data,'category');
			    	// console.log(cateCount);
			    	var recipeSort = _.groupBy(data,'category');
			    	return res.json(recipeSort);
			    }
			});
		}
		else{
		    return res.json(ERRORCODE.DBERR);
		}

	})
	.fail(function (error) {
	    console.log(error)
	    return res.json(ERRORCODE.DBERR);
	});
}

exports = module.exports = {

	post:function(req, res) {
		// console.log('get req-----------')
		// console.log(req.body)
		redis.get(req.body.user, function(err, token){
			if(err)
		    	return res.json(ERRORCODE.DBERR);
		    // console.log(token);
		    if (token!==req.body.token)
				return res.json(ERRORCODE.ILLEGAL);
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
var perPage = 10,
					page = Math.max(0, (req.query.page||1));

			var getCount=dishmodel.Dish.count({}).exec();

			getCount.then(function(count){

					var query = dishmodel.Dish.find().sort({updateTime: -1});
					// var query = dishmodel.Dish.find({},'-_id').sort({updateTime: -1});
					// way more clear: select({ "name": 1, "_id": 0})
					query.select('id title price -_id');
					query.limit(perPage).skip(perPage * (page-1)).exec(function(err , result){
						if(err){
								console.log(err);
								return res.json("error!");
								}
						if(result!==null){
							// console.log(result);
							return res.json(result);
						}
						else{
							return res.json("no record");
						}
					});
				});*/

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var redis = require('../redis/redisconfig.js');

var path = require('path');
var fs = require('fs');
var settings = require('../settings');
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
		redis.get(req.body.user, function(err, token){
			if(err)
			{
		    	console.log(err);
		    	return res.json(ERRORCODE.DBERR);

			}
		    if (token!==req.body.token)
				return res.json(ERRORCODE.ILLEGAL);
			var queryuser = usermodel.findOne({ 'mobile': req.body.user}).exec();
			queryuser.then(function(result){
				if(result){
					dishmodel.findOne({'id' : req.body.data.dishid})
					.exec(function(err,doc){
						if(err){
					    	console.log(err);
					        return res.json(ERRORCODE.DBERR);
					    }
					    if(doc.sampleImage){
					    	var baseDir =settings.PROJECT_DIR;
					    	fs.unlink(baseDir+'/public/static/img/'+doc.sampleImage, function(error) {
							    if (error) {
							        // throw error;
							        console.log(error)
							    }
							    // console.log('Deleted');
							});
					    }
					    if(doc.fullImage){
					    	var baseDir =settings.PROJECT_DIR;
					    	fs.unlink(baseDir+'/public/static/img/'+doc.fullImage, function(error) {
							    if (error) {
							        // throw error;
							        console.log(error)
							    }
							    // console.log('Deleted');
							});
					    }
						dishmodel.remove({'id' : req.body.data.dishid})
						.exec(function(err){
						    if(err){
						    	console.log(err);
						        return res.json(ERRORCODE.DBERR);
						    }
						    shopmodel.update({'_id' : req.body.data.shop_id},
							    	{$inc : {recipeCount:-1}},
						    		function(err, doc){
								    if(err){
								    	console.log(err);
								    }
								});
						    return res.json(ERRORCODE.OK);
						});
					})
					
				}
				else{
				    return res.json(ERRORCODE.FAIL);
				}

			})
			.fail(function (error) {
			    console.log(error)
			    return res.json(ERRORCODE.FAIL);
			});
		});

	}
}

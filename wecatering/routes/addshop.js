
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var uuidv1 = require('uuid/v1');
var redis = require('../redis/redisconfig.js');
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
	get:function(req, res) {

		return res.json(ERRORCODE.FAIL);
		},

	post:function(req, res) {
		// console.log(req.body)
		redis.get(req.body.user, function(err, token){
			if(err)
			{
		    	console.log(err);
		    	return res.json(ERRORCODE.DBERR);

			}
		    if (token!==req.body.token)
				return res.json(ERRORCODE.ILLEGAL);

			var queryuser = usermodel.findOne({'mobile': req.body.user}).exec();
			queryuser.then(function(result){
				if(req.body.data.id){
					// console.log('update')
					shopmodel.findOneAndUpdate({'id' : req.body.data.id},
			    		{$set:{
			    			name:req.body.data.title,
							addr:req.body.data.addr,
							opentime_start:req.body.data.opentime_start,
							opentime_end:req.body.data.opentime_end,
							//time unit is second
							// 43200/3600 = 12clock
							tables:req.body.data.tables,
							seats:req.body.data.seats,
							category:req.body.data.category,
			    		}},
			    		// {new: true},
			    		function(err, doc){
					    if(err){
					        console.log(err);
					        return res.json(ERRORCODE.DBERR);
					    }
					    // console.log("不更新图片");
					    return res.json(ERRORCODE.OK);
					});
				}
				else{
				var newshop = new shopmodel({
					id: uuidv1(),
					name:req.body.data.title,
					addr:req.body.data.addr,
					opentime_start:req.body.data.opentime_start,
					opentime_end:req.body.data.opentime_end,
					//time unit is second
					// 43200/3600 = 12clock
					tables:req.body.data.tables,
					seats:req.body.data.seats,
					category:req.body.data.category,
					owner:result._id
					});
				newshop.save(function(err,newshop){
					console.log(err);
		  			return res.json(ERRORCODE.OK);
					});
				}

			})
			.fail(function (error) {
			    console.log(error)
			    return res.json(ERRORCODE.DBERR);
			});
		});

	}
}


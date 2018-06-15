var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;
var ERRORCODE = require('../errorcode');
var moment =require('moment');

exports = module.exports = {
	post:function(req, res) {
		var today = moment().startOf('day');
    	// var lastday = moment(today).subtract(1, 'days');
    	// typeof(req.body.custom)=="undefined"
    	// req.body.custom==="undefined"
    	/*if(req.body.custom===''||typeof(req.body.custom)==="undefined"){
    		var emptyArray =[];
    		return res.json(emptyArray);
    	}*/

		var newquery = ordercartmodel.find({
			'custom':req.body.custom,
			'shop':req.body.shop_id,
			'ordertime':{$gte: today.toDate()}
			})
			.exec(function(err,result){
				// console.log(result);
				if(err)
					return res.json(ERRORCODE.DBERR);
				else
					// console.log(result.length);
					return res.json(result);
			})
	}
}

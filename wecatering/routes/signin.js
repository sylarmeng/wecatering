
// var usermodel = require('../models/user.js');
// 使用下面形式缩短表达式
var usermodel = require('../models/user.js').User;
var waitermodel = require('../models/waiter.js').Waiter;
var redis = require('../redis/redisconfig.js');
var hat = require('hat');
var async = require('async');
var encrypter = require('./encrypter');
var ERRORCODE = require('../errorcode');
	/*OK:'OK',//SUCCESS RESPONSE
	FAIL:'FAIL',
	DBERR:'DBERR',
	// do not use now
    DB1ERR:'DB1ERR',//mongodb err
    DB2ERR:'DB2ERR',//redis err

    IMGMODERR:'IMGMODERR',
    LIMITED:'LIMITED',

    ILLEGAL:'ILLEGAL'//unauthorized request
    INUSE:'INUSE',
    NORECORD:'NORECORD',
    */
exports = module.exports = {
/*	get:function(req, res) {
		res.render('signup', { title: 'Deeperviewer' });
	},*/
	post:function(req, res) {
		if(req.body.mobilevalue.length>5&&req.body.mobilevalue.length<9){
			var encrypt_pwd = encrypter.encrypt(req.body.pwdvalue);
			async.waterfall([
			    function(callback) {
			    	waitermodel.findOne({ 'name': req.body.mobilevalue, 'password': encrypt_pwd },function(err,waiter){
						callback(err, waiter);	
					});
			        
			    },
			    function(waiter, callback) {
			    	if(waiter==null){
			    		callback(null, null);
			    	}
			    	else{
			    		// console.log('waiter:---------'+waiter);
				        usermodel.findOne({ '_id': waiter.admin},'mobile',function(err,user){
				        	var result ={};
				        	result.waiter=waiter;
				        	result.user =user.mobile;
				        	// store waiter's admin in redis,simplify logic of db query
				        	redis.set(req.body.mobilevalue+'_admin',user.mobile);
							callback(err, result);	
						});
			    	}
			    	
			    }
			], function (err, result) {

			    if(err){
					//err handle
					console.log(err);
					return res.json(ERRORCODE.DBERR);
				}
				if(result !==null){
					var id = hat(64, 16);
					// var id = hat.rack(bits=128, base=16)();
					// console.log(id);
					redis.set(req.body.mobilevalue,id,'EX',  60 * 60 * 12);
			    	return res.json({'token':id,'cat':'2'});
			    }
			    // user do not exist or password wrong
			    return res.json(ERRORCODE.NORECORD);
			});

			
		}
		else if(req.body.mobilevalue.length==11){
			var encrypt_pwd = encrypter.encrypt(req.body.pwdvalue);
			usermodel.findOne({ 'mobile': req.body.mobilevalue, 'password': encrypt_pwd },function(err,user){
				if(err){
					//err handle
					console.log('mdbfail'+err);
					return res.json(ERRORCODE.DBERR);
				}
				if(user !==null){
					

					var id = hat(64, 16);
					// var id = hat.rack(bits=128, base=16)();
					// console.log(id);
					redis.set(req.body.mobilevalue,id,'EX',  60 * 60 * 12);
			    	return res.json({'token':id,'cat':'1'});
			    }
			    // user do not exist or password wrong
			    return res.json(ERRORCODE.NORECORD);
			});
		}
		else{
			return res.json(ERRORCODE.NORECORD);
		}
		
	}
}

//type1--vendor
//type2--waiter
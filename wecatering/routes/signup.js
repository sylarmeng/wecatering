
// var usermodel = require('../models/user.js');
// 使用下面形式缩短表达式
var usermodel = require('../models/user.js').User;
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
    */

exports = module.exports = {
	get:function(req, res) {
		res.render('signup', { title: 'Deeperviewer' });
	},
	post:function(req, res) {

	    if(req.body.datatype=="mobile"){
	    	usermodel.findOne({ 'mobile': req.body.text },function(err,user){
				if(err){
					console.log(err);
					return res.json(ERRORCODE.DBERR);
				}
				else if(user !==null){
			    	return res.send({ success: true,data: 1}); 	
			    }
			    else{
			    	return res.send({ success: true,data: 0});
			    }
			});
	    }

	    else if(req.body.password&&req.body.mobile.match(/^1(3|4|5|7|8)\d{9}$/)){
	    	usermodel.findOne({'mobile': req.body.mobile},function(err,result){
				if(err){
					//err handle
					console.log(err)
					return res.json(ERRORCODE.DBERR);
				}
				if(result !==null){
					//malicious signup
					return res.json(ERRORCODE.INUSE);
				}
				var encryt_pwd = encrypter.encrypt(req.body.password);
				var newUser = new usermodel({
					// password:req.body.password,
					password:encryt_pwd,
					mobile:req.body.mobile
					});
				newUser.save(function(err,result){
					if(err){
						//err handle
						console.log(err);
						return res.json(ERRORCODE.DBERR);
					}
					else
		  				return res.json(ERRORCODE.OK);
					});
			});
	    }
	    else{
	    	// return;
	    	return res.json(ERRORCODE.ILLEGAL);
	    }
	}
}

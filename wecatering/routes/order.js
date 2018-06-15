// var index = require('../public/index.html');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var path = require('path');
var async = require("async");
var request = require("request");

exports = module.exports = {
	get:function(req, res) {
			// console.log(path.dirname(require.main.filename))
			// console.log(req.params.id)
			var wechat_code = req.query.code;
			// if(typeof(req.query.code)=="undefined"){
			// 	return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/client-err.html'));

			// }
			// var wechat_state = req.query.state;
			// https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd92a93496e7bd088&secret=3f76079b72be7eaaeeb26b4e1341fee2&code=061hN7dW0Vaj2X1cDObW0YAodW0hN7d0&grant_type=authorization_code
			var req_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd92a93496e7bd088&secret=3f76079b72be7eaaeeb26b4e1341fee2&code="+wechat_code
							+"&grant_type=authorization_code";
			
			request(req_url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    // console.log(body);
			    // var chatid = body.openid;
			    //res.set('chatid', body.openid);
			    var bodyJson = JSON.parse(body);
			    res.cookie('chatid', bodyJson.openid);
			    return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/client.html'));
			  }
			})
		}
}

/*
//内网测试
	get:function(req, res) {
			usermodel.findOne({mobile: req.params.id},function(err,user){
				if(user ==null){
					return res.redirect('/');
				}
				else{
					shopmodel.findOne({owner: user._id},function(err,shop){
						res.cookie('chatid', '33');
						return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/client.html'));
					});
				}
			});
		}
 */

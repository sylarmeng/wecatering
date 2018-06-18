// var index = require('../public/index.html');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var path = require('path');
var async = require("async");
var request = require("request");

exports = module.exports = {
	get:function(req, res) {

			return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/client-err.html'));

// !要应用微信服务号，启用下面代码，使用自己的appid和secret
			/*var wechat_code = req.query.code;
			var req_url = "https://api.weixin.qq.com/sns/oauth2/access_token?"
							+"appid="+"your appid"
							+"&secret="+"your secret"
							+"&code="
							+wechat_code
							+"&grant_type=authorization_code";
			request(req_url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var bodyJson = JSON.parse(body);
			    res.cookie('chatid', bodyJson.openid);
			    return res.sendFile(path.join(path.dirname(require.main.filename)+'/public/static/client.html'));
			  }
			})*/
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

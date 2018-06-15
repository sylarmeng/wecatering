var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
// 昨日数据，名称暂时不改
var shopdatamodel = require('../models/rptday.js').ShopData;
// 上周数据
var rptWeekmodel = require('../models/rptweek.js').RptWeek;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;

var moment =require('moment');
var _ = require('lodash');

var path = require('path');
var child_process = require('child_process');

var ERRORCODE = require('../errorcode');
/*
response code
ERRORCODE.FAIL:form error ,gm error
ERRORCODE.DBERR: mongo redis error
ERRORCODE.OK: any success
ERRORCODE.ILLEGAL: unkonwn type or token expired
ERRORCODE.LIMITED: over limit
 */
var queryRpt = function(res,option,shopid){
	if(option ==='ld'){
		var shopDataQuery = shopdatamodel.findOne({shop:shopid});
		shopDataQuery.sort({'calcTime':-1});
		shopDataQuery.exec(function(error,dataResult){
			if(error)
				return res.json(ERRORCODE.DBERR);
			if(!dataResult)
				return res.json(ERRORCODE.NORECORD);
			else{
				let resData ={};
				resData.dishsale_sort = dataResult.dishCompare;
				resData.dishSaleCount = dataResult.dishSaleCount;
				resData.bill_count = dataResult.orderPrice.bill_count;
				resData.bill_value = dataResult.orderPrice.bill_value;
				resData.income = dataResult.totalLast;
				resData.count = dataResult.orderCount;
				resData.timeSect = dataResult.timeSect;

				resData.dishSalePrice = dataResult.dishSalePrice;
				resData.saleCount_byCate = dataResult.saleCount_byCate;
				resData.salePrice_byCate = dataResult.salePrice_byCate;
				// resData.dailyIncomeResult = dataResult.dailyIncomeResult;

				return res.json(resData);
			}
		});
	}
	// else if(option ==='lw')
	else{
		var shopDataQuery = rptWeekmodel.findOne({shop:shopid});
		shopDataQuery.sort({'calcTime':-1});
		shopDataQuery.exec(function(error,dataResult){
			if(error)
				return res.json(ERRORCODE.DBERR);
			if(!dataResult)
				return res.json(ERRORCODE.NORECORD);
			else{
				let resData = {};
				resData.dishsale_sort = dataResult.dishCompare;
				resData.dishSaleCount = dataResult.dishSaleCount;
				resData.bill_count = dataResult.orderPrice.bill_count;
				resData.bill_value = dataResult.orderPrice.bill_value;
				resData.income = dataResult.totalLast;
				resData.count = dataResult.orderCount;
				resData.timeSect = dataResult.timeSect;
				resData.dishSalePrice = dataResult.dishSalePrice;
				resData.saleCount_byCate = dataResult.saleCount_byCate;
				resData.salePrice_byCate = dataResult.salePrice_byCate;
				resData.dailyIncomeResult = dataResult.dailyIncomeResult;
				return res.json(resData);
			}
		});
	}
};

exports = module.exports = {
	post:function(req, res) {
		// console.log(req.body);
		redis.get(req.body.user, function(err, token) {
		    // reply is null when the key is missing
		    if(err)
		    	return res.json(ERRORCODE.DBERR);
		    // console.log(token);
		    if (token!==req.body.token)
				return res.json(ERRORCODE.ILLEGAL);

		// var queryuser = usermodel.findOne({ 'mobile': req.body.user.mobilevalue, 'password': req.body.user.pwdvalue }).exec();
			var queryuser = usermodel.findOne({ 'mobile': req.body.user }).exec();
			queryuser.then(function(result){
				// var getCount=shopmodel.count({}).exec();get count by result.length
				// console.log(result)
				// 检查用户是否登录
				if(!result){
					return res.json(ERRORCODE.NORECORD);
				}
				// console.log('result:'+result._id);
				// 根据用户id查询用户店铺
				var shopquery = shopmodel.findOne({owner:result._id}).exec();
				shopquery.then(function(shopresult){
					// 判断店铺是否存在
					if(shopresult.length ==0){
						return res.json(ERRORCODE.NORECORD);
					}
					else{
						queryRpt(res,req.body.option,shopresult._id);
						// 下面是只查昨日数据的模块
						/*var shopDataQuery = shopdatamodel.findOne({shop:shopresult._id});
						shopDataQuery.sort({'calcTime':-1});
						shopDataQuery.exec(function(error,dataResult){
							if(error)
								return res.json(ERRORCODE.DBERR);
							if(!dataResult)
								return res.json(ERRORCODE.NORECORD);
							else{
								let resData ={};
								resData.dishsale_sort = dataResult.dishCompare;
								resData.dishSaleCount = dataResult.dishSaleCount;
								resData.bill_count = dataResult.orderPrice.bill_count;
								resData.bill_value = dataResult.orderPrice.bill_value;
								resData.income = dataResult.totalLast;
								resData.count = dataResult.orderCount;
								resData.timeSect = dataResult.timeSect;
								return res.json(resData);
							}
						});*/
					}
				})
				.fail(function (error) {
				    console.log(error)
				    return res.json(ERRORCODE.DBERR);
				});
			})
			.fail(function (error) {
			    console.log(error)
			    return res.json(ERRORCODE.DBERR);
			});
		});
	}
}

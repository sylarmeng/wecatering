// var Mongoose = require('./model/mongooseConn.js');
// var db =Mongoose();

// var shopmodel = require('./model/shop.js').Shop;
// var usermodel = require('./model/user.js').User;
// var ordercartmodel = require('./model/ordercart.js').OrderCart;
// var shopdatamodel = require('./model/shopdata.js').ShopData;
var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;
var shopdatamodel = require('../models/rptday.js').ShopData;

var sortKeysByValue = require('sort-keys-by-value');
var moment =require('moment');
var _ = require('lodash');
var Q = require('q');

// 数据处理类Analysis-Func
function AnalysisFunc (){
    this.shopId = null;
    this.income= 0;
    this.count= 0;
    this.billData =null;
    this.dishData =null;
    this.timeSecData =null;
    this.dishSaleCount =0;
}
// 函数列表
// totalLast
// orderPrice
// dishCompare
// timeSect
// 昨日总收入，传入总订单
AnalysisFunc.prototype.totalLast = function(result) {
	var incomeResult =result.reduce(function(total,item){
			    	return total = total+item.totalprice;
			    },0);
    this.income = incomeResult;
	return incomeResult;
};
AnalysisFunc.prototype.getCount = function(result) {
    
    this.count = result.length;
    return result.length;
};
// 昨日订单价格排序分布
AnalysisFunc.prototype.orderPrice = function(result) {
	 
	// last day order price sort
	var bill_list=[];
    result.map(function(item,index){
    	bill_list.push(item.totalprice);
    });
    var bill_sort = _.sortBy(bill_list);
    // 对订单价格排序
    var bill_value=[0];
    var bill_count=[0];

    for(var i =0,j =0,bill_length = bill_sort.length;i<bill_length;i++){
    	if(i==0){
    		bill_value[j]=bill_sort[i];
    		bill_count[j]=1;
    	}
    	else{
    		if (bill_sort[i]==bill_value[j]){
    			bill_count[j]=bill_count[j]+1;
    		}
    		else{
    			j++;
    			bill_count[j]=1;
    			bill_value[j]=bill_sort[i];
    		}
    	}
    }
    // console.log(bill_value)
    // console.log(bill_count)
    var orderPriceData ={};
	orderPriceData.bill_count = bill_count;
	orderPriceData.bill_value = bill_value;
    this.billData =orderPriceData;
	return orderPriceData;
};

AnalysisFunc.prototype.dishCompare = function(result) {
	var dishsalerpt={};
    var count =0;
    result.map(function(dish,index){
    	dish.products.map(function(item,index){
    		if(item.title in dishsalerpt){
    			dishsalerpt[item.title] = dishsalerpt[item.title] +1;
    		}
    		else{
    			dishsalerpt[item.title]  =1;
                count++;
    		}
    	});
    });
    // var dishsale_sort = sortKeysByValue(dishsalerpt,{ reverse: true });
    var dishsale_sort = sortKeysByValue(dishsalerpt);
    this.dishData =dishsale_sort;
        this.dishSaleCount = count;
    return dishsale_sort;
};
AnalysisFunc.prototype.timeSect = function(result,option) {
    // 需要性能优化时，将下面改写为直接使用Date的差值比较
    // 分时段的订单数，以下单时间为准
    // 分时段的营业额
    // 
    var start = new Date();
    var today = moment().startOf('day');
    var lastday = moment(today).subtract(1, 'days');
    var SECT0 = moment(lastday).toDate();
    var SECT1 = moment(lastday).add(1, 'hours').toDate();
    var SECT2 = moment(lastday).add(2, 'hours').toDate();
    var SECT3 = moment(lastday).add(3, 'hours').toDate();
    var SECT4 = moment(lastday).add(4, 'hours').toDate();
    var SECT5 = moment(lastday).add(5, 'hours').toDate();
    var SECT6 = moment(lastday).add(6, 'hours').toDate();
    var SECT7 = moment(lastday).add(7, 'hours').toDate();
    var SECT8 = moment(lastday).add(8, 'hours').toDate();
    var SECT9 = moment(lastday).add(9, 'hours').toDate();
    var SECT10 = moment(lastday).add(10, 'hours').toDate();
    var SECT11 = moment(lastday).add(11, 'hours').toDate();
    var SECT12 = moment(lastday).add(12, 'hours').toDate();
    var SECT13 = moment(lastday).add(13, 'hours').toDate();
    var SECT14 = moment(lastday).add(14, 'hours').toDate();
    var SECT15 = moment(lastday).add(15, 'hours').toDate();
    var SECT16 = moment(lastday).add(16, 'hours').toDate();
    var SECT17 = moment(lastday).add(17, 'hours').toDate();
    var SECT18 = moment(lastday).add(18, 'hours').toDate();
    var SECT19 = moment(lastday).add(19, 'hours').toDate();
    var SECT20 = moment(lastday).add(20, 'hours').toDate();
    var SECT21 = moment(lastday).add(21, 'hours').toDate();
    var SECT22 = moment(lastday).add(22, 'hours').toDate();
    var SECT23 = moment(lastday).add(23, 'hours').toDate();

    var countByTime =[];
    for(var i=0;i<24;i++){
        countByTime[i]=0;
    }
    result.map(function(dish,index){
            var Torder=moment(dish.ordertime);  
            if(Torder.isBetween(SECT0, SECT1,null, '[)'))
                countByTime[0] += 1;
            else if(Torder.isBetween(SECT1, SECT2,null, '[)'))
                countByTime[1] += 1;
            else if(Torder.isBetween(SECT2, SECT3,null, '[)'))
                countByTime[2] += 1;
            else if(Torder.isBetween(SECT3, SECT4,null, '[)'))
                countByTime[3] += 1;
            else if(Torder.isBetween(SECT4, SECT5,null, '[)'))
                countByTime[4] += 1;
            else if(Torder.isBetween(SECT5, SECT6,null, '[)'))
                countByTime[5] += 1;
            else if(Torder.isBetween(SECT6, SECT7,null, '[)'))
                countByTime[6] += 1;
            else if(Torder.isBetween(SECT7, SECT8,null, '[)'))
                countByTime[7] += 1;
            else if(Torder.isBetween(SECT8, SECT9,null, '[)'))
                countByTime[8] += 1;
            else if(Torder.isBetween(SECT9, SECT10,null, '[)'))
                countByTime[9] += 1;
            else if(Torder.isBetween(SECT10, SECT11,null, '[)'))
                countByTime[10] += 1;
            else if(Torder.isBetween(SECT11, SECT12,null, '[)'))
                countByTime[11] += 1;
            else if(Torder.isBetween(SECT12, SECT13,null, '[)'))
                countByTime[12] += 1;
            else if(Torder.isBetween(SECT13, SECT14,null, '[)'))
                countByTime[13] += 1;
            else if(Torder.isBetween(SECT14, SECT15,null, '[)'))
                countByTime[14] += 1;
            else if(Torder.isBetween(SECT15, SECT16,null, '[)'))
                countByTime[15] += 1;
            else if(Torder.isBetween(SECT16, SECT17,null, '[)'))
                countByTime[16] += 1;
            else if(Torder.isBetween(SECT17, SECT18,null, '[)'))
                countByTime[17] += 1;
            else if(Torder.isBetween(SECT18, SECT19,null, '[)'))
                countByTime[18] += 1;
            else if(Torder.isBetween(SECT19, SECT20,null, '[)'))
                countByTime[19] += 1;
            else if(Torder.isBetween(SECT20, SECT21,null, '[)'))
                countByTime[20] += 1;
            else if(Torder.isBetween(SECT21, SECT22,null, '[)'))
                countByTime[21] += 1;
            else if(Torder.isBetween(SECT22, SECT23,null, '[)'))
                countByTime[22] += 1;
            else
                countByTime[23] += 1;
            
    });
    // console.log(countByTime);
    this.timeSecData =countByTime;
};
AnalysisFunc.prototype.stayTime = function(option) {
    // 用餐时间统计
    // 
    
};

/*process.on('message',function(result){
	var procFunc =new AnalysisFunc();
	var orderPrice = procFunc.orderPrice(result);
	var dishCompare = procFunc.dishCompare(result);

	var salereport ={};
	salereport.dishsale_sort = dishCompare;

	salereport.bill_count = orderPrice.bill_count;
	salereport.bill_value = orderPrice.bill_value;

	salereport.income = procFunc.totalLast(result);

	salereport.count = result.length;
	process.send(salereport);
});*/

// function QueryData(){}


var userId = 15606181258;
var queryuser = usermodel.findOne({ 'mobile': userId }).exec();

var getUserId = function(userId) {

    var deferred = Q.defer();
    usermodel.findOne({ 'mobile': userId }, function(error, userResult){

        if (error) {
            deferred.reject(new Error(error));
        }
        else {
            deferred.resolve(userResult);
        }
    });
    return deferred.promise;
}
var getShopId = function(userResult) {

    var deferred = Q.defer();
    // console.log(userResult._id)
    // shopmodel.findOne({owner:userResult._id}, function(error, shopResult){
    shopmodel.find({owner:userResult._id}, function(error, shopResult){
        if (error) {
            deferred.reject(new Error(error));
        }
        else {
            deferred.resolve(shopResult);
        }
    });
    return deferred.promise;
}

var getOrder = function(shopresult) {

    var today = moment().startOf('day');
    var lastday = moment(today).subtract(1, 'days');
    var deferred = Q.defer();
    ordercartmodel.find(
        {
            'shop':shopresult[0]._id,
            // 'shop':shopresult._id,
            ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
            // ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
        },'totalprice products.title products.price products.quantity ordertime',
        function(error,result){
            if (error) {
                deferred.reject(new Error(error));
            }
            else {
                deferred.resolve(result);
            }
        });
    return deferred.promise;
}

var getOrderByTime = function(shopresult,option) {
    // 0，营业时段按小时划分
    // 1，营业时段按半小时划分
    // 2，只显示中午三小时
    // 3，只显示下午三小时
    var today = moment().startOf('day');
    var lastday = moment(today).subtract(1, 'days');
    var deferred = Q.defer();
    ordercartmodel.find(
        {
            'shop':shopresult[0]._id,
            // 'shop':shopresult._id,
            ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
            // ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
        },'totalprice products.title products.title products.quantity',
        function(error,result){
            if (error) {
                deferred.reject(new Error(error));
            }
            else {
                deferred.resolve(result);
            }
        });
    return deferred.promise;
}



// db.getCollection('dishsales').find({ordertime:{$gt: new Date("2017-09-15"),$lt: new Date("2017-09-16")}})
// 完整调用方式
var getLastAll =function(){
    var analysisFunc =new AnalysisFunc();
    getUserId(userId)
    .then(function(userResult){
        // console.log(userResult);
        return getShopId(userResult);
    })
    .then(function(shopResult){
        // console.log("shopResult"+shopResult);
        analysisFunc.shopId = shopResult[0]._id;
        return getOrder(shopResult);
    })
    .then(function(result){
        // console.log(result.length);
        // 在这里处理数据
        analysisFunc.totalLast(result);
        analysisFunc.orderPrice(result);
        analysisFunc.dishCompare(result);
        analysisFunc.timeSect(result);
        analysisFunc.getCount(result);
        // this.income= 0;
        // this.billData =null;
        // this.dishData =null;
        // this.timeSecData =null;
        // totalLast
        // orderPrice
        // dishCompare
        // timeSect
        console.log(analysisFunc.income);
        // console.log(analysisFunc.billData);
        // console.log(analysisFunc.dishData);
        // console.log(analysisFunc.timeSecData);
        // console.log(analysisFunc.shopId);
        var newShopData = new shopdatamodel({
                shop            : analysisFunc.shopId,
                totalLast       : analysisFunc.income,
                orderPrice      : analysisFunc.billData,
                orderCount      : analysisFunc.count,
                dishCompare     : analysisFunc.dishData,
                dishSaleCount   : analysisFunc.dishSaleCount,
                timeSect        : analysisFunc.timeSecData
        });
        newShopData.save(function(err,result){
                    console.log(err);

                    process.exit(0);
                    });
        // process.exit(0);
    })
    .catch(function(error){
        console.log(error);
        process.exit(0);
    })
    .done();
}

getLastAll();


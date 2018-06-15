
var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;
var shopdatamodel = require('../models/rptday.js').ShopData;
// var shopdatamodel = require('../models/rptweek.js').RptWeek;
var dishmodel = require('../models/dish.js').Dish;

var sortKeysByValue = require('sort-keys-by-value');
var moment =require('moment');
var _ = require('lodash');
var Q = require('q');
var async = require("async");
/*
说明：
1 函数名称尽可能使用抽象的命名，在不同维度的分析中可以通用
  更改维度时，只需要针对这一个维度修改具体的函数
 */
// 数据处理类Analysis-Func
function AnalysisFunc (){
    this.shopId = null;
    // 不同函数获取的结果以虚线隔开
    //---------------------------------------
    // 销售总金额
    this.income= 0;
    //---------------------------------------
    // 订单总份数
    this.count= 0;
    //---------------------------------------
    // 订单价格与数量的排序数组,用于分析单价区间
    this.billData =null;
    //---------------------------------------
    // 小时段的销售数量
    this.timeSecData =null;
    //---------------------------------------
    // 有销售记录的菜品数量【不要与订单份数弄混】
    this.dishSaleCount =0;
    // 单品销售数量
    this.dishData =null;

    // 单品销售总金额
    this.dishSalePrice =null;
    // 分类销售数量
    this.saleCount_byCate =null;
    // 分类销售金额
    this.salePrice_byCate =null;
    //---------------------------------------
    // 周期内的（日期，销售数量，金额）三个数组
    // this.dailyIncomeResult =null;
    
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
    // console.log('shop total: '+incomeResult);
    return incomeResult;
};
/*AnalysisFunc.prototype.dailyIncome = function(result) {
    // 获取一周数据
    var startDay = moment().startOf('day');
    var days = [];
    for(var i=7;i>0;i--){
        var stepDay = moment(startDay).subtract(i, 'days');
        // console.log(stepDay.format('MMDD'));
        days.push(stepDay.format('MMDD'));
    }
    // 使用日期对数据数组进行分组，结果是以日期为属性的对象数组
    var dailyArray =_.groupBy(result,function(item){
                    return moment(item.ordertime).format('MMDD')
                });
    // console.log(dailyArray);
    var dayIncome=[],dayCount=[];
    for(var i in days){
        var key = days[i];
        if(dailyArray.hasOwnProperty(key)){
            var tmp = dailyArray[key].reduce(function(total,item){
                    return total = total+item.totalprice;
                },0);
            dayIncome.push(tmp);
            dayCount.push(dailyArray[key].length);
        }
        else{
            dayIncome.push(0);
            dayCount.push(0);
        }
    }
    // console.log(days);
    // console.log(dayIncome);
    // 添加计算结果到属性【待处理】
    var dailyIncomeResult ={};
    dailyIncomeResult.days=days;
    dailyIncomeResult.dayIncome=dayIncome;
    dailyIncomeResult.dayCount=dayCount;
    this.dailyIncomeResult = dailyIncomeResult;
    // console.log(dailyIncomeResult);
    return dailyIncomeResult;
};*/

// 可以不用单独写这个函数的
AnalysisFunc.prototype.getCount = function(result) {  
    this.count = result.length;
    return result.length;
};
// 订单价格排序分布
AnalysisFunc.prototype.orderPrice = function(result) {
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
    // 保存有销售记录的订单个数
    // this.dishSaleCount = j;
    return orderPriceData;
};
// 通用
// 分类数据也在这里计算
AnalysisFunc.prototype.dishCompare = function(result,menu_cate) {
    // 单品销售总数量
    var dishsalerpt={};
    // 单品销售总金额
    var dishSalePrice={};
    // 有销售记录的菜品数量
    var count =0;
    // 分类销售数量
    var saleCount_byCate={};
    // 分类销售金额
    var salePrice_byCate={};

    result.map(function(dish,index){
        dish.products.map(function(item,index){
            if(item.title in dishsalerpt){
                dishsalerpt[item.title] = dishsalerpt[item.title] +item.quantity;
                dishSalePrice[item.title] = dishSalePrice[item.title] +item.quantity * item.price;   
            }
            else{
                dishsalerpt[item.title]  =item.quantity;
                dishSalePrice[item.title] =item.quantity * item.price;
                count++;
            }
            if(menu_cate[item.title] in saleCount_byCate){
                    saleCount_byCate[menu_cate[item.title]] = saleCount_byCate[menu_cate[item.title]] +item.quantity;
                    salePrice_byCate[menu_cate[item.title]] = salePrice_byCate[menu_cate[item.title]] +item.quantity*item.price;
            }   
            else{
                saleCount_byCate[menu_cate[item.title]] = item.quantity;
                salePrice_byCate[menu_cate[item.title]] = item.quantity * item.price;
            }
        });
    });
    // var dishsale_sort = sortKeysByValue(dishsalerpt,{ reverse: true });
    // 
    // console.log(saleCount_byCate);
    // console.log(salePrice_byCate);
    // console.log(dishSalePrice);
   /* 
    //核对计算结果
   var tmp_1 = 0;
    for(var key in salePrice_byCate){
        tmp_1  += salePrice_byCate[key];

    } 
    console.log(tmp_1);
    console.log('=====================');
    var tmp_2 = 0;
    for(var key in dishSalePrice){
        tmp_2  += dishSalePrice[key];

    } 
    console.log(tmp_2);*/
    // 添加计算结果到属性【待处理】
    var dishsale_sort = sortKeysByValue(dishsalerpt);

    this.dishData =dishsale_sort;
    this.dishSaleCount = count;
    this.dishSalePrice = dishSalePrice;
    this.saleCount_byCate = saleCount_byCate;
    this.salePrice_byCate = salePrice_byCate;

    return dishsale_sort;
};
AnalysisFunc.prototype.timeSect = function(result,option) {
    // 需要性能优化时，将下面改写为直接使用Date的差值比较
    // 分时段的订单数，以下单时间为准
    // 分时段的营业额
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
};


// var userId = 15606181258;
// var queryuser = usermodel.findOne({ 'mobile': userId }).exec();
// 获取订单数据
var getOrder = function(shopResult) {
    var startDay = moment().startOf('day');
    // 获取昨天数据
    var endDay = moment(startDay).subtract(1, 'days');

    var deferred = Q.defer();
    ordercartmodel.find(
        {
            'shop':shopResult._id,
            ordertime:{$gte: endDay.toDate(), $lt: startDay.toDate()}
            // ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
        },'totalprice products.title products.price products.quantity ordertime',
        function(error,result){
            if (error) {
                deferred.reject(new Error(error));
            }
            else {
                // 查找菜单的类别，即时菜单可以动态增加分类，也能使用这个方法
                var queryDish = dishmodel.find({shop: shopResult._id});
                queryDish.select('title category');
                queryDish.sort({ category: -1});
                queryDish.exec(function(error,menulist){
                    
                    if(error){
                        deferred.reject(new Error(error));
                    }
                    else{
                        var menu_cate={};
                        menulist.map(function(item,index){
                            menu_cate[item.title]=item.category;
                        });
                        // console.log(menu_cate);
                        var composeObj = {};
                        composeObj.menu_cate=menu_cate;
                        composeObj.result= result;
                        // console.log(menu_cate);
                        deferred.resolve(composeObj);
                    }
                });
                // deferred.resolve(result);
            }
        });
    return deferred.promise;
}
// 计算单个店铺的数据
var getSingleData =function(shopResult , doneCallback){
    var analysisFunc =new AnalysisFunc();
    analysisFunc.shopId = shopResult._id;

    getOrder(shopResult)
    .then(function(composeObj){
        var result = composeObj.result;
        var menu_cate = composeObj.menu_cate;
        // 在这里处理数据
        analysisFunc.totalLast(result);
        analysisFunc.orderPrice(result);
        analysisFunc.dishCompare(result,menu_cate);
        analysisFunc.timeSect(result);
        analysisFunc.getCount(result);
        // analysisFunc.dailyIncome(result);
        
        // 测试时不存储，关闭
        var newShopData = new shopdatamodel({
                shop            : analysisFunc.shopId,
                totalLast       : analysisFunc.income,
                orderPrice      : analysisFunc.billData,
                orderCount      : analysisFunc.count,
                dishCompare     : analysisFunc.dishData,
                dishSaleCount   : analysisFunc.dishSaleCount,
                timeSect        : analysisFunc.timeSecData,

                dishSalePrice   : analysisFunc.dishSalePrice,
                saleCount_byCate : analysisFunc.saleCount_byCate,
                salePrice_byCate : analysisFunc.salePrice_byCate
        });

        newShopData.save(function(err,result){
            if(err)
                console.log(err);
            return doneCallback(null);
        });

    })
    .catch(function(error){
        console.log(error);
        process.exit(0);
    })
    .done();
}
// 这一层封装是多余的，可以直接使用里面的函数
var Analysis = function(shop, doneCallback){
    getSingleData(shop,doneCallback);
}
var asyncTask = function(shopList){
    // 结果数据比较大，不传递结果，回调中的results为空
    async.eachLimit(shopList,3,Analysis,function(err){
        console.log("Finished!");
        console.log('err: '+err);
        process.exit();
    })
}

var queryshop = shopmodel.find({}).exec();
queryshop.then(function(result){
    // 
    console.log('start process...')
    console.log('shop count: '+result.length);
    // 处理任务
    asyncTask(result);
    // process.exit();

})
.fail(function (error) {
    console.log(error);
    process.exit();
});

/*
怎么检查过程中中出现失败
 */
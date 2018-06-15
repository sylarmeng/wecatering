
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
    var lastday = moment(today).subtract(2, 'days');
    var deferred = Q.defer();
    /*
    {
                $project: {
                    day: { $dayOfMonth: "$ordertime" }
                }
            },
     */
    /*ordercartmodel.aggregate(
        [
            {
                $match: {
                    'shop':shopresult[0]._id,
                    ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
                }
            },
            {
                $group: {
                      _id : { day: { $dayOfMonth: "$ordertime" }},
                      totalprice: { $push: { totalprice: "$totalprice" }}
                }
            }
        ],*/
    ordercartmodel.find(
        {
            'shop':shopresult[0]._id,
            // 'shop':shopresult._id,
            ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
            // ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
        },'totalprice products.title products.title products.quantity ordertime',
        function(error,result){
            if (error) {
                deferred.reject(new Error(error));
            }
            else {
                // console.log(result)
                /*result[0].totalprice.map(function(item,index){
                   console.log(item);
                })*/
                console.log(result.length)
                var tmp =_.groupBy(result,function(item){
                    return moment(item.ordertime).format('YYYY-MM-DD')
                })
                console.log(tmp)
                deferred.resolve(result);
            }
        });
    return deferred.promise;
}

var getLastAll =function(){

    getUserId(userId)
    .then(function(userResult){
        // console.log(userResult);
        return getShopId(userResult);
    })
    .then(function(shopResult){
        // console.log("shopResult"+shopResult);
        return getOrder(shopResult);
    })
    .then(function(result){
        // console.log(result);
        process.exit(0);
    })
    .catch(function(error){
        console.log(error);
        process.exit(0);
    })
    .done();
}

getLastAll();


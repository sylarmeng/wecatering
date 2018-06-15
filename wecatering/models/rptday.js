/**
 * { product schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var shopdataSchema = new Schema({

	shop 		: {type: Schema.Types.ObjectId, ref: 'Shop'},
	totalLast     	: {type: Number, required: true, min: 0},
	orderCount     	: {type: Number, required: true, min: 0},
    orderPrice		: {
    					bill_count: [{type: Number}],
    					bill_value: [{type: Number}]},

    dishCompare		: Schema.Types.Mixed,
    dishSaleCount 	: {type: Number},
    timeSect		: [{type: Number}],

    dishSalePrice   : Schema.Types.Mixed,
    saleCount_byCate: Schema.Types.Mixed,
    salePrice_byCate: Schema.Types.Mixed,

    calcTime        : {type: Date,required: true, default: new Date()}
});

var ShopData = mongoose.model('shopdata',shopdataSchema);
module.exports = {
	ShopData:ShopData
};

// 添加销售记录的查询方法

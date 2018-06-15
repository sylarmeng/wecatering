/**
 * { product schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var rptweekSchema = new Schema({

	shop 		: {type: Schema.Types.ObjectId, ref: 'Shop'},
	totalLast      : {type: Number, required: true, min: 0},
	orderCount     	: {type: Number, required: true, min: 0},
    orderPrice		: {
    					bill_count: [{type: Number}],
    					bill_value: [{type: Number}]},

    dishCompare		:  Schema.Types.Mixed,
    // 注意是否重复
    dishSaleCount 	:  {type: Number},
    timeSect		: [{type: Number}],
    calcTime        : {type: Date,required: true, default: new Date()},

    dishSalePrice   : Schema.Types.Mixed,
    saleCount_byCate: Schema.Types.Mixed,
    salePrice_byCate: Schema.Types.Mixed,
    dailyIncomeResult: {
                        days: [{type: String}],
                        dayIncome: [{type: Number}],
                        dayCount: [{type: Number}]}
    // 其他数据：菜品按种类的销售额
    // 取消的订单数，实际接收的订单数
    // 自点的数目，扫码点餐的数目
});

var RptWeek = mongoose.model('rptweek',rptweekSchema);
module.exports = {
	RptWeek:RptWeek
};

// 添加销售记录的查询方法

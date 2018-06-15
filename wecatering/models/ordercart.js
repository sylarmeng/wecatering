/**
 * { product schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var ordercartSchema = new Schema({
	//点单用户
	custom 		: {type: String},
	id 			: {type: String },
	shop 		: {type: Schema.Types.ObjectId, ref: 'Shop'},
	tableNo 	: {type: String },
	products  	: [{
				    item     	: {type: Schema.Types.ObjectId, ref: 'Dish', required: true},
				    title 		: {type: String, required: true},
				    price 		: {type: Number, required: true, min: 0},
				    quantity 	: {type: Number, required: true, min: 1},
				    status: {type: Boolean, default: false, required: true},
				    complete 	:{type: Number, default:0, required: true}
			  		}],
	totalprice 	:{type: Number, required: true},
	ordertime 	:{type: Date, default: new Date(), required: true},
	finishtime 	:{type: Date, default: new Date(), required: true},
	// 确认订单接收
	// acked 		:{type: Boolean, default: false, required: true},
	acked: 		{type: Number, enum: [0,1,2], required: true, default: 0},
	// 确认订单结算
	checked 	:{type: Boolean, default: false, required: true},
	checkedtime 	:{type: Date, default: new Date(), required: true}
});

var OrderCart = mongoose.model('Dishsales',ordercartSchema);
module.exports = {
	OrderCart:OrderCart
};

// 添加销售记录的查询方法

/**
 * { product schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */


var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var dishSchema = new Schema({
	id : {type: String, required: true, index: true,unique: true},
	owner: {type: Schema.ObjectId, ref: 'User'},
	shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
	// record :[{ type: Schema.Types.ObjectId, ref: 'Dishsales' }],
	title : {type: String, required: true},
	price: {type: Number, required: true},

	salesVolume: {type: Number, default: 0},
	Status: {type: String, enum: ['onsale','offsale'], required: true, default: 'onsale'}, //onsale offsale
	category: {type: String, enum: ['特色','主菜','汤类','小菜','甜点','饮品','主食','其他'],required: true, default: '其他'},
	discount: {type: Number, enum: [0,1,2,3,4,5,6,7,8,9,10], required: true, default: 10},
	// pv: {type: Number, default: 0},

	createTime : Date,
	updateTime : Date,
	sampleImage: {type: String,  default:null},//thumb image
	fullImage: {type: String, default:null}
});
var Dish = mongoose.model('Dish',dishSchema);

module.exports = {
	Dish:Dish
};


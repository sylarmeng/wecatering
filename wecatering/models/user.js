/**
 * { user schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var userSchema = new Schema({
	// id : {type: Number, required: true},
	id : {type: Number},
	name : {type: String},
	password : {type: String, required: true},
	mobile:{type: String, required: true},
	email : {type: String},
	headicon : String,
	createTime : Date,
	updateTime : Date,
	//对不同级别用户设置限制，禁止恶意开设店铺，
	shopcount:{type: Number, default:0},
	isAdmin: {type: Boolean, default: false, required: true},
	//isAdmin true:chain-shop admin, false:single shop operator
	isVendor: {type: Boolean, default: true, required: true},
	//isChild true:child account,child account has limited right
	parent: { type: Schema.Types.ObjectId, ref: 'User'},
	//if user is child account,he needs a parent
	// waiter: { type: Schema.Types.ObjectId, ref: 'Waiter'},
	shops:[{ type: Schema.Types.ObjectId, ref: 'Shop' }],
	// 订单模式偏好options，存储在用户模型中可以减少查询次数
	// 排序方式
	showMode:{type: String,default:'downmode' },//0-时间倒序，1-时间顺序，2-桌台顺序
	tableMode:{type: Number,default:3 } //取值为1/2/3/4
	// 堂食模式options
	
});

var User = mongoose.model('User',userSchema);

module.exports = {
	User:User
};


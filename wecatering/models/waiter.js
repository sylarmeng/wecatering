/**
 * { user schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var waiterSchema = new Schema({

	name : {type: String, required: true},
	password : {type: String, required: true},
	createTime : Date,
	updateTime : Date,
	admin: { type: Schema.Types.ObjectId, ref: 'User'},
	// shops:[{ type: Schema.Types.ObjectId, ref: 'Shop' }]
	
});
var Waiter = mongoose.model('Waiter',waiterSchema);
module.exports = {
	Waiter:Waiter
};


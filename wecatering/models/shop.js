/**
 * { user schema }
 * @author     (sylar_2000@163.com)
 * @type       {schema}
 */
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var shopSchema = new Schema({
  id : {type: String },
  name : {type: String },
  area : {type: String },
  // 与下面catelog重复
  category:{type: String },
  owner: {type: Schema.Types.ObjectId, ref: 'User',required: true},

  addr :{type: String },
  tables:{type: String },
  seats:{type: String },
  //opentime:start,end
  opentime_start:{type: Number },
  opentime_end:{type: Number },
  createTime : Date,
  updateTime : Date,
  recipeCount:{type: Number, default:0 ,required: true},
  catelog:[{type: String}],
  recipes:[{ type: Schema.Types.ObjectId, ref: 'Dish' }]
  
});

var Shop = mongoose.model('Shop',shopSchema);

module.exports = {
	Shop:Shop
};


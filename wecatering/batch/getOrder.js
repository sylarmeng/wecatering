

var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var dishmodel = require('../models/dish.js').Dish;
var waitermodel = require('../models/waiter.js').Waiter;

var moment =require('moment');
var _ = require('lodash');
var async = require("async");
var axios = require('axios');
var uuidv1 = require('uuid/v1');

// 随机订单的形式
// 1 设定随机的时间段
// 2 设定日期
// 3 设定设定份数

var shopId =15606181258;
var orderCount = 10;
var genInterval = 2000;//2s interval

var genIndex;
var genCount =0;
var genDishFunc = {
  // 生成不重复的序号
    // genCount:0,

    randomDishFunc: function randomDish(dishList,menuLength){
      var flag=false;
      genIndex = Math.floor(Math.random()*menuLength);
      // console.log('index--'+genIndex);
      for(var i=0,length=dishList.length;i<length;i++){
        if(genIndex ===dishList[i]){
          flag = true;
          console.log('重复==='+genIndex);
          break;
        }
        else{
          flag=false;
        }
      }
      if(flag){
        return randomDish(dishList,menuLength);
      }
      else{
        // console.log('生成序号---'+genIndex);
        return genIndex;
      }
    }
};



setInterval(function(){
  usermodel.findOne({mobile: shopId},function(err,user){
        if(err){
          console.log(err);
        }
        if(user ==null){
          console.log('不存在用户')
        }
        else{
          shopmodel.findOne({owner: user._id},function(err,shop){
            // console.log(shop);
            if(err){
                console.log(err);
              }
            if(shop){

              var queryDish = dishmodel.find({shop: shop._id});
              queryDish.select('title price category discount sampleImage fullImage');
              queryDish.sort({ category: -1});
              queryDish.exec(function(err,menulist){
                
                // console.info("Execution time: %dms", end);
                if(err){
                  console.log(err);
                }
                else{
                  // console.log(menulist)
                  // console.log('get meunulist ok')
                  /*var cateCount  = _(menulist)
                    .groupBy('category')
                    .map(function(item, itemId) {
                      console.log('itemId-----'+itemId)
                      obj[itemId] = _.countBy(item, 'category')
                      return obj
                    }).value();*/
                  // 按照类别对菜单进行分类
                  var cateCount = _.countBy(menulist,'category');

                  var i = 0, key;
                  var cateIndex=[]
                    for (key in cateCount) {
                      if(i==0){
                        cateIndex[i]=cateCount[key];
                        cateCount[key] = 0;
                      }
                      else{
                        cateIndex[i]=cateCount[key]+cateIndex[i-1];
                          cateCount[key]=cateIndex[i-1];
                      }
                      i++;
                    }

                    cateIndex =null;
                  var menuResult={};
                  menuResult.menulist = menulist;
                  menuResult.shop_id = shop._id;
                  menuResult.cateCount = cateCount;
                  console.log('dish category:'+i);
                  console.log('dish count:'+menulist.length);
                  
                  var genOrderCount = Math.ceil(Math.random()*6);
                  // console.log('随机订单数量'+genOrderCount)
                  var gerOrderIndex = [];
                  var products =[];
                  var totalprice = 0;
                  for(var i =0;i<genOrderCount;i++){
                    // gerOrderIndex[i]=Math.floor(Math.random()*(menulist.length));
                    
                    var newIndex = genDishFunc.randomDishFunc(gerOrderIndex,menulist.length);
                    // console.log('新id:'+newIndex);
                    gerOrderIndex[i]=newIndex;
                    // Math.floor(Math.random()*(menulist.length));
                    // console.log('订单id:'+gerOrderIndex[i]);
                    // console.log(menulist[gerOrderIndex[i]]);

                    products[i]= {};
                    products[i].title = menulist[gerOrderIndex[i]].title
                    products[i].item = menulist[gerOrderIndex[i]]._id
                    products[i].quantity = 1
                    products[i].price = menulist[gerOrderIndex[i]].price
                    products[i].complete = 0
                    products[i].status = false

                    totalprice += products[i].price;
                  }
                  genCount++;
                  console.log('订单总数：'+ genCount);
                  // console.log

                  var order={}
                  order.id = uuidv1()
                  order.products = products
                  order.totalprice = totalprice
                  // 设置自动订单时间
                  // order.ordertime = new Date()
                  var today = moment().startOf('day');
                  var lastday = moment(today).subtract(1, 'days');
                  order.ordertime = lastday.toDate();
                  
                  order.shop = shop._id
                  //add table number
                  order.tableNo = Math.floor(Math.random()*50)
                  // 订单接收状态
                  order.acked = 0
                  var orderCompose ={}
                  orderCompose.order =order
                  orderCompose.shopid =shopId

                  // axios.post("http://192.168.1.101:3000/api/listmenu",orderCompose)
                  axios.post("https://www.dearpie.com/api/listmenu",orderCompose)
                  .then(function(res){
                      console.log(res.data);
                      // console.log('结束');
                      // process.exit();
                    })
                  .catch(function(err){
                      // console.log(err);
                      console.log('err')
                      // process.exit();
                    });
                }
              });
            }
            else{
              console.log('不存在店铺')
            }
            
          });
        }
      });
},300)

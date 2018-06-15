/*var Mongoose = require('../models/mongooseConn.js');
var db =Mongoose();

var redis = require('../redis/redisconfig.js');
var shopmodel = require('../models/shop.js').Shop;
var usermodel = require('../models/user.js').User;
var ordercartmodel = require('../models/ordercart.js').OrderCart;

var sortKeysByValue = require('sort-keys-by-value');

var moment =require('moment');
var _ = require('lodash');
		    
process.on('message',function(messageid){
	var shopquery = shopmodel.find({}).exec();
	shopquery.then(function(shopresult){

		if(shopresult.length ==0){
			console.log('result is empty');
		}
		else{
			//get today's order
			// var start = new Date();
			// start.setHours(0,0,0,0);
			// var end = new Date();
			// end.setHours(23,59,59,999);
			console.log('calculate-----last day')
			var start = new Date();
			var today = moment().startOf('day');
			var lastday = moment(today).subtract(1, 'days');
			// var tomorrow = moment(today).add(1, 'days');
			
			
			// calculate today
			// var today = moment().startOf('day');
			// var tomorrow = moment(today).add(1, 'days');
			// ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
			
			
			// calculate last day
			// var today = moment().startOf('day');
			// var lastday = moment(today).subtract(1, 'days');
			// ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
			

			ordercartmodel.find(
		    	// {'shop':shopresult[0]._id,
		    	{'shop':messageid,
		    		ordertime:{$gte: lastday.toDate(), $lt: today.toDate()}
		    		// ordertime:{$lt: tomorrow.toDate(), $gte: today.toDate()}
		    	},'totalprice products.title products.title products.quantity',
			    function(err,result){
			    	if(err){
				        console.log("dbm fail");
				        return console.log(err);
				        
				    }
				    // console.log(result[0].products);
				    console.log('time elapsed:----query'+ (new Date() - start));

				    
				    // last day total income
				    var income =result.reduce(function(total,item){
				    	return total = total+item.totalprice;
				    },0);
				    // console.log(income)
					console.log('time elapsed:----totalincome'+ (new Date() - start));

					// last day order price sort
					var bill_list=[]
				    result.map(function(item,index){
				    	bill_list.push(item.totalprice);
				    });
				    var bill_sort = _.sortBy(bill_list);
				    console.log('time elapsed:----sortbill'+ (new Date() - start));

				    // last day order price sort with count
				    var bill_value=[0];
				    var bill_count=[0];
				    var j=0;
				    for(i =0;i<bill_sort.length;i++){
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
				    console.log('time elapsed:----billcount'+ (new Date() - start));

				    //  last day every dish sales
				    var start_dish = new Date();
				    var dishsalerpt={};
				    result.map(function(dish,index){
				    	dish.products.map(function(item,index){
				    		if(item.title in dishsalerpt){
				    			dishsalerpt[item.title] = dishsalerpt[item.title] +1;
				    		}
				    		else{
				    			dishsalerpt[item.title]  =1;
				    		}

				    	});
				    });
				    // console.log(dishsalerpt);
				    console.log('time elapsed:----dishsalerpt'+ (new Date() - start_dish));
				    var start_dish_sort = new Date();
				    var dishsale_sort = sortKeysByValue(dishsalerpt,{ reverse: true })
					// console.log(dishsale_sort);
				    console.log('time elapsed:----dishsalerpt sort'+ (new Date() - start_dish_sort));
				    console.log('time elapsed:----total'+ (new Date() - start));
					
					// process.send('result');
					var salereport ={};
					salereport.dishsale_sort = dishsale_sort;
					salereport.bill_count = bill_count;
					salereport.bill_value = bill_value;
					salereport.income = income;
					salereport.count = result.length;
					process.send(salereport);
					// process.send(salereport);
				});
		}
	})
});
*/
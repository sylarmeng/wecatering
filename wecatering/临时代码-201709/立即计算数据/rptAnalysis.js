
var sortKeysByValue = require('sort-keys-by-value');

var moment =require('moment');
var _ = require('lodash');

function analysisFunc (){}		    
analysisFunc.prototype.orderPrice = function() {
	
};
analysisFunc.prototype.dishCompare = function() {
};
analysisFunc.prototype.timeSection = function() {
};
process.on('message',function(result){
	var start = new Date();
	// last day total income
				    var income =result.reduce(function(total,item){
				    	return total = total+item.totalprice;
				    },0);
				    // console.log(income)
					// console.log('time elapsed:----totalincome'+ (new Date() - start));

					// last day order price sort
					var bill_list=[]
				    result.map(function(item,index){
				    	bill_list.push(item.totalprice);
				    });
				    var bill_sort = _.sortBy(bill_list);
				    // console.log('time elapsed:----sortbill'+ (new Date() - start));

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
				    // console.log('time elapsed:----billcount'+ (new Date() - start));

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
				    // console.log('time elapsed:----dishsalerpt'+ (new Date() - start_dish));
				    var start_dish_sort = new Date();
				    // var dishsale_sort = sortKeysByValue(dishsalerpt,{ reverse: true });
				    var dishsale_sort = sortKeysByValue(dishsalerpt);
					// console.log(dishsale_sort);
				    // console.log('time elapsed:----dishsalerpt sort'+ (new Date() - start_dish_sort));
				    // console.log('time elapsed:----total'+ (new Date() - start));
					
					// process.send('result');
					var salereport ={};
					salereport.dishsale_sort = dishsale_sort;
					salereport.bill_count = bill_count;
					salereport.bill_value = bill_value;
					salereport.income = income;
					salereport.count = result.length;
					process.send(salereport);
});


var sortKeysByValue = require('sort-keys-by-value');

var moment =require('moment');
var _ = require('lodash');

function AnalysisFunc (){}
// 昨日总收入，传入总订单
AnalysisFunc.prototype.totalLast = function(result) {
	var income =result.reduce(function(total,item){
			    	return total = total+item.totalprice;
			    },0);
	return income;
};
// 昨日订单价格排序分布
AnalysisFunc.prototype.orderPrice = function(result) {
	 
	// last day order price sort
	var bill_list=[];
    result.map(function(item,index){
    	bill_list.push(item.totalprice);
    });
    var bill_sort = _.sortBy(bill_list);
    // 对订单价格排序
    var bill_value=[0];
    var bill_count=[0];
    for(var i =0,j =0,bill_length = bill_sort.length;i<bill_length;i++){
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
    var orderPriceData ={};
	orderPriceData.bill_count = bill_count;
	orderPriceData.bill_value = bill_value;
	return orderPriceData;
};

AnalysisFunc.prototype.dishCompare = function(result) {
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
    // var dishsale_sort = sortKeysByValue(dishsalerpt,{ reverse: true });
    var dishsale_sort = sortKeysByValue(dishsalerpt);
    return dishsale_sort;
};
AnalysisFunc.prototype.timeSection = function() {

};
process.on('message',function(result){
	var procFunc =new AnalysisFunc();
	var orderPrice = procFunc.orderPrice(result);
	var dishCompare = procFunc.dishCompare(result);

	var salereport ={};
	salereport.dishsale_sort = dishCompare;

	salereport.bill_count = orderPrice.bill_count;
	salereport.bill_value = orderPrice.bill_value;

	salereport.income = procFunc.totalLast(result);

	salereport.count = result.length;
	process.send(salereport);
});

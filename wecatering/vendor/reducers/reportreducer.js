
/*const initialState = {
  bill_count:[],
  bill_value:[],
  income:0,
  count:0,
  dishsale_sort:[]
}*/

        // resData.dailyIncomeResult = dataResult.dailyIncomeResult;
        // 
const initialState = {
  lastDay:{
        bill_count:[],
        bill_value:[],
        income:0,
        count:0,
        dishsale_sort:[],
        dishSaleCount:0,
        dishSalePrice:null,
        saleCount_byCate:null,
        salePrice_byCate:null
      },
  lastWeek:{
        bill_count:[],
        bill_value:[],
        income:0,
        count:0,
        dishsale_sort:[],
        dishSaleCount:0,
        dishSalePrice:null,
        saleCount_byCate:null,
        salePrice_byCate:null,
        dailyIncomeResult:null
      }
}

// lastDay:null
/*salereport.dishsale_sort = dishsale_sort;
          salereport.bill_count = bill_count;
          salereport.bill_value = bill_value;
          salereport.income = income;
          salereport.count = result.length;*/

// export default saleList
 const reportList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_RPT_LD':{
      // return action.data
        let newState = {}
        newState.lastDay = action.data
        newState.lastWeek = state.lastWeek
        return newState
    }
      	
    case 'SET_RPT_LW':{
        // console.log(action.data)
        let newState = {}
        newState.lastDay = state.lastDay
        newState.lastWeek = action.data
        return newState
    }
        
    case 'RESET_REPORT':
    	// console.log(state)
    	state=null
      	return initialState
    default:
      	return state
  }
}
export default reportList
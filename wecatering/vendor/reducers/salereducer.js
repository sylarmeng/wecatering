
/*const initialState = {
  salestate: [],
  finishList:[]
}*/
// import findIndex from 'lodash.findindex'
// import {findIndex} from 'lodash'
// 菜单的state中需要加入分页状态，
// state中需要包含的内容：当前分页，菜单列表
export const saleList = (state = [], action) => {

  switch (action.type) {
    case 'SET_SALE_UNCHECK':
      state=null
      return action.data
      /*return action.data.filter((item)=>{
        return item.checked !== true
      })*/
    case 'UPDATE_SALE':{
      /*console.log(action.order.id)
      let index = state.reduce(function(searchIndex, item, index){
            if(item.id == action.order.id) { 
              searchIndex = index;
            }
            return searchIndex;
          }, null);
      if(index!==null){
        console.log('repeat in reduce')
      }*/
      if(state.length<20){
          return [
          action.order,
          ...state]
      }
      else{
        let newsalelist=[]
        for(let i=0;i<19;i++){
          // Object.assign({}, state[i])
          newsalelist.push(Object.assign({}, state[i]))
        }
        newsalelist.unshift(action.order)
        return newsalelist
      }
      /*return [
        ...state,
        action.order
        ]*/
    }
    case 'STATUS_CHANGE':{
      let newsalelist = state.map(a => Object.assign({}, a));              
      //使用reduce方式可以返回index，但是缺点是要遍历整个数组
      //make sure array is not too long
      let index = newsalelist.reduce(function(searchIndex, item, index){
                  if(item.id === action.order2change.orderId) { 
                    searchIndex = index;
                  }
                  return searchIndex;
                }, null);
      if(index!==null){
        newsalelist[index].products[action.order2change.product_index].status =true
        return newsalelist
      }
      else{
        return state
      }
      /*let result = newsalelist.filter(function(item){
        return item.id==action.order2change.orderId
      })
      if(result.length){
        result[0].products[action.order2change.product_index].status =true
        return newsalelist
      }
      else{
        return state
      }*/

    }
    case 'CHECK_CHANGE':{
      let newsalelist = state.map(a => Object.assign({}, a));
      let index = newsalelist.reduce(function(searchIndex, item, index){
                  if(item.id === action.order2change.orderId) { 
                    searchIndex = index;
                  }
                  return searchIndex;
                }, null);
      if(index!==null){
        newsalelist.splice(index,1)
        return newsalelist
      }
      else{
        return state
      }
    }

    case 'COMP_CHANGE':{
      let orderIndex_origin = state.reduce(function(searchIndex, item, index){
                  if(item.id === action.order2change.orderId) { 
                    searchIndex = index;
                  }
                  return searchIndex;
                }, null);
      if(orderIndex_origin!==null){
        let comp = state[orderIndex_origin].products[action.order2change.product_index].complete
        let qty = state[orderIndex_origin].products[action.order2change.product_index].quantity
        if(comp <qty){
          let newsalelist = state.map(a => Object.assign({}, a));
          newsalelist[orderIndex_origin].products[action.order2change.product_index].complete =newsalelist[orderIndex_origin].products[action.order2change.product_index].complete+1
          return newsalelist
        }
        return state
        }
      else
        return state
    }
    case 'ACK_CHANGE':{
      let newsalelist = state.map(a => Object.assign({}, a));
      let index = newsalelist.reduce(function(searchIndex, item, index){
                  if(item.id === action.order2change.orderId) { 
                    searchIndex = index;
                  }
                  return searchIndex;
                }, null);
      if(index!==null){
        // 逻辑唯一与CHECK_CHANGE的不同
        newsalelist[index].acked=1
        return newsalelist
      }
      else{
        return state
      }
    }
    
    default:
      return state
  }
}

// export default saleList
// independent finishlist,only set when page load
export const finishList = (state = [], action) => {
  switch (action.type) {
    case 'SET_SALE_CHECK':
      return action.data
      /*return action.data.filter((item)=>{
        return item.checked == true
      })*/
    /*case 'CHECK_CHANGE':{
      
      let newsalelist = state.map(a => Object.assign({}, a));
      let changeorder =Object.assign({}, action.order2change.order)
      changeorder.checked = true
      newsalelist.push(changeorder)
      return newsalelist
    }*/
    default:
      return state
  }
}

const orderInfo ={
  'count':0,
  'finished':0
}
export const orderMisc =(state =orderInfo,action) => {
  switch (action.type) {
    case 'SET_ORDERCOUNT':{
       let newMisc =Object.assign({}, state)
       newMisc.count = action.data
      return newMisc
    }
    case 'UPDATE_ORDERCOUNT':{
      let newMisc =Object.assign({}, state)
      newMisc.count = newMisc.count+1
      return newMisc
    }
      
    case 'CHECK_CHANGE':{
      let newMisc =Object.assign({}, state)
      newMisc.count = newMisc.count-1
      return newMisc
    }
    
    case 'SET_FINISHCOUNT':{
       let newMisc =Object.assign({}, state)
       newMisc.finished = action.data
      return newMisc
    }
    default:
      return state
  }
}
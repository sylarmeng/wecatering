//client reducer
import { combineReducers } from 'redux'
import fetchlist from './fetchlist'
import fetchshop_id from './fetchshop_id'
import orderhandle, * as fromHandle from './orderreducer'
import account from './account'

const orderProc = combineReducers({
  menu: fetchlist,
  shop_id: fetchshop_id,
  orderlist: orderhandle,
  account : account
})
const getAddedIds = state => fromHandle.getAddedIds(state)
//id is just id
const getQuantity = (state, id) => fromHandle.getQuantity(state, id)
// 注意下面的参数匹配********
//reduce oupt is dish record
export const getTotal = state =>{
	// console.log(state)
  return getAddedIds(state)
	    .reduce((total, dish) =>
	      total + dish.price * getQuantity(state, dish._id),
	      0
	    )
	    .toFixed(1)
}

export const getCount = state =>{
	var result =0
	for (var p in state) {
	    result += state[p]
	  }
  	return result     
}

export default orderProc

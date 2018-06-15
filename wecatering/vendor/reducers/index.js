// vendor reducer
import { combineReducers } from 'redux'

import authReducer from './authreducer';
import shopreducer from './shopreducer';
import recipereducer from './recipereducer';
import recipesort from './recipesort';
// import salereducer from './salereducer';
import * as salereducer from './salereducer';
import reportreducer from './reportreducer';
import userreducer from './userreducer';

import waiterreducer from './waiterreducer';
import msgreducer from './resMSG';
import {addedIds,quantityById} from './orderreducer';

const orderProc = combineReducers({
  auth: 		    authReducer,
  shoplist: 	  shopreducer,
  recipelist: 	recipereducer,
  salelist: 	  salereducer.saleList,
  finishlist: 	salereducer.finishList,
  orderMisc: 	  salereducer.orderMisc,
  reportList: 	reportreducer,
  boss: 		    userreducer,
  waiter: 		  waiterreducer,
  resMSG: 		  msgreducer,
  recipesort:   recipesort,
  // 堂食点餐用，与client端处理方法一致
  addedIds:     addedIds,
  quantityById: quantityById
})

export default orderProc

// action
// add or increase order
import axios from 'axios'

function addorder(dish) {
  return {
    type: 'ADD_ORDER',
    dish
  };
}
export function doAdd(dish) {
  return dispatch => {
    dispatch(addorder(dish));
  };
}
// decrease order
function dereaseorder(dish) {
  // console.log('decrease')
  return {
    type: 'DECREASE_ORDER',
    dish
  };
}

function clearorder(dish) {
  // console.log('clear')

  return {
    type: 'CLEAR_ORDER',
    dish
  };
}

function resetorder() {
  return {
    type: 'RESET_ORDER'
  };
}
export function doDecrease(dish,count) {
  // console.log(count)
  if(count ==1){
      return dispatch => {
        dispatch(clearorder(dish))
      }
  }
  return dispatch => {
    dispatch(dereaseorder(dish))
  }
}

export function SubmitOrder(orderlist) {
  return (dispatch) => {
    dispatch(resetorder())
    return axios.post("/api/listmenu",orderlist)
      .then(res => (res.data))
      .then(data =>{
          // return dispatch({ type: 'FETCH_LIST_SUCCESS', payload: {'menu':data} })
          // return dispatch({ type: 'FETCH_LIST_SUCCESS', payload: data})
        });
      }
  }

export function setAccount(account) {
  return dispatch => {
    return dispatch({type: 'SET_ACCOUNT',payload: account});
  }
}

export function QueryOrder(options) {
  return (dispatch) => {
    dispatch({ type: 'SET_REQ_STATE'});
    return axios.post("/api/queryorder",options)
      .then(res =>{
          if(res.data==='DBERR')
            return;
          else
            return dispatch({ type: 'SET_RECORD', payload: res.data});
          // return dispatch({ type: 'FETCH_LIST_SUCCESS', payload: {'menu':data} })
      })
      .catch((error) => {
      });
  }
}
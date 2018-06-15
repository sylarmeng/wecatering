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
  return function (dispatch){
    dispatch(addorder(dish));
  }
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

        });
      }
  }
// action
import axios from 'axios'

import {Cookies} from 'react-cookie'
const cookie = new Cookies()

export function act_getsale_today(flag,page) {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'flag':flag,
      'page':page
    }
    axios.post('/api/getorder',newdata)
    .then((response) => {
      // console.log(response.data)
      if(response.data.flag==false&&response.data.order instanceof Array){
        dispatch({type: 'SET_SALE_UNCHECK',data:response.data.order})
        dispatch({type: 'SET_ORDERCOUNT',data:response.data.count})
        return
      }
      if(response.data.flag==true&&response.data.order instanceof Array){
        dispatch({type: 'SET_SALE_CHECK',data:response.data.order})
        dispatch({type: 'SET_FINISHCOUNT',data:response.data.count})
        return
      }
      else{
        // 账户不正确
        // console.log(response.data)
        dispatch({ type: 'UNAUTH_USER'})
        return
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}

export function act_sale_update(order) {
  return function (dispatch) {
    dispatch({type: 'UPDATE_SALE',order:order})
    dispatch({type: 'UPDATE_ORDERCOUNT'})
  };
}
export function act_sale_statusChange(order2change) {
  return function (dispatch) {

    if(order2change.action=='status'){
      dispatch({type: 'STATUS_CHANGE',order2change:order2change})
    }
    if(order2change.action=='complete'){
      dispatch({type: 'COMP_CHANGE',order2change:order2change})
    }
    if(order2change.action=='checked'){
      dispatch({type: 'CHECK_CHANGE',order2change:order2change})
    }
    if(order2change.action=='acked'){
      dispatch({type: 'ACK_CHANGE',order2change:order2change})
    }
    if(order2change.action=='cancel'){
      dispatch({type: 'CHECK_CHANGE',order2change:order2change})
    }
    let newdata = {
      'token':    cookie.get('token'),
      'user':     cookie.get('user'),
      'change':   order2change
    }

    axios.post('/api/orderupdate',newdata)
    .then((response) => {
      // console.log(response)
      // ignore response(is just a string)
      if(response.data instanceof Array){
        // console.log('set order list in store')
      }
      else{
        // dispatch({ type: 'UNAUTH_USER'})
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });

  };
}

export function act_sale_peerChange(order2change) {
  return function (dispatch) {
    if(order2change.action=='status'){
      dispatch({type: 'STATUS_CHANGE',order2change:order2change})
    }
    if(order2change.action=='complete'){
      dispatch({type: 'COMP_CHANGE',order2change:order2change})
    }
    if(order2change.action=='checked'){
      dispatch({type: 'CHECK_CHANGE',order2change:order2change})
    }
    if(order2change.action=='acked'){
      dispatch({type: 'ACK_CHANGE',order2change:order2change})
    }
    if(order2change.action=='cancel'){
      dispatch({type: 'CHECK_CHANGE',order2change:order2change})
    }
  };
}

export function act_setOption(option) {
  return function (dispatch) {
    let opts={};
    opts.showMode = option;

    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'option':opts
    };
    axios.post('/api/setoption',newdata)
    .then((response) => {
      dispatch(act_getsale_today('0',0));
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}
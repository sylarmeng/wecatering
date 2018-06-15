// action
import axios from 'axios';
import {Cookies} from 'react-cookie';
const cookie = new Cookies();

export function act_addshop(data) {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'data':data
    }
    axios.post('/api/addshop',newdata)
    .then((response) => {
      if(response.data ==='OK'){
        dispatch(act_getshop());
        dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)});
        return;
      }
      else if(response.data ==='ILLEGAL'){
        dispatch({ type: 'UNAUTH_USER'});
        return;
      }
      else{
        // DBERR
        dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)});
        return;
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}
export function act_getshop() {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user')
    };
    axios.post('/api/getshop',newdata)
    .then((response) => {
      if(response.data instanceof Object){
        if(response.data.shop instanceof Array){
          dispatch({ type: 'SET_SHOP',data:response.data.shop});
        }
        dispatch({ type: 'SET_USER',data:response.data.user});
        dispatch({ type: 'SET_WAITER',data:response.data.waiter});
        return;
      }
      else if(response.data==='AUTHFAIL'||response.data==='NORECORD'){
        dispatch({ type: 'UNAUTH_USER'});
        return;
      }
      else{
        // 此处要补充处理
        return;
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}
export function act_addwaiter(data) {
  return function (dispatch) {
    dispatch({ type: 'WAITER_REPEAT',payload:''});

    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'data': data
    };
    axios.post('/api/waiter',newdata)
    .then((response) => {
      if(response.data instanceof Array){
            dispatch({ type: 'SET_WAITER',data:response.data});
            dispatch({ type: 'WAITER_REPEAT',payload:''});
            dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)});
            return;
        }
      else if(response.data=='INUSE'){
        dispatch({ type: 'WAITER_REPEAT',payload:'用户已存在，换个号试试'});
        return;
      }
      else if(response.data=='LIMITED'){
        dispatch({ type: 'WAITER_REPEAT',payload:'最多只能创建3个小号'});
        return;
      }
      else if(response.data=='ILLEGAL'){
        dispatch({ type: 'UNAUTH_USER'});
        return;
      }
      else{
        dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)});
        return;
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}

export function act_delwaiter(data) {
  return function (dispatch) {
    dispatch({ type: 'WAITER_REPEAT',payload:''});
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'data': data
    };
    axios.post('/api/waiter',newdata)
    .then((response) => {
      if(response.data instanceof Array){
          dispatch({ type: 'SET_WAITER',data:response.data});
          dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)});
          return;
        }
      else if(response.data=='ILLEGAL'){
        dispatch({ type: 'UNAUTH_USER'});
        return;
      }
      else{
        dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)});
        return;
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}


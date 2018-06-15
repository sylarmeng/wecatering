
import axios from 'axios';
import {Cookies} from 'react-cookie';
import { browserHistory } from 'react-router';
// import {errorHandle } from './errorHandle.js';
const cookie = new Cookies();
export function loginUser(user) {
  return function (dispatch) {
    axios.post('/signin', user)
    .then((response) => {
      if(response.data.token){
        cookie.set('token', response.data.token, { path: '/' });
        cookie.set('user', user.mobilevalue, { path: '/' });
        cookie.set('cat', response.data.cat, { path: '/' });
        let payloadData = {};
        payloadData.cat = response.data.cat;
        payloadData.user = user.mobilevalue;
        dispatch({ type: 'AUTH_USER',payload:payloadData});
        // dispatch({ type: 'AUTH_USER',payload:response.data.cat});
        browserHistory.push('/shop/admin');
      }
      else{
        dispatch({ type: 'AUTH_ERROR',payload:response.data });
        browserHistory.push('/shop/signin');
      }
      // window.location.href = '/shop/'+user.mobilevalue+'/admin';
    })
    .catch((error) => {
      // errorHandle(dispatch);
      dispatch({ type: 'NET_ERROR'});
    });
  };
}


function dosetauth(token) {
  return {
    type: 'SET_AUTH',
    token
  };
}
export function setAuth(token) {
  return dispatch => {
    dispatch(dosetauth(token));
  };
}

function doclearauth() {
  return {
    type: 'UNAUTH_USER'
  };
}
export function clearAuth() {
  // 此处要通知服务端已经注销了
  return dispatch => {
    dispatch(doclearauth());
  };
}
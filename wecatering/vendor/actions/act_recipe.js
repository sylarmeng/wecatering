// action
import axios from 'axios'
import {Cookies} from 'react-cookie'
const cookie = new Cookies()

// 注意：执行添加操作之后，直接返回添加之后的集合，可以节省请求
export function act_addrecipe(data) {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'data':data
    }
    if(data.act=='editdish'){
      axios.post('/api/adddish',newdata)
      .then((response) => {
        //在此根据返回信息做出提示
        if(response.data==='OK'){
          dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)})
          dispatch(act_getrecipe())
        }
        else if(response.data==='ILLEGAL'){
          dispatch({ type: 'UNAUTH_USER'});
        }
        else{
          dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)})
          dispatch(act_getrecipe())
        }

      })
      .catch((error) => {
        dispatch({ type: 'NET_ERROR'});
      });
    }
    else{
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      axios.post('/api/adddish',data,config)//,config
      .then((response) => {
        //在此根据返回信息做出提示
        switch(response.data){
          case 'OK':
            dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)})
            break
          default:
            dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)})
        }
        dispatch(act_getrecipe())
      })
      .catch((error) => {
        dispatch({ type: 'NET_ERROR'});
      });
    }
    
  };
}
export function act_delrecipe(data) {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'data':data
    }
    axios.post('/api/deldish',newdata)
    .then((response) => {
      if(response.data==='OK'){
          dispatch({type: 'SUCCESS_MSG',msgId:Math.floor(Math.random()*1000)})
          dispatch(act_getrecipe())
        }
        else if(response.data==='ILLEGAL'){
          dispatch({ type: 'UNAUTH_USER'});
        }
        else{
          dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)})
          dispatch(act_getrecipe())
        }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}
export function act_getrecipe() {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user')
    }
    axios.post('/api/getdish',newdata)
    .then((response) => {
      if(response.data instanceof Array){
        dispatch({type: 'SET_RECIPE',data:response.data})
      }
      else{
        // error handle
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}
export function act_getSortRecipe() {
  return function (dispatch) {
    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'action':'sort'
    }
    axios.post('/api/getdish',newdata)
    .then((response) => {
      if(response.data instanceof Object){
        dispatch({type: 'SET_RECIPE_SORT',data:response.data});
      }
      else{
        // error handle
        dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)});
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}


export function act_recipe_reset() {
  return function (dispatch) {
    return dispatch({type: 'RESET_RECIPE'});
  }
}
export function act_recipe_sort(sortType) {
  return function (dispatch) {
    return dispatch({type: 'SORT_RECIPE',payload:sortType});
  }
}
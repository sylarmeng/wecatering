// action
import axios from 'axios';
import {Cookies} from 'react-cookie';
const cookie = new Cookies();

export function act_rpt_lastday(option) {
  return function (dispatch) {

    let newdata = {
      'token':cookie.get('token'),
      'user':cookie.get('user'),
      'option':option
    };
    axios.post('/api/report',newdata)
    .then((response) => {
      if(response.data==='NORECORD'){
        return;
      }
      else if(response.data instanceof Object){
        if(option ==='ld')
          return dispatch({type: 'SET_RPT_LD',data:response.data});
        else
          return dispatch({type: 'SET_RPT_LW',data:response.data});
      }
      else if(response.data==='ILLEGAL'){
        dispatch({ type: 'UNAUTH_USER'});
      }
      else{
        dispatch({type: 'FAIL_MSG',msgId:Math.floor(Math.random()*1000)});
      }
    })
    .catch((error) => {
      dispatch({ type: 'NET_ERROR'});
    });
  };
}

export function act_rpt_reset() {
  return function (dispatch) {
    return dispatch({type: 'RESET_REPORT'});
  };
}
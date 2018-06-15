// import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FORGOT_PASSWORD_REQUEST, RESET_PASSWORD_REQUEST, PROTECTED_TEST } from '../actions/types';
import {Cookies} from 'react-cookie'
const cookie = new Cookies()

const INITIAL_STATE = { user:cookie.get('user'), error: '', message: '', cat: cookie.get('cat'), authenticated: cookie.get('token') ? true : false };
// const INITIAL_STATE = { error: '', message: '', type:'', authenticated: false };
export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'AUTH_USER':
      return { ...state, error: '', message: '', authenticated: true,cat:action.payload.cat,user:action.payload.user};
    case 'UNAUTH_USER':
      return { ...state, authenticated: false, error:'', message: '' };
    case 'AUTH_ERROR':
      return { ...state, error: action.payload };
    case 'NET_ERROR':
      return { ...state, error: 'NET_ERROR' };
    case 'WAITER_REPEAT':
      return { ...state, message: action.payload };
      
    default:
        return state;
  }
}

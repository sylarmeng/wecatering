// reducer
const initialState = {
	'chatid':null,
	'orderRecord':[],
	'reqState':false
};
export default function account(state = initialState, action) {
  switch(action.type) {
	  case 'SET_ACCOUNT':{
	        // return {'chatid':action.payload}
	        let newState = {};
	        newState.chatid = action.payload;
	        newState.orderRecord = state.orderRecord;
	        return newState;
        }
      case 'SET_RECORD':{
      	let newState = {};
        newState.orderRecord = action.payload;
        newState.chatid = state.chatid;
        newState.reqState = false;
        return newState;
      }
      case 'SET_REQ_STATE':{
      	let newState = {};
        newState.orderRecord = state.orderRecord;
        newState.chatid = state.chatid;
        newState.reqState = true;
        return newState;
      }
/*      case case 'RESET_REQ_STATE':{
      	let newState = {};
        newState.orderRecord = action.orderRecord;
        newState.chatid = state.chatid;
        newState.reqState = false;
        return newState;
      }*/
	  default:
	    	return state;
  }
}
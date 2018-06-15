// reducer
const initialState = {};
export default function listReducer(state = initialState, action) {
  switch(action.type) {
	  case 'FETCH_SHOP_ID':
	        return action.payload
	  default:
	    	return state;
  }
}
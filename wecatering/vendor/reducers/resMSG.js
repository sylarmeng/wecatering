
const INITIAL_STATE = {
  msg:null,
  msgId:null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'NET_ERROR':
      return { ...state, msg: '网络故障' };
    case 'CLEAR_MSG':
      // 收到了新的消息，不用清除消息
      if(state.msg===null||action.msgId!==state.msgId)
        return state;
      else
        return { ...state, msg: null};
    case 'SUCCESS_MSG':
      return { ...state, msg: '成功',msgId:action.msgId};  
    case 'FAIL_MSG':
      return { ...state, msg: '失败',msgId:action.msgId}; 
    default:
        return state  
  }
}

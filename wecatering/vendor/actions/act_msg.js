function doClearMsg(MsgId) {
  return {
    type: 'CLEAR_MSG',
    msgId: MsgId
  };
}
export function ClearMsg(MsgId) {
  return dispatch => {
    dispatch(doClearMsg(MsgId));
  };
}


const waiter = (state = [], action) => {
  switch (action.type) {
    case 'SET_WAITER':
      return action.data
    default:
      return state
  }
}

export default waiter
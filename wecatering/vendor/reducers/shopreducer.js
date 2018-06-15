
const initialState = {
  shopstate: []
}

const shopList = (state = initialState.shopstate, action) => {
  switch (action.type) {
    case 'SET_SHOP':
      return action.data
    default:
      return state
  }
}

export default shopList
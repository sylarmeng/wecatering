// reducer-orderhandle
const orderHandle = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return action.dish

    default:
      return state
  }
}

const initialState = {
  addedIds: [],
  quantityById:{},
  category:{}
}

 const addedIds = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ORDER':

      if (state.indexOf(action.dish) !== -1) {
        return state
      }
      return [
        ...state,
        orderHandle(undefined, action)
      ]

    case 'CLEAR_ORDER':
      
      return state.filter(element => element !== action.dish)
    case 'RESET_ORDER':{
      let copy =[]
      return copy
    }
    default:
      return state
  }
}
// set dish category
const category = (state = [], action) => {
  switch (action.type) {
    case 'CATEGORY':
      return action.payload
    default:
      return state
  }
}
const quantityById = (state = initialState.quantityById, action) => {
  switch (action.type) {
    case 'ADD_ORDER':{
      // console.log('add quantityById')
      // console.log(state)
      let productId = action.dish._id
      let value = (state[productId] || 0) + 1
      // console.log(state[productId])
      let newtest ={}
      newtest[action.dish._id] =value
      return Object.assign({},state,newtest)
    }
      /*
      babel-node编译下面语句时会报错
      return { ...state,[productId]: (state[productId] || 0) + 1
      }*/
    case 'DECREASE_ORDER':{
      // console.log('add quantityById')
      let productId = action.dish._id
      let value = state[productId] - 1
      let newtest ={}
      newtest[action.dish._id] =value
      return Object.assign({},state,newtest)
    }
    case 'CLEAR_ORDER':{
      let copy = Object.assign({}, state) // assuming you use Object.assign() polyfill!
      delete copy[action.dish._id] // shallowly mutating a shallow copy is fine
      return copy
    }
    case 'RESET_ORDER':{
      let copy ={}
      return copy
    }
    default:
      return state
  }
}

export const getQuantity = (state, productId) =>
  state.quantityById[productId] || 0

export const getAddedIds = state => state.addedIds


const orderList = (state = initialState, action) => {
  switch (action.type) {

    default:
      return {
        addedIds: addedIds(state.addedIds, action),
        quantityById: quantityById(state.quantityById, action),
        category: category(state.category, action)
      }
  }
}

export default orderList
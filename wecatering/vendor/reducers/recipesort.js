/*
const initialState = {
  recipestate: []
}
*/
// 菜单的state中需要加入分页状态，
// state中需要包含的内容：当前分页，菜单列表
// import sortBy from 'lodash.sortby'
const recipeSort = (state = {}, action) => {

  switch (action.type) {
    case 'SET_RECIPE_SORT':
      return action.data;
        
    default:
      	return state;
  }
}

export default recipeSort;
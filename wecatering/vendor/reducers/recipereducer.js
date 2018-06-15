/*
const initialState = {
  recipestate: []
}
*/
// 菜单的state中需要加入分页状态，
// state中需要包含的内容：当前分页，菜单列表
// import sortBy from 'lodash.sortby'
const recipeList = (state = [], action) => {

  switch (action.type) {
    case 'SET_RECIPE':
      return action.data

  	case 'RESET_RECIPE':
    	 state=null
      	return []
    case 'SORT_RECIPE':{
        let newMenulist = state.map(a => Object.assign({}, a));

        if(action.payload.sortDishType==0){
          newMenulist.sort(function(param1,param2){
            if(action.payload.sortDishUp==1){
              return param1._id>param2._id;
            }
            else{
              return param1._id<param2._id;
            }
          });
        }
        if(action.payload.sortDishType==1){
          newMenulist.sort(function(param1,param2){
            if(action.payload.sortDishUp==1){
              return (param1.category).localeCompare(param2.category);
            }
            else{
              return -(param1.category).localeCompare(param2.category);
            }
          });
        }
        if(action.payload.sortDishType==2){
          newMenulist.sort(function(param1,param2){
            if(action.payload.sortDishUp==1){
              return (param1.title).localeCompare(param2.title);
            }
            else{
              return -(param1.title).localeCompare(param2.title);
            }
          });
        }
        
      return newMenulist;
    }
        
    default:
      	return state
  }
}

export default recipeList
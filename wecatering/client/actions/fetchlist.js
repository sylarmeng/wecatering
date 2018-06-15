// action
import axios from 'axios'

export function fetchList(shopid) {
  return (dispatch) => {

    return axios.get("/api/listmenu/"+shopid)
      .then(res => (res.data))
      .then(data =>{

          if(data.menulist instanceof Array){
            dispatch({ type: 'FETCH_LIST_SUCCESS', payload: data.menulist})
            dispatch({ type: 'FETCH_SHOP_ID', payload: data.shop_id})

            dispatch({ type: 'CATEGORY', payload: data.cateCount})
            return
          }
          // 此处要添加错误处理提示
      })
      .catch((error) => {

      });
    }
  }

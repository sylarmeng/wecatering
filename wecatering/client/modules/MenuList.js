import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchList} from '../actions/fetchlist'
import { doAdd,doDecrease} from '../actions/act_order'

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

const rowbackground = {backgroundColor: '#F16E10'}

class Home extends React.Component{
  constructor(props) {
        super(props);
        /*this.state={
          showImage:false,
          imageId:null
        }
        this.toggleImg = this.toggleImg.bind(this)*/
        this.toggleImage = this.toggleImage.bind(this)
    }

  componentWillMount() {
    this.props.fetchList(this.props.shopid)
  }
  componentDidMount() {
    // this.props.fetchList()
  }

  toggleImage(event){
    /*this.setState({
      showImage:!this.state.showImage,
      imageId:event.target.id
    })*/
    this.props.toggleImg(event)
  }

  render() {
    return(
      <div>
      {this.props.menu.length>0?
        this.props.menu.map((dish,index) =>
          {
            return(
              <Row className ='dishinline' >
              {this.props.category[dish.category]==index&&
                    <a name={dish.category}></a>}
              <Col>
                <li key={dish._id}>
                  <div className='dishContainer'>

                  <div className='dishImg'>
                    <img src={dish.sampleImage?'/static/img/'+dish.sampleImage:'/static/img/100.jpg'} 
                      height="80" width="80"
                      id={dish.fullImage}
                      onClick={this.toggleImage}/>
                      {!dish.fullImage?
                        <span className="tooltiptext">暂无大图</span>
                        :
                        <span></span>
                      }
                  </div>

                  <div className='dishContent'>
                  <div>{dish.title}</div>
                  <div>{dish.price}/份</div>
                  
                  </div>

                  <div className='dishSelect'>
                  <button className ='btn btn-default plusBtn pull-right dishclickBtn' 
                    onClick={()=>this.props.doAdd(dish)}>+</button>

                    <span className="c-m-count pull-right">{this.props.quantityById[dish._id]}</span>
                  <span className ="dishclickBtnAct">
                  {
                    this.props.quantityById[dish._id]>0 &&
                    <button className ='btn btn-default minusBtn pull-right dishclickBtn '
                      onClick={()=>this.props.doDecrease(dish,this.props.quantityById[dish._id])}
                      disabled={this.props.quantityById[dish._id]>0? false : true}>-</button>
                  }
                  </span>
                  </div>

                  </div>
                  </li>
                  </Col>
                  
                </Row> 
            )
          }
        )
        :
        
        <div className="loader">正在更新菜单···</div>
      }
      <div className='paddingFoot'></div>
      </div>
    )
  }
}
// <h3>正在更新菜单</h3>
//{()=>this.props.doAdd(dish)}
Home.propTypes = {
  fetchList: PropTypes.func.isRequired,
  doAdd: PropTypes.func.isRequired,
  doDecrease:PropTypes.func.isRequired

}

const mapStateToProps = (state) => ({
  menu: state.menu,
  quantityById: state.orderlist.quantityById,
  category: state.orderlist.category
})


const mapDispatchToProps =(dispatch)=> {
  return {
  doAdd:  (dish) => dispatch(doAdd(dish)),
  doDecrease:(dish,count) => dispatch(doDecrease(dish,count)),
  fetchList: (shopid) => dispatch(fetchList(shopid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

// 直接传递函数的使用方式
// export default connect(mapStateToProps, {fetchList})(Home)
//有多个触发函数时，建议使用下面的传递方式

//下面的写法也是正确的
/*const mapDispatchToProps = (dispatch) => {
  return { 
    fetchList: () => dispatch(fetchList()),
    doAdd: () => dispatch(doAdd())
  }
}*/


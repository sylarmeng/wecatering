import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import chunk from 'lodash.chunk';
import { Grid, Row, Col ,Button, Badge,OverlayTrigger,Tooltip} from 'react-bootstrap';

import {act_getSortRecipe} from '../../actions/act_recipe';
import {doAdd, doDecrease, SubmitOrder} from '../../actions/act_order';
import {act_getshop} from '../../actions/act_shop';

class Order extends React.Component{
  constructor(props) {
    super(props)
      this.state = {
        currentCat: "主食"
    };
    this.selCat=this.selCat.bind(this);
    this.addOrder=this.addOrder.bind(this);
    this.delOrder=this.delOrder.bind(this);

    this.handleSubmit=this.handleSubmit.bind(this);
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentWillMount() {
    if (this.props.auth.authenticated){

      /*if(this.props.auth.cat=='1'){
        let { dispatch } = this.props;
        dispatch(act_getSortRecipe());
        dispatch(act_getshop());
      }
      else{
        this.props.router.push('/shop/admin');
      }*/
      let { dispatch } = this.props;
      dispatch(act_getSortRecipe());
      dispatch(act_getshop());
    }
    else{
      this.props.router.push('/shop/signin');
    }
  }
  componentDidMount() {
  }
  selCat(event) {
    // console.log(event.target.name);
    this.setState({currentCat:event.target.name});
  }

  delOrder(event){
    let cate =this.state.currentCat;
    let currentRecipe = this.props.recipesort[cate];
    let selRecipe = currentRecipe[event.target.name];
    let count = this.props.quantityById[selRecipe._id];
    this.props.dispatch(doDecrease(selRecipe,count));
  }
  addOrder(event){
    let cate =this.state.currentCat;
    let currentRecipe = this.props.recipesort[cate];
    let selRecipe = currentRecipe[event.target.name];
    this.props.dispatch(doAdd(selRecipe));
  }
  handleSubmit(event) {
    event.preventDefault();
    let quantity = this.props.quantityById;
    //新建一个订单ID对象数组
    let products = this.props.addedIds.map(a => Object.assign({}, a));

    products.map(function(dish){
      dish.item = dish._id;
      dish.quantity = quantity[dish._id];
      delete dish._id;
      dish.complete = 0;
      dish.status = false;
    });

    let order={};
    // 使用服务器端生成uuid，减小客户端体积
    // order.id = uuid.v1();
    order.products = products;
    //单独计算总价
    order.totalprice = this.props.addedIds
                        .reduce((total, dish) =>
                          total + dish.price * (quantity[dish._id] || 0),
                          0)
                        .toFixed(1);
     
    order.ordertime = new Date();
    // 设置店铺ID
    order.shop = this.props.shoplist[0]._id;
    // 手动输入桌号
    // order.tableNo = this.props.tableNo
    order.tableNo = 0;
    // 订单接收状态
    order.acked = 0;
    let orderCompose ={};
    orderCompose.order =order;
    // 使用单独请求获取的shop _id
    // shopid为用户的roomid，即手机号，仅用来做实时通信
    orderCompose.shopid = this.props.auth.user;
    this.props.dispatch(SubmitOrder(orderCompose));
  }
  render() {
    // console.log(this.props.quantityById);
    const tooltip = (
      <Tooltip id="tooltip">请先接收</Tooltip>
    )
    const tooltipNone = (
      <Tooltip id="tooltip" className='tooltipNone'></Tooltip>
    )
    const catelog=Object.keys(this.props.recipesort);
    const cate =this.state.currentCat;
    const currentRecipe = this.props.recipesort[cate];
    const qtyList = this.props.quantityById;
    const totalPrice = this.props.addedIds
                        .reduce((total, dish) =>
                          total + dish.price * (qtyList[dish._id] || 0),
                          0)
                        .toFixed(1);

    return (
        
          <Grid fluid={true} className="o-container">
            
            <Row className="o-row">
              <Col md={2}  sm={2}>
                <div className="o-title-cat">
                  <span>选择类别</span>
                </div>
                <div id="o-category">
                  {
                    catelog.map((item,index)=>{
                      return(
                        <div>
                          <button className="btn btn-default"
                            name={item} 
                            
                            onClick={this.selCat}>{item}</button>
                        </div>
                      )
                    })
                  }
                </div>
              </Col>
              <Col md={6} sm={6} id="o-recipe-col">
                <div>
                  <div className="o-title-dish">
                    <span>分类菜单 |{cate}</span>
                  </div>
                {
                  currentRecipe?
                  currentRecipe.map((item,index)=>{
                    return(
                        <Row className="o-recipeline">
                          <Col md={3} sm={3} xs={3}>
                          <div className="o-recipetitle">{item.title}</div>
                          </Col>
                          <Col md={3} sm={3} xs={3}>
                          <div>{item.price}元/份</div>
                          </Col>
                          <Col md={2} sm={3} xs={3}>
                          {
                            this.props.quantityById[item._id]>0 &&
                            <button className ='btn btn-default minusBtn dishclickBtn' 
                              name={index}
                              onClick={this.delOrder}>-</button>
                          }
                          </Col>
                          <Col md={2} sm={3} xs={3}>
                            <button className ='btn btn-default plusBtn dishclickBtn' 
                              name={index}
                              onClick={this.addOrder}>+</button>
                          </Col>
                        </Row>
                      )
                  })
                  :null
                }
                </div>
              </Col>

              <Col md={4} sm={4}>
                
                  <div className="o-title-sel">
                    <span>
                      已选菜单
                    </span>
                  </div>
                
                <div id="o-orderlist">
                <table>
                  <tr>
                    <th>序号</th>
                    <th>菜品</th>
                    <th>价格</th>
                    <th>数量</th>
                  </tr>
  

                {
                  this.props.addedIds.map((dish, index)=>{
                    return(
                      <tr>
                        <td>{index+1}</td>
                        <td>{dish.title}</td>
                        <td>{dish.price}/份</td>
                        <td>{this.props.quantityById[dish._id]}</td>
                      </tr>
                      )
                    })
                }
                </table>
                </div>
                <div className="o-title-price">
                  <span>
                    总价：{totalPrice}
                  </span>
                </div>
                <div className="o-title-submit">
                  <button className="btn btn-default" onClick={this.handleSubmit}
                disabled={Object.keys(this.props.quantityById).length? false : true}
            >提交</button>
                </div>
              </Col>


            </Row>
          </Grid>
        
        )
  }
}

const mapStateToProps = (state) => ({
  recipesort: state.recipesort,
  addedIds: state.addedIds,
  quantityById: state.quantityById,
  shoplist: state.shoplist,
  auth: state.auth
})
export default connect(mapStateToProps)(Order)

/*
<li key={dish._id} className="listCartItem">
                        <div>
                        <span className='scDishIndex'>
                            {index+1}
                        </span>

                        <span className='scDishTitle'>
                            {dish.title}
                        </span>
                        <span className='scDishPrice'>
                          {dish.price}
                        </span>
                        <span className='scDishCount'>
                          份数x{this.props.quantityById[dish._id]}
                        </span>
                                  
                        </div>
                      </li>
 */
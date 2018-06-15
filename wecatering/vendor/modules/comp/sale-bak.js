import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import chunk from 'lodash.chunk'
import {Cookies} from 'react-cookie'
const cookie = new Cookies()

import { Grid, Row, Col ,Button, Badge,OverlayTrigger,Tooltip} from 'react-bootstrap'
import Pagination from "./page/Pagination"
import {act_sale_update, act_getsale_today, act_sale_statusChange,act_sale_peerChange} from '../../actions/act_sale'

import PrintTicket from './PrintTicket'
const undo = {backgroundColor: '#00a9e5'}
const done = {backgroundColor: '#FFFFFF'}
// style ={product.status?done:undo}
// style ={(product.complete===product.quantity)?done:undo}

// const undo = {backgroundColor: '#ff9999'}
// const done = {backgroundColor: '#ccffcc'}
// const socket = io.connect('http://localhost:3001')
// const socket = io.connect('http://192.168.0.101:3001')
class Sale extends React.Component{
  constructor(props) {
    super(props)
      this.state = {
        room: null,
        activePage: 1,
        printFlag:false,
        order:null
    }

    this.handleStatus=this.handleStatus.bind(this)
    this.handlePageChange=this.handlePageChange.bind(this)
    this.showPrint=this.showPrint.bind(this)
    this.closePrint=this.closePrint.bind(this)
    
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  //即将mount时，核对权限状态
  componentWillMount() {
    // console.log('M')
    if (this.props.auth.authenticated){
      let { dispatch } = this.props
      // 首次获取第一页
      dispatch(act_getsale_today('0',0))
    }
    else{
      this.props.router.push('/shop/signin')
    }
  }
  
  componentDidMount() {
    // const socket = io.connect('http://localhost:3001')
    // const socket = io.connect('http://192.168.0.102:3001')
    const socket = io.connect('http://118.89.30.214:3001')
    let { dispatch} = this.props
    let room = cookie.get('user')
    let that =this
    // socket.emit('room',room);

    socket.on('neworder', function(data) {
      let index = that.props.salelist.reduce(function(searchIndex, item, index){
            if(item.id == data.id) { 
              searchIndex = index;
            }
            return searchIndex;
          }, null);
      if(index!==null){
        // console.log('R')
        // that.props.router.push('/shop/admin')
        window.location.href = '/shop/admin'
      }
      else{
        if(that.state.activePage!==1){
          // 如果不在首页，则重新获取本页数据
          dispatch(act_getsale_today('0',that.state.activePage-1))
        }
        else{
          // console.log('rev new order')
          dispatch(act_sale_update(data))
          socket.emit('ack', 'receive ok!')
        }
      }
      
    })
    //mount之后建立socket连接，发送自身ID,处理接收订单
    //小号也会发送自己的room，但最终它加入的是主号的room
    socket.on('reqroom', function(data) {
      socket.emit('room',room)
    })

    socket.on('resetRoom', function(data) {
      // console.log('reset room!')
      that.setState({'room':data})
    })
    socket.on('disconnected', function() {
    // console.log('disconnect!')
    })
    // 来自peer的状态更改申请
    socket.on('revChange',function(data) {
      if(data.from!==room){
        dispatch(act_sale_peerChange(data))
      }
      /*else{
        console.log('its send from my self')
      }*/
    })
    // 暂时屏蔽这个方法，太耗资源
    socket.on('clientUpdate', function() {
      // console.log('rec update')
      //收到更新提示，重新获取数据，
      //last order and not at first page
      if(that.props.salelist.length==1&&that.state.activePage>1){
        let activePage =that.state.activePage
        dispatch(act_getsale_today('0',that.state.activePage-2))
        that.setState({activePage: activePage-1});
      }
      else{
        dispatch(act_getsale_today('0',that.state.activePage-1))
      }
    })
  }

  // 以下需要修改只传递订单的INDEX,ID,PRODUCTINDEX,VARIANT
  handleStatus(event) {
    event.preventDefault()
    // 注意：在订单列表显示前，做了倒序排列
    // trick-- use attribute to pass parameter
    let orderIndex = event.target.id
    let product_index = event.target.value
    let order = this.props.salelist[orderIndex]
    // 最简数据 orderId productIndex action param
    let order2change={}
    // 注意，使用id而不是_id
    order2change.orderId=this.props.salelist[orderIndex].id
    order2change.product_index = product_index
    order2change.action = event.target.name

    let room = cookie.get('user')
    order2change.from=room
    order2change.to=this.state.room

    // 注意简化代码，服务端要增加代码，action、reducer相应做调整
    if(event.target.name =='acked'){
      order2change.param =null
      order2change.orderIndex = orderIndex
      this.props.dispatch(act_sale_statusChange(order2change))
      return
    }
    if(event.target.name =='cancel'){
      order2change.param =null
      order2change.orderIndex = orderIndex
      order2change.page = this.state.activePage
      this.props.dispatch(act_sale_statusChange(order2change))
      return
    }
    // 这里应该检查是否所有的菜都已完成
    // 注意新接收的订单没有complete属性
    if(event.target.name =='checked'){
      let status = order.products.reduce((flag, item) =>
        flag&&(item.quantity==item.complete),
        1
      )
      if(status){
        order2change.param =null
        order2change.orderIndex = orderIndex
        order2change.page = this.state.activePage
        this.props.dispatch(act_sale_statusChange(order2change))
        // return
      }
    }
    if(event.target.name =='complete'&&!order.products[product_index].status){
      return
    }

    if(event.target.name =='complete'&&(order.products[product_index].complete<order.products[product_index].quantity)){
      order2change.param = order.products[product_index].complete+1
      order2change.itemId =order.products[order2change.product_index].item

      this.props.dispatch(act_sale_statusChange(order2change))
      // return
    }
    if(event.target.name =='status'&&order.products[product_index].status==false){
      order2change.param = null
      order2change.itemId =order.products[order2change.product_index].item
      this.props.dispatch(act_sale_statusChange(order2change))
      // return
    }

  }

  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
    let { dispatch } = this.props
    dispatch(act_getsale_today('0',pageNumber-1))
  }
  closePrint(event){
    this.setState({
      printFlag:false
    })
  }
  showPrint(event){
    this.setState({
      printFlag:true,
      order:this.props.salelist[event.target.id]
    })
    // console.log(this.props.salelist[event.target.id])
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">请先接收</Tooltip>
    )
    const tooltipNone = (
      <Tooltip id="tooltip" className='tooltipNone'></Tooltip>
    )
    // chunk(this.props.salelist.slice(0).reverse(),3).map(
    // id={this.props.salelist.length-index-indexArray*3-1}
    // 第{this.props.salelist.length-index-indexArray*3}份订单
    return (
        <div>
          <div className="noprint allWrapper">
          <h4>当前订单总数{this.props.orderMisc.count}--每页显示20份订单（底部翻页）
          </h4>
          
          <Grid>
            <Row className="showSale">
            {
              chunk(this.props.salelist.slice(0),3).map(
                (orderArray,indexArray) =>{
                  return(
                    <div className='row orderArray'>
                      {
                        orderArray.map(
                          (order,index) =>{
                            return(
                              
                              <Col md={4} className="orderBox">
                              <h4>
                                <Badge className="tableBadge">{order.tableNo}桌</Badge>
                                {
                                  order.acked===1?
                                  <span>
                                    <Button bsStyle="default" name='print' 
                                    id={index+indexArray*3}
                                    className="printBtn" 
                                    onClick={this.showPrint}>打印
                                  </Button>
                                  <Button bsStyle="default" name='checked' 
                                    id={index+indexArray*3}
                                    value=''
                                    className="pull-right" 
                                    onClick={this.handleStatus}>{order.checked?'已结':'结算'}
                                  </Button>
                                  </span>
                                  :
                                  <span>
                                    <Button bsStyle="default" name='acked' 
                                    id={index+indexArray*3}
                                    className="printBtn ackBtn" 
                                    onClick={this.handleStatus}>接收
                                  </Button>
                                  <Button bsStyle="default" name='cancel' 
                                    id={index+indexArray*3}
                                    value=''
                                    className="pull-right"
                                    onClick={this.handleStatus}>取消
                                  </Button>
                                  </span>
                                }
                                
                              </h4>
                              <h5>第{this.props.orderMisc.count- 20*(this.state.activePage-1) -index-indexArray*3}份订单,
                                金额{order.totalprice},
                                下单时间
                                {((new Date(order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
                              </h5>
                                {
                                  order.products.map((product,index_p)=>{

                                    return(
                                      <div >
                                      <Row className='orderline'>

                                      <Col md={4} sm={4} xs={4}>
                                        {product.title} &nbsp;&nbsp;&nbsp;x{product.quantity}
                                      </Col>

                                      <Col md={4} sm={4} xs={4}>

                                        {
                                          order.acked===1?
                                          <Button bsStyle="default" name='status'
                                            id={index+indexArray*3}
                                            value={index_p}

                                            className={product.status?"doneButton":"undoButton"}
                                          onClick={this.handleStatus}>
                                          {product.status?'已接':'接收'}
                                          </Button>
                                          :null
                                        }
                                        
                                      </Col>

                                      <Col md={4} sm={4} xs={4}>
                                        {
                                          order.acked===1?
                                          <OverlayTrigger placement="top" overlay={product.status?tooltipNone:tooltip}>
                                          <Button bsStyle="default" 
                                            className={(product.complete===product.quantity)?"doneButton":"undoButton"}
                                            ref="target" name='complete'
                                            id={index+indexArray*3}
                                            value={index_p}
                                            
                                            onClick={this.handleStatus}>
                                            {product.complete==undefined||product.complete==0?'上桌':'已上 '+product.complete}
                                          </Button>
                                          </OverlayTrigger>
                                          :null
                                        }
                                          
                                      </Col>
                                      
                                      </Row>
                                      </div>
                                      )}
                                )}
                              </Col>
                              
                            )
                          }
                          )
                      }
                      <Row className="occupy"></Row> 
                    </div>

                    )
                }
              )
            }
          </Row>
          </Grid>
          <Grid>
          <Row>
          <h4>
          {
            this.props.orderMisc.count>20&&
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={20}
              totalItemsCount={this.props.orderMisc.count}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}/>
          }
             
          </h4> 
          </Row>
          </Grid>

          </div>
          {
            this.state.printFlag?
            <div className="PrintTicket">
            <PrintTicket 
              order={this.state.order} 
              showPrint={this.closePrint}
              router={this.props.router}/>
            </div>
            :
            null
          }
          
        </div>
        )
  }
}


const mapStateToProps = (state) => ({
  salelist: state.salelist,
  orderMisc: state.orderMisc,
  auth: state.auth
})
export default connect(mapStateToProps)(Sale)

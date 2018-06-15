import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import chunk from 'lodash.chunk'
import { Grid, Row, Col ,Button,OverlayTrigger,Tooltip} from 'react-bootstrap'
import {act_sale_update, act_getsale_today, act_sale_statusChange} from '../../actions/act_sale'
import Pagination from "./page/Pagination"

const undo = {backgroundColor: '#ff9999'}
const done = {backgroundColor: '#ccffcc'}

class Checked extends React.Component{
  constructor(props) {
    super(props)
      this.state = {
        activePage: 1
    }
    this.handlePageChange=this.handlePageChange.bind(this)
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentWillMount() {
    if (this.props.auth.authenticated){
      let { dispatch } = this.props
      dispatch(act_getsale_today('1'))
    }
    else{
      this.props.router.push('/shop/signin')
    }
  }
  componentDidMount() {
  }
    handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
    let { dispatch } = this.props
    dispatch(act_getsale_today('1',pageNumber-1))
  }

  render() {
    // console.log(this.props)
    const tooltip = (
      <Tooltip id="tooltip">请先接收</Tooltip>
    )
    const tooltipNone = (
      <Tooltip id="tooltip" className='tooltipNone'></Tooltip>
    )
    // {this.props.finishlist.length-index-indexArray*3}
    return (
        <div>
          
          <Grid fluid={true}>
            <Row className="show-grid ">
            <div className="f-line">
              <h4>已结订单</h4>
            </div>
            
            {
              chunk(this.props.finishlist.slice(0),3).map(
                (orderArray,indexArray) =>{
                  return(
                    <div className='row orderArray'>
                      {
                        orderArray.map(
                          (order,index) =>{
                            return(
                              
                              <Col md={4} className="orderBox">
                                <table className="tbChild">
                                  <thead>
                                  <tr>
                                    <td>
                                      <div className="tableBadge">
                                        <span className="s-table">{order.tableNo}桌</span>
                                      </div>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>

                                    {
                                      order.acked===1?
                                      <td>
                                      <span bsStyle="default" name='checked' 
                                        id={index+indexArray*3}
                                        value=''
                                        >{order.checked?'已结':'结算'}
                                      </span>
                                      </td>
                                      :
                                      <td>
                                      <span bsStyle="default" name='cancel' 
                                        id={index+indexArray*3}
                                        value=''
                                        >取消
                                      </span>
                                      </td>
                                    }
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr>
                                    <td>订单{this.props.orderMisc.count- 20*(this.state.activePage-1) -index-indexArray*3}
   
                                    </td>
                                    <td>
                                    金额{order.totalprice}
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    {((new Date(order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
                                    </td>
                                  </tr>

                                    {
                                      order.products.map((product,index_p)=>{

                                        return(
                                          <tr >
                                            <td>
                                              {product.title}
                                            </td>
                                            <td>
                                              x{product.quantity}
                                            </td>
                                          <td>
                                          </td>
                                          <td>
                                          </td>
                                          </tr>
                                          )}
                                    )}
                                  </tbody>
                                </table>
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
          <Grid fluid={true}>
            <Row>
              <h4>
              {
                this.props.orderMisc.finished>20&&
                 <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={20}
                  totalItemsCount={this.props.orderMisc.finished}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange}/>
                }
              </h4> 
            </Row>
          </Grid>
        </div>
        )
  }
}

const mapStateToProps = (state) => ({
  finishlist: state.finishlist,
  orderMisc: state.orderMisc,
  auth: state.auth
})
export default connect(mapStateToProps)(Checked)

/*
<Grid fluid={true}>
            <Row className="show-grid ">
            {
              chunk(this.props.finishlist.slice(0),3).map(
                (orderArray,indexArray) =>{
                  return(
                    <div className='row orderArray'>
                      {
                        orderArray.map(
                          (order,index) =>{
                            return(
                              
                              <Col md={4} className="orderBox">
                              <h4><Badge>{order.tableNo}桌</Badge>
                                  <Button bsStyle="default" name='checked' className="pull-right">已结</Button>
                              </h4>
                              <h5>第{this.props.orderMisc.finished- 20*(this.state.activePage-1) -index-indexArray*3}份订单,
                              
                                金额{order.totalprice},
                                下单时间
                                {((new Date(order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
                              </h5>
                                {
                                  order.products.map((product,index_p)=>{

                                    return(
                                      <div >
                                      <Row className='orderline'>
                                      <Col md={4} sm={4}>
                                        {product.title} &nbsp;&nbsp;&nbsp;x{product.quantity}
                                      </Col>

                                      <Col md={4} sm={4}>
                                      </Col>
                                      <Col md={4} sm={4}>
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
 */
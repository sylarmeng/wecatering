import React from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Grid, Row, Col ,Button} from 'react-bootstrap'

import AddCanteen from './canteen_add'
import EditShop from './canteen_edit'
import AddWaiter from './waiter_add'

import {act_getshop,act_delwaiter} from '../../actions/act_shop'
import Msg from './Msg'
const styleRequired = {
  color: "#ffaaaa"
}

class Canteen extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
        showForm: false,
        showEdit: false,
        showEditObj: {},
        editshop: {},
        waiterForm: false,

    }
    this.toggleWaiterForm =this.toggleWaiterForm.bind(this)
    this.delWaiter =this.delWaiter.bind(this)
    this.toggleForm =this.toggleForm.bind(this)
    this.toggleEdit =this.toggleEdit.bind(this)
    this.handleEdit =this.handleEdit.bind(this)
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentDidMount() {
  }
  componentWillMount() {

    if (this.props.auth.authenticated){
      if(this.props.auth.cat=='1'){
        let { dispatch } = this.props
        dispatch(act_getshop())
      }
      else{
        this.props.router.push('/shop/admin')
      }
    }
    else{
      this.props.router.push('/shop/signin')
    }
  }

  toggleWaiterForm(event) {
    event.preventDefault();
    this.setState({waiterForm:!this.state.waiterForm});
  }

  delWaiter(event){
    event.preventDefault();
    
    let data ={}
    data._id = event.target.id
    data.action ='del'
    this.props.dispatch(act_delwaiter(data))
    // console.log('delete'+event.target.id)
  }
  //暂时关闭添加店铺功能，做账户功能划分
  toggleForm(event) {
    event.preventDefault();
    // this.setState({showForm:!this.state.showForm});
  }

  toggleEdit(event) {
    event.preventDefault();
    this.setState({showEdit:!this.state.showEdit});

    let newObj ={}
    newObj[event.target.id] =false
    Object.assign(this.state.showEditObj,newObj)
  }
  //这是toggle shop编辑form，原来有一个人可以编辑多家店，所以写成了下面的逻辑
  handleEdit(event) {
    event.preventDefault();
    //现在一个人只有一家店，所以直接取index 0，多店需要修改逻辑
    //多个店铺时，最简单的判别编辑对象的方法是传递index
    let shop =this.props.shoplist[0]
    // console.log(shop)
    let newObj ={}
    if(this.state.showEditObj[shop.id]){
      // 已经显示了，就把显示属性设置为false（关闭）
      newObj[event.target.id] =false
      Object.assign(this.state.showEditObj,newObj)
    }
    else{
      // 未显示，就把显示属性设置为true（显示）
      newObj[event.target.id] =true
      Object.assign(this.state.showEditObj,newObj)
    }

    this.setState({editshop:shop})
    // 不可以使用全局唯一的状态，否则所有组件会同时显示或关闭，
    // 放在这里只是为了使dom自动渲染，否则点击编辑框，组件不隐藏
    this.setState({showEdit:!this.state.showEdit});
  }
  render() {
      // console.log(this.props)
    return (

        <div>

          <Grid fluid={true}>
            <Row className="c-content">
            <div className="f-line">
              <h4>账户信息</h4>
            </div>
                <div>
                      <Row className="show-grid">
                        <Col md={6}>
                        <div className="shopcard">
                          <Row className='accountDetail'>

                          <p className='detailItem'>
                          <Col xs={6} sm={6} md={4}>
                            账户手机:
                          </Col>
                          <Col xs={6} sm={6} md={8}>
                            {this.props.boss.mobile}
                          </Col>
                          </p>

                          </Row>                            
                            
                          <Row className='canteenEditBtn'>
                            
                            <Col xs={4} sm={4} md={4}>
                              <Button bsStyle="success" disabled={this.props.waiter.length>2?'true':''} onClick={this.toggleWaiterForm}>添加小号</Button>
                            </Col>
                            <Col xs={4} sm={4} md={4}>
                            </Col>
                            
                          </Row>

                          <Row className='waiterList'>
                           { this.props.waiter.map((waiterItem,index)=>{
                              return(
                                <p className='detailItem'>
                                <Col xs={4} sm={4} md={4}>
                                  小号--{index+1}
                                </Col>
                                <Col xs={4} sm={4} md={4}>
                                  {waiterItem.name}
                                </Col>
                                <Col xs={4} sm={4} md={4}>
                                  <Button className="b-danger" id={waiterItem._id} onClick={this.delWaiter}>删除小号</Button>
                                </Col>
                                </p>
                              )
                            })
                          }
                          </Row>

                        </div>
                        </Col>

                          <div>
                            <Col>
                             {this.state.waiterForm&& <AddWaiter toggleWaiter={this.toggleWaiterForm}/>}
                            </Col>
                          </div>
                        </Row>
                      </div>

            </Row>
          </Grid>
          <Grid fluid={true}>
            <Row className="c-content">
            
            <div className="f-line">
              <h4>餐厅信息</h4>
            </div>
              
                {this.props.shoplist.map(shop =>
                  {
                    return(
                      <div>
                      <Row className="show-grid">
                        <Col md={6}>
                        <div className="shopcard">
                          <Row className='canteenDetail'>


                          <p className='detailItem'>
                          <Col xs={6} sm={6} md={4}>
                            餐厅名称：
                          </Col>
                          <Col xs={6} sm={6} md={8}>
                            {shop.name}
                          </Col>
                          </p>

                          <p className='detailItem'>
                          <Col xs={6} sm={6} md={4}>
                            营业时间：
                          </Col>
                          <Col xs={6} sm={6} md={8}>
                            {parseInt(shop.opentime_start/3600)}时{(shop.opentime_start%3600)/60}分
                            ----
                            {parseInt(shop.opentime_end/3600)}时{(shop.opentime_end%3600)/60}分
                          </Col>
                          </p>

                          <p className='detailItem'>
                          <Col xs={6} sm={6} md={4}>
                            餐桌数：
                          </Col>
                          <Col xs={6} sm={6} md={8}>
                            {shop.tables}
                          </Col>
                          </p>

                          <p className='detailItem'>
                          <Col xs={6} sm={6} md={4}>
                            餐位数:
                          </Col>
                          <Col xs={6} sm={6} md={8}>
                            {shop.seats}
                          </Col>
                          </p>

                          <p className='detailItem'>
                            <Col xs={6} sm={6} md={4}>
                              地址:
                            </Col>
                            <Col xs={6} sm={6} md={8}>
                              {shop.addr}
                            </Col>
                          </p>
                          </Row>
                          <Row className='canteenEditBtn'>
                            <Col xs={4} sm={4} md={4}>
                              <Button bsStyle="success" id={shop.id} onClick={this.handleEdit}>编辑餐厅</Button>
                            </Col>
                            <Col xs={4} sm={4} md={4}>
                              
                            </Col>
                            
                          </Row>
                          

                        </div>
                        </Col>

                          <div>
                            <Col>
                             {this.state.showEditObj[shop.id] && < EditShop shop = {this.state.editshop} toggleEdit={this.toggleEdit}/>}
                            </Col>
                          </div>
                        </Row>
                      </div>
                    )
                  }
                )}

            </Row>
          </Grid>
          <Msg/>
        </div>
        )
  }
}

const mapStateToProps = (state) => ({
  shoplist: state.shoplist,
  boss: state.boss,
  waiter:state.waiter,
  auth: state.auth
})
export default connect(mapStateToProps)(Canteen)

/*
<Button bsStyle="default" disabled='true' >绑定微信</Button>
<Button bsStyle="default" disabled='true' >更改手机</Button>

 */

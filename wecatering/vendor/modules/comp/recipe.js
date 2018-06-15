import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid, Row, Col ,Button} from 'react-bootstrap'
import { Nav,NavItem} from 'react-bootstrap'

import { List }  from "immutable";

import AddRecipe from './recipe_add'
import EditRecipe from './recipe_edit'
import EditImg from './imgedit'
import {act_getshop} from '../../actions/act_shop'
import {act_getrecipe,act_delrecipe,act_recipe_reset,act_recipe_sort} from '../../actions/act_recipe'

import Msg from './Msg'
class Recipe extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        showForm: false,
        showEdit: false,
        showEditObj: {},
        editshop: {},
        isOpen: false,
        dishid:'',
        sortDishType:0,
        sortDishUp:0
      };
      this.toggleForm = this.toggleForm.bind(this)
      this.toggleEdit = this.toggleEdit.bind(this)
      this.handleDel = this.handleDel.bind(this)
      this.handleEdit = this.handleEdit.bind(this)
      this.toggleModal = this.toggleModal.bind(this)
      this.handleSort = this.handleSort.bind(this)
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
        dispatch(act_getrecipe())
      }
      else{
        this.props.router.push('/shop/admin')
      }
    }
    else{
      this.props.router.push('/shop/signin')
    }
  }
  componentWillUnmount(){
    this.props.dispatch(act_recipe_reset())
  }

  toggleForm(event) {
    event.preventDefault();
    this.setState({showForm:!this.state.showForm});
    // 打开添加时，关闭编辑
    let newObj ={}
    this.setState({'showEditObj':newObj});
  }
  toggleEdit(event) {
    // 注意：并没有用到showEdit
    event.preventDefault();
    this.setState({showEdit:!this.state.showEdit});

    let newObj ={}
    newObj[event.target.id] =false
    Object.assign(this.state.showEditObj,newObj)
  }

  handleEdit(event) {
    event.preventDefault()
    // 打开编辑时，关闭添加
    this.setState({showForm:false});

    let index = event.target.name
    let dish = this.props.recipelist[index]
    let newObj ={}
    if(this.state.showEditObj[dish.id]){
      
      newObj[event.target.id] =false
      Object.assign(this.state.showEditObj,newObj)
      this.setState({showEdit:false});
    }
    else{
      newObj[event.target.id] =true
      // 只有下面这两句存在差异
      this.setState({'showEditObj':newObj})
      // Object.assign(this.state.showEditObj,newObj)
      this.setState({showEdit:true});
    }

    this.setState({editshop:dish})
    // 不可以使用全局唯一的状态，否则所有组件会同时显示或关闭，
    // 放在这里只是为了使dom自动渲染，否则点击编辑框，组件不隐藏
    

    /*
    //打开多个编辑框的模式
    event.preventDefault()
    let index = event.target.name
    let dish = this.props.recipelist[index]
    let newObj ={}
    if(this.state.showEditObj[dish.id]){
      
      newObj[event.target.id] =false
      Object.assign(this.state.showEditObj,newObj)
    }
    else{
      newObj[event.target.id] =true
      Object.assign(this.state.showEditObj,newObj)
    }

    this.setState({editshop:dish})
    // 不可以使用全局唯一的状态，否则所有组件会同时显示或关闭，
    // 放在这里只是为了使dom自动渲染，否则点击编辑框，组件不隐藏
    this.setState({showEdit:!this.state.showEdit});
     */
  }
  handleDel(event) {
    event.preventDefault();
    let delData ={
      'shop_id':this.props.shoplist[0]._id,
      'dishid':event.target.id
    }
    this.props.dispatch(act_delrecipe(delData))
    // this.props.dispatch(act_delrecipe(event.target.id))
  }
  // 显示或关闭图片编辑
  toggleModal(event){
    this.setState({
      dishid:event.target.id,
      isOpen: !this.state.isOpen
    });
  }

  handleSort(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
    let sortType={};
    if(event.target.name==="sortDishType"){
      sortType.sortDishType = event.target.value;
      sortType.sortDishUp = this.state.sortDishUp;
    }
    else{
      sortType.sortDishType = this.state.sortDishType;
      sortType.sortDishUp = event.target.value;
    }
    this.props.dispatch(act_recipe_sort(sortType));
  }

  render() {
    const list = List(this.props.recipelist)
    const listLength = this.props.recipelist.length
    return (

        <div>
          <Grid fluid={true}>
            <Row className="AddRecipeButton">
              <Col>
                <div className="f-line">
                
                  <Button  id="addRecipeBtn" onClick={this.toggleForm}>
                    添加菜单
                  </Button>

                  <span className="sortDish">
                  <span id="sortDishLabel">排序</span>
                  <select id="sortDish" name="sortDishType" className="sortDishSel"
                    value={this.state.sortDishType} onChange={this.handleSort}>
                      <option value="0">创建时间</option>
                      <option value="1">菜品种类</option>
                      <option value="2">菜品名称</option>
                  </select>
                  <select id="sortDishUp" name="sortDishUp" className="sortDishSel"
                    value={this.state.sortDishUp} onChange={this.handleSort}>
                      <option value="0">降序</option>
                      <option value="1">升序</option>
                  </select>
                  </span>
                </div>
                {this.state.showForm && < AddRecipe toggleForm={this.toggleForm}/>}
              </Col>
            </Row>
          </Grid>

          <Grid fluid={true}>
            <Row className="show-grid">
              {list.map((dish,index) =>
                  {
                    return(
                      <div>
                        <Row className="dishlist">
                          <Col md={2} sm={3} xs={3} >
                            <div className="dishImgBox">
                              <img className={!dish.fullImage?"dishThumbImg":""}
                                src={dish.sampleImage?'/static/img/'+dish.sampleImage:'/static/img/100.jpg'} 
                                height="100" width="100"
                                id={dish.id}
                                onClick={this.toggleModal}/>

                                {!dish.fullImage?
                                  <span className="tooltiptext">暂无大图</span>
                                  :
                                  null
                                }
                            </div>
                          </Col>
                          <Col md={10} sm={9} xs={9}>
                          <div>
                            <div className="dishDetail">

                              <div className="numberTitle">
                                <Col xs={6} sm={2} md={1}>
                                  <span>{listLength-index}</span>
                                </Col>

                                <Col xs={6} sm={4} md={4}>
                                  {dish.title}
                                </Col>
                              </div>

                           
                              <div className="priceCate">
                                <Col xs={6} sm={4} md={3}>
                                  ￥{dish.price}
                                </Col>

                                <Col xs={6} sm={2} md={2}>
                                  {dish.category}
                                </Col>
                              </div>
                            </div>
                            <div className="editDel">
                              <Col xs={6} sm={6} md={1}>
                                <Button bsStyle="default" id={dish.id} name={index} onClick={this.handleEdit}>编辑</Button>
                              </Col>
                              <Col xs={6} sm={6} md={1}>
                                <Button bsStyle="default" className="recipeDelBtn" id={dish.id} onClick={this.handleDel}>删除</Button>
                              </Col>
                            </div>

                          </div>
                          </Col>
                        </Row>

                        <div>
                        <Row>
                        <Col>
                         {this.state.showEditObj[dish.id] && < EditRecipe shop_id ={dish.shop} dish = {this.state.editshop} toggleEdit={this.toggleEdit}/>}
                        </Col>
                        
                        </Row>
                        </div>
                        

                      </div>
                    )
                  }
                )}
            </Row>
          </Grid>
          <EditImg show={this.state.isOpen} dishid={this.state.dishid} onClose={this.toggleModal}/>
          <Msg/>
        </div>
        )
  }
}

const mapStateToProps = (state) => ({
  recipelist: state.recipelist,
  shoplist: state.shoplist,
  auth: state.auth
})
export default connect(mapStateToProps)(Recipe)

/*
//no image
<Row>
                          <Col md={8} className="dishlist">
                          <div>
                          
                            <Col xs={6} sm={2} md={1}>
                              <span>{index+1}</span>
                            </Col>
                            <Col xs={6} sm={4} md={2}>
                              {dish.title}
                            </Col>

                           

                            <Col xs={6} sm={4} md={3}>
                              ￥{dish.price}/
                              {dish.discount==10?'无折':''}
                              {dish.discount==0?'免费':''}
                              {dish.discount>0&&dish.discount<10?dish.discount+'折':''}
                            </Col>

                            <Col xs={6} sm={2} md={2}>
                              {dish.category}
                            </Col>

                              <Col xs={6} sm={6} md={2}>
                                <Button bsStyle="default" id={dish.id} name={index} onClick={this.handleEdit}>编辑</Button>
                              </Col>
                              <Col xs={6} sm={6} md={2}>
                                <Button bsStyle="danger" id={dish.id} onClick={this.handleDel}>删除</Button>
                              </Col>

                          </div>
                          </Col>
                        </Row>
 */

/*
<Col>
                         {this.state.showEditObj[dish.id] && < EditImg shop_id ={dish.shop} dish = {this.state.editshop} toggleEdit={this.toggleEdit}/>}
                        </Col>
 */

/*
<Col xs={6} sm={4} md={3}>
                                  ￥{dish.price}/
                                  {dish.discount==10?'无折':''}
                                  {dish.discount==0?'免费':''}
                                  {dish.discount>0&&dish.discount<10?dish.discount+'折':''}
                                </Col>
 */
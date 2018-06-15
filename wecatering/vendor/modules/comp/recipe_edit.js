import React from 'react'
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap'
import TimePicker from 'react-bootstrap-time-picker';
import {act_addrecipe, act_getrecipe} from '../../actions/act_recipe'
// 
import ReactCrop from 'react-image-crop';
const styleRequired = {
  color: "#ffaaaa"
}
class EditRecipe extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      shopid:     this.props.shop_id,//use _id,not id
      dishid:       this.props.dish.id,
      title:    this.props.dish.title,
      price:    this.props.dish.price,
      discount: this.props.dish.discount,
      category:this.props.dish.category,
      warnMsg:''
    }
    this.handleChange =this.handleChange.bind(this)
    this.handleSubmit =this.handleSubmit.bind(this)
    this.hidePanel =this.hidePanel.bind(this)
  }
  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value,
      'warnMsg':''
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    if(this.state.title===''){
      this.setState({'warnMsg':'输入不能为空白'})
      return
    }
    if(isNaN(this.state.price)||this.state.price===''||this.state.price<0){
      this.setState({'warnMsg':'价格必须为数字且不为负'})
      return
    }
    let { dispatch } = this.props
    let dish2edit ={}
    dish2edit.dishid = this.state.dishid
    dish2edit.title = this.state.title
    dish2edit.price = this.state.price
    dish2edit.discount = this.state.discount
    dish2edit.category = this.state.category

    if(this.state.shopid==''){
      let defaultShopID = this.props.shoplist[0]._id
      this.setState({shopid: defaultShopID})
      dish2edit.shopid = defaultShopID
      // console.log('shopid is empty')
      // dish2edit = Object.assign({}, this.state,{shopid:defaultShopID})
    }
    else{
      // dish2edit=this.state
      dish2edit.shopid = this.state.shopid
    }
    dish2edit.act = 'editdish'
    dispatch(act_addrecipe(dish2edit))

  }
  hidePanel(event){
     this.props.toggleEdit(event)
  }

  render() {
    // console.log(this.props)
    return (

        <div className='editRecipe'>
          <Grid fluid={true}>
              <Row className="show-grid">
                <Col xs={12} md={6}>
                <div className='editRecipeBox'>
                  <form>



                    <div className="form-group">
                      <label htmlFor="listItemName">菜品名称<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="名称"  
                        name='title' value={this.state.title} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">菜品价格<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="价格"  
                        name='price' value={this.state.price} onChange={this.handleChange}/>
                    </div>

                    
                    

                    <div className="form-group">
                      <label htmlFor="listItemName">菜品分类<span style={styleRequired}>*</span></label>
                      <select id="category" name="category" className="form-control" 
                        value={this.state.category} onChange={this.handleChange}>
                          <option value="主菜">主菜</option>
                          <option value="特色">特色</option>
                          <option value="汤类">汤类</option>
                          <option value="小菜">小菜</option>
                          
                          <option value="甜点">甜点</option>
                          <option value="饮品">饮品</option>
                          <option value="主食">主食</option>
                          <option value="其他">其他</option>
                      </select>
                    </div>
                    <hr />
                    <button className="btn btn-primary" onClick={this.handleSubmit}>提交</button>
                    <button type="reset" id={this.state.dishid} className="btn btn-link" onClick={this.hidePanel}>关闭</button>
                    <span style={styleRequired}>{this.state.warnMsg}</span>
                  </form>

                  </div>
                </Col>
              </Row>
            </Grid>
            
        </div>
        )
  }
}


// export default AddCanteen

const mapStateToProps = (state) => ({
  shoplist: state.shoplist
})
export default connect(mapStateToProps)(EditRecipe)
/*
<div className="form-group">
                      <label htmlFor="listItemName">菜品折扣<span style={styleRequired}>*</span></label>
                      <select id="discount" name="discount" className="form-control" 
                        value={this.state.discount} onChange={this.handleChange}>
                          <option value="10">无折扣</option>
                          <option value="9">9折</option>
                          <option value="8">8折</option>
                          <option value="7">7折</option>
                          <option value="6">6折</option>
                          <option value="5">5折</option>
                          <option value="4">4折</option>
                          <option value="3">3折</option>
                          <option value="2">2折</option>
                          <option value="1">1折</option>
                          <option value="0">免费</option>
                      </select>
                    </div>
 */
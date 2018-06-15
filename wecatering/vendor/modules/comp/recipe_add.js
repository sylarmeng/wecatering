import React from 'react'
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap'

/*import TimePicker from 'react-bootstrap-time-picker';
import {act_addshop} from '../../actions/act_shop'
import {act_getshop} from '../../actions/act_shop'*/
import {act_addrecipe} from '../../actions/act_recipe'
import {act_getrecipe} from '../../actions/act_recipe'

const styleRequired = {
  color: "#ffaaaa"
}

class AddRecipe extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      shopid:'',
      dishid:'',
      title: '',
      price:'',
      discount:10,
      category:'主菜',
      warnMsg:''
    };
    this.handleChange =this.handleChange.bind(this);
    this.handleSubmit =this.handleSubmit.bind(this);
    this.hidePanel =this.hidePanel.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      'warnMsg':''
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.title===''){
      this.setState({'warnMsg':'输入不能为空白'});
      return;
    }
    if(isNaN(this.state.price)||this.state.price===''||this.state.price<0){
      this.setState({'warnMsg':'价格必须为数字且不为负'});
      return;
    }
    let dish2edit={};
    dish2edit.dishid  = this.state.dishid;
    dish2edit.title   = this.state.title;
    dish2edit.price   = this.state.price;
    dish2edit.discount = this.state.discount;
    dish2edit.category = this.state.category;
    if(this.state.shopid=='')
      dish2edit.shopid  = this.props.shoplist[0].id;
    else
      dish2edit.shopid  = this.state.shopid;

    let { dispatch } = this.props;
    dish2edit.act = 'editdish';
    dispatch(act_addrecipe(dish2edit));
  }
  hidePanel(event){
     this.props.toggleForm(event)
  }

  render() {
    // console.log(this.props)
    return (

        <div >
          <Grid  fluid={true}>
              <Row>

                <Col xs={12} md={6} id="addRecipeCon">

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

                    <div className="addImgWarn">
                    <span className="notifyTxt">提交后点击图片添加图片</span>
                    </div>
                      
                    
                    <hr />
                    <button className="btn btn-primary" onClick={this.handleSubmit}>提交</button>
                    <button type="reset" className="btn btn-link" onClick={this.hidePanel}>关闭</button>
                    <span style={styleRequired}>{this.state.warnMsg}</span>
                  </form>

                </Col>
              </Row>
            </Grid>

        </div>
        )
  }
}


const mapStateToProps = (state) => ({
  shoplist: state.shoplist
})
export default connect(mapStateToProps)(AddRecipe)
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
import React from 'react'
import Menulist from './Menulist'
import OrderList from './OrderList'
import { connect } from 'react-redux'
/*import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';*/
import {setAccount} from '../actions/act_order'

class Home extends React.Component{
  constructor(props) {
        super(props);
        this.state={
          showImage:false,
          imageId:null
        };
        this.toggleImg = this.toggleImg.bind(this);
    }
  getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }
  componentDidMount(){    
    var chatid = this.getCookie('chatid');
    this.props.dispatch(setAccount(chatid));
  }
  toggleImg(event){
    if(!event.target.id&&!this.state.showImage){
      return
    }
    this.setState({
      showImage:!this.state.showImage,
      imageId:event.target.id //is null when close the image
    })
  }
  // ['特色','主菜','汤类','小菜','甜点','饮品','主食','其他']
    render() {
      // console.log(this.props);
      const wechatID =this.props.accountID.chatid;
      return(
        <div className='homeContainer'>

        <div className="left">
          <div className='categoryPadding'>
              <hr/>
          </div>
          
          <div className='categoryList'>
            <div className='cateItem'>
              <a href="#特色"><span className=" category">特色</span></a>
            </div>
            <div className='cateItem'>
              <a href="#主菜"><span className=" category">主菜</span></a>
            </div>
            <div className='cateItem'>
              <a href="#汤类"><span className=" category">汤类</span></a>
            </div>
            <div className='cateItem'>
              <a href="#小菜"><span className=" category">小菜</span></a>
            </div>
            <div className='cateItem'>
              <a href="#饮品"><span className=" category">饮品</span></a>
            </div>
            <div className='cateItem'>
              <a href="#甜点"><span className=" category">甜点</span></a>
            </div>
            <div className='cateItem'>
              <a href="#主食"><span className=" category">主食</span></a>
            </div>
            <div className='cateItem'>
              <a href="#其他"><span className=" category">其他</span></a>
            </div>
          </div>
        </div>

        <div className="right ">
          <h5>餐桌号：{this.props.params.t}</h5>

          <Menulist shopid={this.props.params.id} tableNo={this.props.params.t} toggleImg={this.toggleImg}/>
        </div>


        <div className='stickBottom'>
          <OrderList shopid={this.props.params.id} 
            shop_id={this.props.shop_id} 
            tableNo={this.props.params.t}/>
        </div>

        {this.state.showImage&&
          <div className='showImage'>
            <div className='showModal'>
            <div>点击图片返回</div>
            <img src={'/static/img/'+this.state.imageId} 
                      width="320"
                      onClick={this.toggleImg}/>
            </div>
          </div>
        }
        </div>
      )
    }
}

const mapStateToProps = (state) => ({
  shop_id:state.shop_id,
  accountID:state.account
})
export default connect(mapStateToProps)(Home)

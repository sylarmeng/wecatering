
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {getTotal, getCount} from '../reducers/index'
import { doAdd,doDecrease,QueryOrder,SubmitOrder} from '../actions/act_order'

class OrderList extends React.Component{
	constructor(props) {
	      super(props);
	      this.state={
	      	'showCart':false,
	      	'orderID':null,
	      	'showQR':false,
	      	'showAccount':false
	      }
	      this.handleSubmit = this.handleSubmit.bind(this)
	      this.showCart = this.showCart.bind(this)
	      this.handleOutsideClick = this.handleOutsideClick.bind(this)
	      this.closeNotify =this.closeNotify.bind(this)
	      this.queryUser =this.queryUser.bind(this)
	  }
  	contextTypes: {
	    router: React.PropTypes.object
	  }

	handleSubmit(event) {
		event.preventDefault()
		let quantity = this.props.quantityById
		// array with obj ,slice turns to be shallow copy
		// const products = this.props.addedIds.slice()
		//the following is deep copy
		// console.log(this.props.addedIds)
		let products = this.props.addedIds.map(a => Object.assign({}, a))

		products.map(function(dish){
			dish.item = dish._id
			dish.quantity = quantity[dish._id]
			delete dish._id
			dish.complete = 0
			dish.status = false
		})
		// console.log(products)
		// delete useless data
		let order={}
		order.products = products
		order.totalprice = this.props.total
		// order.ordertime = new Date()
		order.ordertime = new Date()
		// console.log('shop_id'+this.props.shop_id)
		
		order.shop = this.props.shop_id
		order.custom = this.props.userData.chatid
		//add table number
		order.tableNo = this.props.tableNo
		// 订单接收状态
		order.acked = 0
		let orderCompose ={}
		orderCompose.order =order
		orderCompose.shopid =this.props.shopid
		// this.setState({
		// 	'orderID':order.id,
		// 	'showQR':true
		// })

		this.props.SubmitOrder(orderCompose)
	}
	closeNotify(event){
		this.setState({'showQR':false})
	}
	showCart(event) {
		if(this.state.showAccount){
			this.setState({'showAccount':false})
		}
		if(this.state.showQR){
			this.setState({'showQR':false})
		}
		if (!this.state.showCart) {
	      // attach/remove event handler
	    document.addEventListener('click', this.handleOutsideClick, false);
	    } 
	    else {
	      document.removeEventListener('click', this.handleOutsideClick, false);
	    }
		this.setState({'showCart':!this.state.showCart})
	}

	handleOutsideClick(e) {
    	//忽略组件自身的点击事件
    	
	    if (this.node.contains(e.target)||e.target.name=='cartPlus'||e.target.name=='cartMinus') {
	      return;
	    }
	    this.showCart();
  	}
  	queryUser(event){
  		// 查询今日订单
  		if(this.state.showCart){
  			this.setState({'showCart':!this.state.showCart});
  			document.removeEventListener('click', this.handleOutsideClick, false);
  		}
  		if(!this.state.showAccount){
  			let options={};
	  		options.custom = this.props.userData.chatid;
	  		options.shop_id = this.props.shop_id;
	  		this.props.QueryOrder(options);
  		}
  		this.setState({
  			'showCart':false,
  			'showQR':false,
	      	'showAccount':!this.state.showAccount
  		});
  	}
	render() {
		const orderRec = this.props.userData.orderRecord
		const req_State = this.props.userData.reqState
    	return(<div>
	    	{
	    		this.state.showAccount?
	    		<div className='c-o-account'>
	    			<div className='c-o-ac-title'>
	    				<p>当日订单记录</p>
	    			</div>
	    			
	    			{
	    				req_State?
	    				<div className="loader">Loading...</div>
	    				:null
	    			}
				   	{
				   		orderRec.map((order, index)=>{
				            return(
				            	<table>
				                <tr className="c-o-ac-head">
				                	
				                	<th>
				                  		序号{index+1}
									</th>

				                	<th>
				                  		<span className="s-table">{order.tableNo}桌</span>
									</th>
									<th>										
									</th>
									<th>
										<span>
										{((new Date(order.ordertime)).toLocaleDateString('zh-CN',{day: '2-digit',hour: '2-digit', minute:'2-digit'})).substring(3)}
										</span>
									</th>
				                </tr>
			                	{
                                  order.products.map((product,index_p)=>{
                                    return(
                                      <tr className="c-o-ac-dish">
                                      	<td>
										</td>
                                        <td>
                                          {product.title}
                                        </td>
                                        <td>
                                          {product.quantity}
                                        </td>
										<td>
											{product.price}/份
										</td>
										
                                      </tr>
                                      )}
                                )}
				                	<tr className="c-o-ac-dish">
                                      	<td>
										</td>
                                        <td>
                                          
                                        </td>
                                        <td>
                                          	总价
                                        </td>
										<td>
											{order.totalprice}元
										</td>
										
                                    </tr>
				                </table>
				            )
			          	})
				   	}
			   	
	    		</div>
	    		:
	    		null
	    	}
    		{
    			this.state.showCart&&
    			<div className='scContainer' ref={node => { this.node = node}}>
    			<h4>已选订单：共计{this.props.total}元</h4>
    			<table>
			   	{
			   		this.props.addedIds.map((dish, index)=>{
			            return(
			                <tr key={dish._id} className="listCartItem">
			                	
			                	<td className='scDishIndex'>
			                  		{index+1}
								</td>

			                	<td className='scDishTitle'>
			                  		{dish.title}
								</td>
								<td className='scDishPrice'>
									{dish.price}
								</td>
								<td className='scDishCount'>
									份数x{this.props.quantityById[dish._id]}
								</td>
			                  	<td className ="dishclickBtnAct">
				                  <button name='cartMinus'
				                  	className ='btn btn-default minusBtn pull-right dishclickBtn '
				                    onClick={()=>this.props.doDecrease(dish,this.props.quantityById[dish._id])}
				                    disabled={this.props.quantityById[dish._id]>0? false : true}>-</button>
			                  	</td>
			                  	<td className='dishSelect'>
				                  <button name='cartPlus'
				                  	className ='btn btn-default plusBtn pull-right dishclickBtn' 
				                    onClick={()=>this.props.doAdd(dish)}>+</button>
			                    </td>	
			                </tr>
			            )
		          	})
			   	}
			   	</table>
			   	</div>

    		}
    		{
    			this.state.showQR &&
    			<div className='scContainer'>
    			<span>订单已提交</span>
				<span className="notifyClose">
					<button className="btn btn-default pull-right notifyCloseBtn" onClick={this.closeNotify}
		      		>x</button>
				</span>
    			</div>
    		}
		   
		   <div className='submitContainer'>
		   	<table>
		   		<tr>
		   			<td>
		   				<span className="totalText" onClick={this.queryUser}>
		   					<img id="account" src="/static/img/account.png" width="36" height="36" alt="" />
		   				</span>
		   			</td>
		   			<td>
		   				<span className="img-valign" onClick={this.showCart}>
					   		<img src="/static/img/shopcart.png" width="30" height="30" alt="" />
					   	</span>
					   	<span className="selectCount">{this.props.getCount}</span>
		   			</td>
		   			<td>
			   			<button id="sub-btn" className="btn btn-default" onClick={this.handleSubmit}
		          		disabled={Object.keys(this.props.quantityById).length? false : true}
		      		>提交</button>
		   			</td>
		   		</tr>
		   	</table>
   		
		   </div>
		   
		 </div>)
	}
}

OrderList.propTypes = {
  doAdd: PropTypes.func.isRequired,
  doDecrease:PropTypes.func.isRequired,
  SubmitOrder:PropTypes.func.isRequired,
  QueryOrder:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  addedIds: state.orderlist.addedIds,
  quantityById: state.orderlist.quantityById,
  total: getTotal(state.orderlist),
  getCount: getCount(state.orderlist.quantityById),
  userData:state.account
})

const mapDispatchToProps =(dispatch)=> {
  return {
  doAdd:  (dish) => dispatch(doAdd(dish)),
  doDecrease:(dish,count) => dispatch(doDecrease(dish,count)),
  SubmitOrder: (orderCompose) => dispatch(SubmitOrder(orderCompose)),
  QueryOrder:(options) => dispatch(QueryOrder(options))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)

/*
<div className='submitContainer'>
			   <span className="totalText pull-left">￥:{this.props.total}</span>
			   <span className="img-valign" onClick={this.showCart}>
			   <img src="/static/img/shopcart.png" width="36" height="36" alt="" />
			   </span>
			   <span className="selectCount">{this.props.getCount}</span>
		   		<Button className="pull-right" onClick={this.handleSubmit}
	          		disabled={Object.keys(this.props.quantityById).length? false : true}
	      		>提交订单</Button>
		   </div>
 */

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

								<span className='dishSelect'>
				                  <button name='cartPlus'
				                  	className ='btn btn-default plusBtn pull-right dishclickBtn' 
				                    onClick={()=>this.props.doAdd(dish)}>+</button>
			                    </span>

			                  <span className ="dishclickBtnAct">
			                  <button name='cartMinus'
			                  	className ='btn btn-default minusBtn pull-right dishclickBtn '
			                    onClick={()=>this.props.doDecrease(dish,this.props.quantityById[dish._id])}
			                    disabled={this.props.quantityById[dish._id]>0? false : true}>-</button>
			                  </span>
			                  	
								</div>
			                </li>
 */
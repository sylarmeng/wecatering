import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Grid, Row, Col ,Button} from 'react-bootstrap'
// import Grid from 'react-bootstrap/lib/Grid';
// import Row from 'react-bootstrap/lib/Row';
// import Col from 'react-bootstrap/lib/Col';
// import Button from 'react-bootstrap/lib/Button';

import {loginUser} from '../actions/act_sign'

class Signin extends React.Component{
	constructor(props) {
	    super(props)
	    this.state = {
	    	'mobilevalue': '',
	    	'pwdvalue':''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	  }

  	contextTypes: {
	    router: React.PropTypes.object
	  }
  	componentWillMount() {
  		if(this.props.auth.authenticated){
  			this.props.router.push('/shop/admin')
  		}
  	}
	handleSubmit(event) {
		event.preventDefault();
		let { dispatch } = this.props
		dispatch(loginUser(this.state))

	}
	handleChange(event) {
		 this.setState({[event.target.name]: event.target.value})
	}

  render(){
    return(
    	<div className ="wrapper">
    		<div className ="form-signin">
	    		<Grid  fluid={true}>
	            	<Row className="show-grid login-head-1">
	            		<Col>
	            			<div className="sign-head">
	            			<a href="/">
			                    	<span>欣味</span>
			                  	</a>
							</div>
						</Col>
						<Col>
							<div className="sign-input">
					        <input type="text" name ='mobilevalue' value={this.state.mobilevalue}
					        onChange={this.handleChange} placeholder="账号" />
					        </div>
				      	</Col>
				      	<Col>
				      		<div className="sign-input">
					        <input type="password" name ='pwdvalue' value={this.state.pwdvalue}
					        onChange={this.handleChange} placeholder="密码" />
					        </div>
			      		</Col>
			      		<Col>
					      	<div className="sign-btn">
						        <Button bsStyle="success" onClick={this.handleSubmit} >
						          登录
						        </Button>
					        </div>
					        <div className="sign-msg">
						        {this.props.auth.error=='NORECORD'?<p>账号或密码错</p>:null}
						        {this.props.auth.error=='DBERR'?<p>数据错误，联系客服</p>:null}
						        {this.props.auth.error=='NET_ERROR'?<p>网络错误，联系客服</p>:null}
					        </div>
			        
				      	</Col>
				      	<Col>
		                  	<div className="sign-note">
	    						<a href="/signup">
			                    	<span id="noAccountWarn">没有帐号？点击这里注册！</span>
			                  	</a>
							</div>
						</Col>
					</Row>
				</Grid>


		  	</div>
	    </div>
	    )
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Signin)

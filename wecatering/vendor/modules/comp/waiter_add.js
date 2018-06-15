import React from 'react'
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button} from 'react-bootstrap'

import {act_addwaiter} from '../../actions/act_shop'

const styleRequired = {
  color: "#ffaaaa"
}

class AddWaiter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name:       '',
      password:   '',
      namewarn: true,
      pwdwarn:true,
      waiterChange:true
    };
    this.handleChange =this.handleChange.bind(this)
    this.handleSubmit =this.handleSubmit.bind(this)
    this.hidePanel =this.hidePanel.bind(this)
  }

  handleChange(event) {
    let value =event.target.value
    if(event.target.name=='name'){
      this.setState({'waiterChange': false});
      if(value.length>6){
        this.setState({'namewarn': false});
        if(value.length>8){
          value=value.substring(0,8)
        }
      }
      else{
        this.setState({'namewarn': true});
      }
    }
    if(event.target.name=='password'){
      if(value.length<6){
        this.setState({'pwdwarn': true});
      }      
      else{
        this.setState({'pwdwarn': false});
      }
    }
    
    this.setState({[event.target.name]: value})
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let data ={}
    data.name = this.state.name
    data.password = this.state.password
    data.action ='add'
    let { dispatch } = this.props
    dispatch(act_addwaiter(data))
    this.setState({'waiterChange': true})
  }
  hidePanel(event){
    this.props.toggleWaiter(event)
  }

  render() {
    // console.log(this.props)
    return (
        <div>
          <Grid fluid={true}>
              <Row className="show-grid">
                <Col xs={12} md={6}>
                  <form >

                    <div className="form-group">
                      <label htmlFor="listItemName">小号名称<span className={this.state.namewarn?'waiternamewarn':'waiternowarn'}>*限6至8位数字或字母</span></label>

                      <input type="text" minLength="6" maxLength="8" className="form-control"  placeholder="名称" 
                        name='name' value={this.state.name} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">小号密码<span  className={this.state.pwdwarn?'waiterpwdwarn':'waiternowarn'}>*密码长度至少为6</span></label>
                      <input type="password" className="form-control" placeholder="密码"  
                        name='password' value={this.state.password} onChange={this.handleChange}/>
                    </div>
                    <Col className='addWaiterWarn'>
                      <p>{this.props.auth.message&&this.state.waiterChange?this.props.auth.message:''}
                      </p>
                    </Col>
                    <hr/>
                    <button className="btn btn-primary" disabled={this.state.namewarn||this.state.pwdwarn?'true':''} onClick={this.handleSubmit}>提交</button>
                    <button type="reset" className="btn btn-link" onClick={this.hidePanel}>关闭</button>
                  </form>

                </Col>
              </Row>
            </Grid>

        </div>
        )
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth
})
export default connect(mapStateToProps)(AddWaiter)
// export default connect(null)(AddWaiter)

// form input attribute
// disabled="disabled"
// readonly="readonly"

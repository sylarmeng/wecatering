import React from 'react'
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button} from 'react-bootstrap'

import TimePicker from 'react-bootstrap-time-picker';
import {act_addshop} from '../../actions/act_shop'
import {act_getshop} from '../../actions/act_shop'

const styleRequired = {
  color: "#ffaaaa"
}

class AddCanteen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      addr:'',
      opentime_start:"",
      opentime_end:"",
      category:'',
      tables:0,
      seats:0,
    };
    this.handleChange =this.handleChange.bind(this)
    this.handleSubmit =this.handleSubmit.bind(this)
    this.hidePanel =this.hidePanel.bind(this)
    this.startChange =this.startChange.bind(this)
    this.endChange =this.endChange.bind(this)
  }

  handleChange(event) {
    /*let shopvalue = Object.assign({}, this.state.shop, {[event.target.name]: event.target.value});
    this.setState({shop: shopvalue});*/
    // console.log(event.target.name)
    this.setState({[event.target.name]: event.target.value});
  }
  startChange(time) {
    //火狐浏览器不要在此使用event
    //注意看下源码，内部是如何绑定的
    this.setState({opentime_start: time});
  }
  endChange(time) {
    this.setState({opentime_end: time});
  }

  handleSubmit(event) {
    event.preventDefault();
    let { dispatch } = this.props;
    dispatch(act_addshop(this.state))
    dispatch(act_getshop())
  }
  hidePanel(event){
     this.props.toggleForm(event)
  }

  render() {
    // console.log('canteen add')
    // console.log(this.props)
    // console.log(this.state)
    return (

        <div>
          <Grid fluid={true}>
              <Row className="show-grid">
                <Col xs={12} md={6}>
                  <form onSubmit={this.handleSubmitEvent}>

                    <div className="form-group">
                      <label htmlFor="listItemName">餐厅名称<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="名称"  
                        name='title' value={this.state.title} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">详细地址<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="地址"  
                        name='addr' value={this.state.addr} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <Col >
                      <label htmlFor="listItemName">营业时间<span style={styleRequired}>*</span></label>
                      </Col>
                      <Col className = "TimePickerClass">
                        <Col xs={5} md={5}>
                          <TimePicker format={24} start="00:00"  step={30}
                            name='opentime_start' value={this.state.opentime_start} onChange={this.startChange}/>
                        </Col>
                        <Col xs={2} md={2}>
                          <span>至</span>
                        </Col>
                        <Col xs={5} md={5}>
                          <TimePicker format={24} start="00:00" step={30}
                            name='opentime_end' value={this.state.opentime_end} onChange={this.endChange}/>
                        </Col>
                      </Col>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">消费类型<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="大众？高端"
                        name='category' value={this.state.category} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="listItemQuantity">餐厅桌数 <span style={styleRequired}>*</span></label>
                      <div className="row">
                        <div className="col-xs-5 col-sm-6 col-md-4">
                          <input type="number" min="1" max="1000" step="1" defaultValue="1" className="form-control"  ref="quantity" 
                            name='tables' value={this.state.tables} onChange={this.handleChange}/>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemQuantity">总餐位数 <span style={styleRequired}>*</span></label>
                      <div className="row">
                        <div className="col-xs-5 col-sm-6 col-md-4">
                          <input type="number" min="1" max="1000" step="1" defaultValue="1" className="form-control"  ref="quantity" 
                          name='seats' value={this.state.seats} onChange={this.handleChange}/>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <button className="btn btn-primary" onClick={this.handleSubmit}>提交</button>
                    <button type="reset" className="btn btn-link" onClick={this.hidePanel}>关闭</button>
                  </form>

                </Col>
              </Row>
            </Grid>

        </div>
        )
  }
}

export default connect(null)(AddCanteen)

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
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({[event.target.name]: event.target.value});
  }
  startChange(time) {
    //火狐浏览器不要在此使用event
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
    event.preventDefault();
    this.props.toggleForm(event)
  }

  render() {
    // console.log(this.props)
    return (

        <div>
          <Grid>
              <Row className="show-grid">
                <Col xs={12} md={6}>
                  <form onSubmit={this.handleSubmitEvent}>

                    <div className="form-group">
                      <label htmlFor="listItemName">餐厅名称<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="Enter name"  
                        name='title' value={this.state.title} onChange={this.handleChange.bind(this)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">详细地址<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="Enter name"  
                        name='addr' value={this.state.addr} onChange={this.handleChange.bind(this)}/>
                    </div>

                    <div className="form-group">
                      <Col >
                      <label htmlFor="listItemName">营业时间<span style={styleRequired}>*</span></label>
                      </Col>
                      <Col className = "TimePickerClass">
                        <Col xs={5} md={5}>
                          <TimePicker format={24} start="00:00"  step={30}
                            name='opentime_start' value={this.state.opentime_start} onChange={this.startChange.bind(this)}/>
                        </Col>
                        <Col xs={2} md={2}>
                          <span>至</span>
                        </Col>
                        <Col xs={5} md={5}>
                          <TimePicker format={24} start="00:00" step={30}
                            name='opentime_end' value={this.state.opentime_end} onChange={this.endChange.bind(this)}/>
                        </Col>
                      </Col>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemName">消费类型<span style={styleRequired}>*</span></label>
                      <input type="text" className="form-control" placeholder="Enter name"
                        name='category' value={this.state.category} onChange={this.handleChange.bind(this)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="listItemQuantity">餐厅桌数 <span style={styleRequired}>*</span></label>
                      <div className="row">
                        <div className="col-xs-5 col-sm-6 col-md-4">
                          <input type="number" min="1" max="1000" step="1" defaultValue="1" className="form-control"  ref="quantity" 
                            name='tables' value={this.state.tables} onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="listItemQuantity">总餐位数 <span style={styleRequired}>*</span></label>
                      <div className="row">
                        <div className="col-xs-5 col-sm-6 col-md-4">
                          <input type="number" min="1" max="1000" step="1" defaultValue="1" className="form-control"  ref="quantity" 
                          name='seats' value={this.state.seats} onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>提交</button>
                    <button type="reset" className="btn btn-link" onClick={this.hidePanel.bind(this)}>关闭</button>
                  </form>

                </Col>
              </Row>
            </Grid>

        </div>
        )
  }
}


// export default AddCanteen

const mapStateToProps = (state) => (
  state
)
export default connect(mapStateToProps)(AddCanteen)

/*
                     <div className="form-group">
                      <label htmlFor="listItemDescription">Description</label>
                      <textarea className="form-control" rows="3" id="listItemDescription" placeholder="Enter description" ref="description"></textarea>
                    </div>*/
// <h3 className="page-header">添加新餐厅</h3>
// required
/*
 <input type="text" className="form-control" placeholder="Enter name"
                        name='opentime' value={this.state.opentime} onChange={this.handleChange.bind(this)}/>
                        */
// <TimePicker {...this.state.timepicker} onChange={this.handleChange.bind(this)/>
// <button type="reset" className="btn btn-link">关闭</button>
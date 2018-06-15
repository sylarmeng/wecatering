

import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { Grid, Row, Col ,Button} from 'react-bootstrap'
import {ClearMsg} from '../../actions/act_msg'

class Msg extends React.Component{
  constructor(props) {
    super(props)
    // this.state = {
    // };
  }
  componentWillMount(){
  }
  componentDidUpdate() {
      let msgId = this.props.resMSG.msgId;
      let that =this;
      (function(){
        setTimeout(function(){
        that.props.dispatch(ClearMsg(msgId));
      },1000);
      })();


  }
  render() {
    return (
      <div>
      {
        this.props.resMSG.msg!==null?
        <div className="MsgComp">
          <div className="MsgCompBox">
            <p>{this.props.resMSG.msg}</p>
          </div>          
        </div>
        :null
      }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  resMSG: state.resMSG
})
export default connect(mapStateToProps)(Msg)

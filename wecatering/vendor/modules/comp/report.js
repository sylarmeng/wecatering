import React from 'react'
import { connect } from 'react-redux'
// import { Grid, Row, Col ,Button} from 'react-bootstrap'
import {act_rpt_lastday,act_rpt_reset} from '../../actions/act_report'

// import { List }  from "immutable";
import DailyDish from './chart/DailyDish'
import DailyBill from './chart/DailyBill'
import DailyTimeSect from './chart/DailyTimeSect'
import DailyIncome from './chart/DailyIncome'

// import Chart from './lazychart'
import Msg from './Msg'
class Report extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        label:'dailyDishCount',
        dataType:1
      };
      this.handleSel = this.handleSel.bind(this);
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentWillMount() {
    if (this.props.auth.authenticated){
      if(this.props.auth.cat=='1'){
        let dispatch =this.props.dispatch 
        dispatch(act_rpt_lastday('ld'))
        setTimeout(function(){
          dispatch(act_rpt_lastday('lw'))
        },100)
      }
      else{
        this.props.router.push('/shop/admin')
      }
    }
    else{
      this.props.router.push('/shop/signin')
    }
    
  }
  handleSel(event){


    let currentLabel = document.getElementById(this.state.label);
    let nextLabel = document.getElementById(event.target.name);
    let classes = currentLabel.className.split(/\s+/),
            length = classes.length,
            i = 0,
            className='active';

    for(; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1);
        break;
      }
    }
    // The className is not found
    if (length === classes.length) {
        classes.push(className);
    }
    let classes_w = nextLabel.className.split(/\s+/),
            length_w = classes_w.length,
            j = 0;
    for(; j < length; j++) {
      if (classes_w[j] === className) {
        classes_w.splice(j, 1);
        break;
      }
    }
    // The className is not found
    if (length_w === classes_w.length) {
        classes_w.push(className);
    }

    currentLabel.className = classes.join(' ');
    nextLabel.className = classes_w.join(' ');

    let targetType;
    if(event.target.name==='dailyDishCount'||event.target.name==='dailyTimeSect'||event.target.name==='dailyBillPrice'){
      targetType = 1
    }
    else{
      targetType = 2;
    }
    this.setState({
      label:event.target.name,
      dataType: targetType
    });
  }
  render() {
    // console.log(this.props)
    return (
        <div className="chartWrapper">
          <div className="chartLabel daily f-line">
          </div>
          <div className="chartLabel week">
            <span></span>
          </div> 
          <div className="v-r-table">
            <table>
              <tr>
                <th colSpan={3}>
                  昨日数据
                </th>
              </tr>
              <tr>
                <td>
                <button className="btn btn-default chartBtn active" id="dailyDishCount" name="dailyDishCount" onClick ={this.handleSel}>
              菜品排行</button>
                </td>
                <td>
                <button className="btn btn-default chartBtn" id="dailyTimeSect" name="dailyTimeSect" onClick ={this.handleSel}>
              时段订单</button>
                </td>
                <td>
                <button className="btn btn-default chartBtn" id="dailyBillPrice" name="dailyBillPrice" onClick ={this.handleSel}>
              单价散点</button>
                </td>
              </tr>
            </table>
          </div>
          <div className="v-r-table">
            <table>
              <tr>
                <th colSpan={3}>
                  周数据
                </th>
              </tr>
              <tr>
                <td>
                <button className="btn btn-default chartBtn" id="dailyIncome" name="dailyIncome" onClick ={this.handleSel}>
              一周收入</button>
                </td>
                <td>
                <button disabled="disabled" className="btn btn-default chartBtn">
              菜品排行</button>
                </td>
                <td>
                <button disabled="disabled" className="btn btn-default chartBtn">
              时段订单</button>
                </td>
              </tr>
              <tr>
                <td>
                <button disabled="disabled" className="btn btn-default chartBtn">
              单价散点</button> 
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
            </table>
          </div>

          <div className="reportNote"> 
          {
            this.state.dataType===1?
            <div>
              <hr/>  
              <span id="title">昨日营收:</span>
              <span id="value">{this.props.reportList.income}元</span>
              <span id="title">订单总数:</span>
              <span id="value">{this.props.reportList.count}份</span>
              <span id="title">平均客单价:</span>
              <span id="value">
                {this.props.reportList.count!==0? parseInt(this.props.reportList.income /this.props.reportList.count): '无记录'}元
              </span>
            </div>
            :null
          }
          </div>

          {
            this.state.label ==='dailyDishCount'&&this.props.reportList.dishSaleCount>0?
              <DailyDish reportList = {this.props.reportList} />
              :null
          }
          {
            this.state.label ==='dailyBillPrice'&&this.props.reportList.dishSaleCount>0?
              <DailyBill reportList = {this.props.reportList}  />
              :null
          }
          {
            this.state.label ==='dailyTimeSect'&&this.props.reportList.dishSaleCount>0?
              <DailyTimeSect reportList = {this.props.reportList}  />
              :null
          }
          {
            this.state.label ==='dailyIncome'?
              <DailyIncome reportList = {this.props.lastWeek}  />
              :null
          }
          <Msg/>
        </div>
        )
  }
}

/*const initialState = {
  bill_count:[],
  bill_value:[],
  income:0,
  count:0,
  dishsale_sort:[]
}*/
const mapStateToProps = (state) => ({
  reportList: state.reportList.lastDay,
  lastWeek: state.reportList.lastWeek,
  auth: state.auth
})
export default connect(mapStateToProps)(Report)

/*
<div className="chartLabel daily f-line">
            
            <span>昨日数据</span>
            <button className="btn btn-default chartBtn active" id="dailyDishCount" name="dailyDishCount" onClick ={this.handleSel}>
              菜品排行</button>
            <button className="btn btn-default chartBtn" id="dailyTimeSect" name="dailyTimeSect" onClick ={this.handleSel}>
              时段订单</button>
            <button className="btn btn-default chartBtn" id="dailyBillPrice" name="dailyBillPrice" onClick ={this.handleSel}>
              单价散点</button>
             
          </div>
          <div className="chartLabel week">
            
            <span>周数据</span>
            <button className="btn btn-default chartBtn" id="dailyIncome" name="dailyIncome" onClick ={this.handleSel}>
              一周收入</button>
            <button disabled="disabled" className="btn btn-default chartBtn">
              菜品排行</button>
            <button disabled="disabled" className="btn btn-default chartBtn">
              时段订单</button>
            <button disabled="disabled" className="btn btn-default chartBtn">
              单价散点</button> 
           
          </div> 
 */
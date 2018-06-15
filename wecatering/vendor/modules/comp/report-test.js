import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col ,Button} from 'react-bootstrap'

import Msg from './Msg'
class Report extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        // dailyBillPrice:0,
        // dailyDishCount:0,
        // dailyTimeSect:0,
        label:'dailyDishCount'
      };
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentWillMount() {
  }

  render() {
    // console.log(this.props.reportList)
    return (
        <div className="TestTable">
          <table>
              <tr>
                  <td colSpan={2}>0</td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
              </tr>
              <tr>
                  <td colSpan={2}>0</td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
              </tr>
              <tr>
                  <td>1</td>
                  <td>2</td>
                  <td rowSpan={2}>3</td>
                  <td rowSpan={2}>4</td>
                  <td rowSpan={2}>5</td>
                  <td rowSpan={2}>6</td>
              </tr>
              <tr>
                  <td colSpan={2}>1</td>        
               </tr>
          </table>
        </div>
        )
  }
}

const mapStateToProps = (state) => ({
  reportList: state.reportList,
  auth: state.auth
})
export default connect(mapStateToProps)(Report)


/*
{
            this.state.label ==='dailyDishCount'?
              <DailyDish reportList = {this.props.reportList}/>
              :null
          }
 */
/*
y_name={'数量'} x_name={'客单价'}*/
    /*myChart.showLoading({
                    text: '正在努力的读取数据中...',
                });*/
/*    let option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    };
    myChart.setOption(option);*/
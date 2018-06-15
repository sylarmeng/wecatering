import React from 'react'
import { Grid, Row, Col ,Button} from 'react-bootstrap'
// import { List }  from "immutable";

/*var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
// require('echarts/lib/chart/line');
require('echarts/lib/chart/scatter');
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')*/

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

class DailyBill extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        dishCount:0
      }
  }
  chartResize() {
      let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
      let myChart1 = echarts.getInstanceByDom(document.getElementById('mychart1'));
      myChart.resize();
      myChart1.resize();
    }
  componentWillUnmount() {
      let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
      let myChart1 = echarts.getInstanceByDom(document.getElementById('mychart1'));
      window.removeEventListener("resize", this.chartResize);
      myChart.clear();
      myChart.dispose();
      myChart1.clear();
      myChart1.dispose();
  }
  componentDidMount() {
    let myChart = echarts.init(document.getElementById('mychart'));
    let myChart1 = echarts.init(document.getElementById('mychart1'));

    let option =  {
        backgroundColor: '#f7f7f7',
        title : {
          text: ''
        },
        tooltip : {
            trigger: 'item',
            formatter: '({c})',
            showDelay : 0
        },
        // legend: {
        //     data:['1']
        // },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataZoom : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        }
    };

    // option.legend.data.push('sample1');
    myChart.setOption(option);
    myChart1.setOption(option);
    /*if(this.props.flag!==0){
      this.fillData();
    }*/
    const D_dayCount =this.props.reportList.dailyIncomeResult.dayCount
    const D_dayIncome =this.props.reportList.dailyIncomeResult.dayIncome
    const D_days =this.props.reportList.dailyIncomeResult.days

    this.fillData('mychart', '营业额', D_days, D_dayIncome);
    this.fillData('mychart1','订单数', D_days, D_dayCount,);
    window.addEventListener("resize", this.chartResize);
  }

  fillData(ElementId, yLabel, xData, yData){
    let myChart = echarts.getInstanceByDom(document.getElementById(ElementId));

    myChart.setOption({
      xAxis : [
          {
              name: '日期',
              type : 'category',
              scale: true,
              data: xData
          }
      ],
      yAxis : [
          {
              name: yLabel,
              type : 'value',
              scale:true
          }
      ],
      series : [
            {
              name:'',
              type:'line',
              data: yData,
              symbolSize: function (value){
                 return 10;
              },
              itemStyle : { normal: {label : {show: true}}}
            }
      ]
    });
  }
  /*fillData(){
    let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
    const D_dayCount =this.props.reportList.dailyIncomeResult.dayCount
    const D_dayIncome =this.props.reportList.dailyIncomeResult.dayIncome
    const D_days =this.props.reportList.dailyIncomeResult.days
    myChart.setOption({
      xAxis : [
          {
              name: '日期',
              type : 'category',
              scale: true,
              data: D_days
          }
      ],
      yAxis : [
          {
              name: '营业额',
              type : 'value',
              scale:true
          }
      ],
      series : [
            {
              name:'',
              type:'line',
              data: D_dayIncome,
              symbolSize: function (value){
                 return 10;
              },
              itemStyle : { normal: {label : {show: true}}}
            },
            {
              name:'',
              type:'line',
              data: D_dayCount,
              symbolSize: function (value){
                 return 10;
              }
            }
      ]
    });
  }*/
  componentDidUpdate() {
    this.fillData();
  }

  render() {
    // 为图标设置动态的高度
    // // dailyBillPrice:false,
        // dailyDishCount:true,
        // dailyTimeSect:false
    return (
      <div>
        <h4>周每日销售收入</h4>
        <div id="mychart" style={{height:400}}></div>
        <hr/>

        <h4>周每日销售订单数</h4>
        <div id="mychart1" style={{height:400}}></div>
        <hr/>
      </div>
    )
  }
}
export default DailyBill

// style={{width: 500, height:500}}

        /*let option = {
        title : {
            text: 'Demo',
            // subtext: '纯属虚构',
            x:'left'
        },
        legend: {                                   // 图例配置
            padding: 5,                             // 图例内边距，单位px，默认上下左右内边距为5
            itemGap: 10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
            data: ['sample']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        tooltip: {                                  // 气泡提示配置
            trigger: 'item',                        // 触发类型，默认数据触发，可选为：'axis'
        }
    };

    option.legend.data.push('sample1');
    myChart.setOption(option);*/

        /*let x_data=[]
        let y_data=[]
        for(let i=0;i<this.props.reportList.bill_count.length;i++){
          y_data.push(this.props.reportList.bill_count[i])
          x_data.push(this.props.reportList.bill_value[i])
        }*/
        
/*{
          this.props.activeChart ==='dailyDishCount'?
          <div>
            <h4>菜品-销量 排行</h4>
            <div id="dishchart" style={{height:800}}></div>
            <hr/>
          </div>
          :
          null
        }*/
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
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

class DailyTimeSect extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        dishCount:0,
        height:300
      }
  }
  chartResize() {
      let timeSectChart = echarts.getInstanceByDom(document.getElementById('timeSectChart'));
      timeSectChart.resize();
    }
  componentWillUnmount() {
      let timeSectChart = echarts.getInstanceByDom(document.getElementById('timeSectChart'));
      window.removeEventListener("resize", this.chartResize);
      timeSectChart.clear();
      timeSectChart.dispose();
  }
  componentDidMount() {
    //dish chart
    let timeSectChart = echarts.init(document.getElementById('timeSectChart'));
    let option1 = {
        backgroundColor: '#f7f7f7',
        title : {
          text: '',
          subtext: ''
        },
        tooltip : {
            trigger: 'item',
            formatter: '{c}',
            showDelay : 0
            /*axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            }*/
        },
        legend: {
            data:['1']
        },
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
    // option1.legend.data.push('sample1');
    timeSectChart.setOption(option1);
    /*if(this.props.flag!==0){
      this.fillData();
    }*/
    this.fillData();
    window.addEventListener("resize", this.chartResize);
  }

  fillData(){
    let timeSectChart = echarts.getInstanceByDom(document.getElementById('timeSectChart'));
    let y_data1 = []
    let x_data1 = []
    this.props.reportList.timeSect.map(function(item,index){
      y_data1.push(item)
      x_data1.push(index+'-'+(index+1))
    })

    timeSectChart.setOption({        //加载数据图表
        yAxis: {
            name: '销量',
            axisLabel:{
                  margin:4
                 },
        },
        xAxis: {
            name: '时段',
            data: x_data1,
            axisLabel:{
                  interval:0,
                  rotate:45
                 },
        },
        series: [{
            // 根据名字对应到相应的系列
            // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
            name: 'sample1',
            type: 'bar',
            // symbol: 'emptyCircle',
            data: y_data1,
            itemStyle : { 
              normal: {
                label : {
                  show: true,
                  position: 'inside',
                  formatter: '{c}'
                  },
                color: function(params) {
                    var colorList = [
                      '#27727B',
                       '#F0805A','#9BCA63','#60C0DD',
                       '#D7504B'
                    ];
                    return colorList[params.dataIndex%5]
                }
              }
            },
        }]
    });
  }
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
        <h4>时段-销量 排行</h4>
        <div id="timeSectChart" style={{height:600}} >
        </div>
        <hr/>
      </div>
    )
  }
}
export default DailyTimeSect
/*var colorList = [
                          '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];*/
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
            <div id="timeSectChart" style={{height:800}}></div>
            <hr/>
          </div>
          :
          null
        }*/
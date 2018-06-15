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

class Chart extends React.Component{
  constructor(props) {
      super(props);
      this.state={
        dishCount:0
      }
  }
  chartResize() {
      let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
      let dishChart = echarts.getInstanceByDom(document.getElementById('dishchart'));
      myChart.resize();
      dishChart.resize();
    }
  componentWillUnmount() {
      let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
      window.removeEventListener("resize", this.chartResize);
      myChart.clear();
      myChart.dispose();
  }
  componentDidMount() {
    let myChart = echarts.init(document.getElementById('mychart'));

    let option =  {
        backgroundColor: '#f7f7f7',
        title : {
          text: '',

        },
        tooltip : {
            trigger: 'axis',
            formatter: '({c})',
            showDelay : 0,
            axisPointer:{
                // show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            }
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

    // option.legend.data.push('sample1');
    myChart.setOption(option);
    window.addEventListener("resize", this.chartResize);




    //dish chart
    let dishChart = echarts.init(document.getElementById('dishchart'));
    let option1 = {
        backgroundColor: '#f7f7f7',
        title : {
          text: '',
          subtext: ''
        },
        tooltip : {
            trigger: 'axis',
            formatter: '({c})',
            showDelay : 0,
            axisPointer:{
                show: true,
                type : 'cross',
                lineStyle: {
                    type : 'dashed',
                    width : 1
                }
            }
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
    dishChart.setOption(option1);
  }


      componentDidUpdate() {
        let myChart = echarts.getInstanceByDom(document.getElementById('mychart'));
        let data_compose =[]
        for (let i=0;i<this.props.reportList.bill_count.length;i++){
          /*let temp =[]
          temp[0]=this.props.reportList.bill_value[i]
          temp[1]=this.props.reportList.bill_count[i]*/
          data_compose.push([this.props.reportList.bill_value[i],this.props.reportList.bill_count[i]])
        }
        myChart.setOption({
          xAxis : [
              {
                  name: '客单价',
                  type : 'value',
                  scale:true,
                  
              }
          ],
          yAxis : [
              {
                  name: '数量',
                  type : 'value',
                  scale:true,
              }
          ],
          series : [
              {
                  name:'',
                  type:'scatter',
                  data: data_compose,
                  symbolSize: function (value){
                     return 30;
                  },
                  markPoint : {
                      data : [
                          {type : 'max', name: '最大值'},
                          {type : 'min', name: '最小值'}
                      ]
                  },
                  markLine : {
                      data : [
                          {type : 'average', name: '平均值'}
                      ]
                  },
                  itemStyle : { 
                  normal: {
                    color: function(params) {
                              // build a color map as your need.
                        var colorList = [
                          '#60d3d5'
                        ];
                        return colorList[params.dataIndex]
                    }
                  }
                },
              },

          ]
        });



        let dishChart = echarts.getInstanceByDom(document.getElementById('dishchart'));
        let y_data1 = []
        let x_data1 = []

        for(var key in this.props.reportList.dishsale_sort){
          y_data1.push(key)
          x_data1.push(this.props.reportList.dishsale_sort[key])
        }
        dishChart.setOption({        //加载数据图表
            yAxis: {
                name: '菜品',
                data: y_data1,
                axisLabel:{
                      interval:0,
                      // rotate:45,
                      margin:4
                      /*textStyle:{
                             color:"#008acd"
                         }*/
                     },
            },
            xAxis: {
                name: '销量',
                
            },
            series: [{
                // 根据名字对应到相应的系列
                name: 'sample1',
                type: 'bar',                           // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
                symbol: 'emptyCircle',
                data: x_data1,
                itemStyle : { 
                  normal: {
                    label : {
                      show: true,
                      position: 'insideRight',
                      formatter: '{b}'
                      },
                    color: function(params) {
                              // build a color map as your need.
                        var colorList = [
                          '#27727B',
                           '#F0805A','#9BCA63','#60C0DD',
                           '#D7504B'
                        ];
                        /*var colorList = [
                          '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];*/
                        return colorList[params.dataIndex%5]
                    }
                  }
                },
            }]
        });   
    }

  render() {
    // 为图标设置动态的高度
    // // dailyBillPrice:false,
        // dailyDishCount:true,
        // dailyTimeSect:false
    return (
      <div>
        {
          this.props.activeChart ==='dailyBillPrice'?
          <div>
            <h4>客单价-数量 散点图[散点高且密集地方属于消费重点价位]</h4>
            <div id="mychart" style={{height:500}}></div>
            <h4>说明    [散点高且密集地方属于消费重点价位]</h4>
            <hr/>
          </div>
          :
          null
        }


          
          <div>
            
            <div id="dishchart" style={{height:800}} 
              className={this.props.activeChart ==='dailyDishCount'? "showChart":"hideChart"}>
              <h4>菜品-销量 排行</h4>
            </div>
            <hr/>
          </div>

        
      </div>
    )
  }
}
export default Chart

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
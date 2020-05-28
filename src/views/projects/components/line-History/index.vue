<template>
  <div id="lineHistory">
    <LineChart ref="outputLevel" chart-id="outputLevel" style="height:700px"/>
    <!-- <LineChart ref="output_chart" chart-id="output_chart" style="height:350px"/>
    <LineChart ref="output_liquid" chart-id="output_liquid" style="height:350px"/> -->
    <LineChart ref="ele-chart" chart-id="ele-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="power-chart" chart-id="power-chart" style="height:350px"/>
    <LineChart ref="balance-chart" chart-id="balance-chart" style="height:350px"/>
  </div>
</template>

<script>
import LineChart from "@/components/ECharts/LineMarker";
import { getHistoryData,viewPowersMonth } from "@/api/welldetail";
import { ApiGetElectdata,ApiGetPower} from "@/api/realdata";
import dayjs from "dayjs";
export default {
  name: "lineHistory",
  components: {
    LineChart
  },
  watch: {},
  data() {
    return {
    };
  },
  methods: {
    //搜索日产量折线图
    getOutputChart(id, date) {
     function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("YYYY/MM/DD");
        } else {
          return "";
        }
      }
      let lines = {};
      lines = {
        wellid: id,
        action: "line",
        daterange: date,
        welldetail:"",
      };
      getHistoryData(lines).then(({ data }) => {
        let output_list = [];
        let dates_list = [];
        let level = [];
        // this.monthList = data.powers_month_list;
        data.msg.forEach(item => {
          dates_list.push(dataFormat(item.time));
          output_list.push(item.output);
          level.push(item.level);
        });
        dates_list.reverse();
        output_list.reverse();
        level.reverse()
        let option = {
          title: {
            text: "产量和液面高度关系图",
            left: "center"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: ["产量", "液面高度"],
            left: 10
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          axisPointer: {
            link: { xAxisIndex: "all" }
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: [0, 1]
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: [0, 1]
            }
          ],
          grid: [
            {
              left: 50,
              right: 50,
              height: "35%"
            },
            {
              left: 50,
              right: 50,
              top: "55%",
              height: "35%"
            }
          ],
          xAxis: [
            {
              name:"时间",
              type: "category",
              data: dates_list,
            },
            {
              gridIndex: 1,
              name:"时间",
              type: "category",
              data: dates_list,
              position: "top",
            }
          ],
          yAxis: [
            {
              name: "产量(吨)",
              type: "value",
            },
            {
              gridIndex: 1,
              name: "液面高度(米)",
              type: "value",
              inverse: true
            }
          ],
          series: [
            {
              name: "产量",
              smooth:true,
              type: "line",
              symbolSize: 8,
              hoverAnimation: false,
              data:output_list
            },
            {
              name: "液面高度",
              smooth:true,
              type: "line",
              xAxisIndex: 1,
              yAxisIndex: 1,
              symbolSize: 8,
              hoverAnimation: false,
              data: level
            }
          ]
        } 
        this.$refs["outputLevel"].initChart(option);
      });
    },
    //电流曲线图
    getEleChart(id) {
      ApiGetElectdata({id:id,p_type:'3',json:''}).then(({data}) =>{
        let P144data = data.datas;
        let time = data.time;
        let displacement = data.displacement
        let max = displacement[0]
        let subScript = 0
        for(let i = 0;i< displacement.length; i++){
          if (displacement[i] > max){
            max = displacement[i]
            subScript = i
          }
        }
        let  x_list = []
        var j = 0; 
        for (let i = 0 ; i < 145; i ++)
          x_list.push(i)
        let customOption = {
          title: {
            text: "电流点位曲线:"+time,
            left: "center"
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              var tip = "";
              let marker0 = params[0].marker
              let marker1 = params[1].marker
              if(params[0].dataIndex <= subScript){
                tip = params[0].axisValue+'<br />';
                tip = tip + marker0 +'上电流:'+ params[0].value
                return tip;
              }else{
                tip = params[0].axisValue+'<br />';
                tip = tip + marker1 +'下电流:'+ params[1].value
                return tip;
              }
            },
          },
          legend: {
            left: 10,
            data: ['上电流','下电流']
          },
          grid: [
            {
              left: 50
            }
          ],
          xAxis: {
            name:"点位数",
            type: "category",
            data: x_list,
          },
          yAxis: {
            type: "value",
            name: "安培",
            axisLabel: {
              fontSize: 14
            }
          },
          series: [
            {
              name: '上电流',
              type: 'line',
              data:[]
            },
            {
              name: '下电流',
              type: 'line',
              data:[]
            }
          ]
        };
        let upCurrent = []
        let downCurrent = []
        for(let i = 0;i < P144data.length;i++){
          if(i <= subScript){
            upCurrent.push(P144data[i])
            downCurrent.push('-')
          } else{
            upCurrent.push('-')
            downCurrent.push(P144data[i])
          }
        }
        downCurrent[subScript] = upCurrent[subScript]
        if (customOption && typeof customOption === "object") {
          customOption.series[0].data = upCurrent;
          customOption.series[1].data = downCurrent;
          this.$refs["ele-chart"].initChart(customOption);
        }
      })
    },
    //获取有功曲线图
    getPowerChart(id,date){
      function dateFormat(date) {
        if (date) {
          date *= 1000
          return dayjs(date).format('YYYY/MM/DD')
        } else {
          return ''
        }
      }
      ApiGetPower({
        active:"",
        well_id:id,
        daterange:date
      }).then(({data}) =>{
        let active = [];
        let dates_list = [];
        data.msg.forEach(item => {
          dates_list.push(dateFormat(item.time));
          active.push(item.active);
        });
        dates_list.reverse();
        active.reverse()
        let power = {
          title: {
            text: "有功"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: [
            {
              left: 50
            }
          ],
          xAxis: {
            type: "category",
            name: "时间",
            data: dates_list
          },
          yAxis: {
            type: "value",
            name: "千瓦",
            axisLabel: {
              fontSize: 14
            }
          },
          series: [
            {
              name: "功率",
              smooth: true, //光滑
              data: active,
              type: "line",
              itemStyle: {
                normal: {
                  label: {
                    show: false, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        }
        this.$nextTick(()=>{
          this.$refs["power-chart"].initChart(power);
        });
      })
    },
    //获取平衡率曲线图
    getBalanceChart(id,date){
      viewPowersMonth({id:id,daily:"",daterange:date}).then(({data}) =>{
        let balance = [];
        let dates_list = [];
        data.msg.forEach(item => {
          dates_list.push(item.date);
          balance.push(item.balance);
        });
        dates_list.reverse()
        balance.reverse()
        let option3 = {
          title: {
            text: "平衡率",
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: []
          },
          grid: [
            {
              left: 50
            }
          ],
          xAxis: {
            name: "时间",
            type: "category",
            triggerEvent: true, //为标签添加触发事件
            data: dates_list
          },
          yAxis: {
            type: "value",
            minInterval: 0.3,
            name: "米",
            axisLabel: { fontSize: 14 },
          },
          series: {
            name: "平衡度",
            smooth: true, //光滑
            type: "line",
            data: balance,
            itemStyle: {
              normal: {
                label: {
                  show: false, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16
                  }
                }
              }
            }
          }
        };
        this.$nextTick(()=>{
          this.$refs["balance-chart"].initChart(option3);
        })
      })
    }
  },
};
</script>

<style>
</style>
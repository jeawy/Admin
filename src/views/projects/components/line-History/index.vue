<template>
  <div id="lineHistory">
    <LineChart ref="output_chart" chart-id="output_chart" style="height:350px"/>
    <LineChart ref="output_liquid" chart-id="output_liquid" style="height:350px"/>
    <LineChart ref="ele-chart" chart-id="ele-chart" style="height:350px"/>
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
    return {};
  },
  methods: {
    //搜索日产量折线图
    getOutputChart(id, date) {
     function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("MM/DD");
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
        let Output = {
          title: {
            text: "日产量折线图",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18],
            left: "left",
            top: 0
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: []
          },
          xAxis: {
            name: "时间",
            nameTextStyle: { fontSize: 16 },
            type: "category",
            triggerEvent: true, //为标签添加触发事件
            axisLabel: {
              fontSize: 14
            },
            data: dates_list
          },
          yAxis: {
            type: "value",
            minInterval: 10,
            name: "吨",
            splitLine: { show: false },
            axisLabel: { fontSize: 14 },
            nameTextStyle: { fontSize: 16 }
          },
          series: {
            name: "产量",
            type: "line",
            barWidth: 20,
            data: output_list,
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
        this.$refs["output_chart"].initChart(Output);
        let OutputLiquid = {
          title: {
            text: "液面折线图",
            textStyle: {
              fontSize: 20
            },
            // padding:[1,40,23,60],
            padding: [1, 18]
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            name: "时间",
            boundaryGap: false,
            data: dates_list
          },
          yAxis: {
            type: "value",
            name: "米",
            axisLabel: { fontSize: 14 }
          },
          series: [
            {
              name: "液面",
              data: level,
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
              },
              areaStyle: {}
            }
          ]
        };
        this.$refs["output_liquid"].initChart(OutputLiquid);
      });
    },
    //电流曲线图
    getEleChart(wellid) {
      ApiGetElectdata({id:wellid,p_type:'3',json:''}).then(res =>{
        let P144data =res.data.datas;
        let time = res.data.time;
        let  x_list = []
           for (let i = 0 ; i < 145; i ++)
             x_list.push(i)
      let customOption = {
        title: {
          text: "电流曲线:"+time 
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
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
            smooth: true,//光滑
            data: P144data,
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
      };
      this.$refs["ele-chart"].initChart(customOption);
      })
    },
    //获取有功曲线图
    getPowerChart(id,date){
      function dateFormat(date) {
        if (date) {
          date *= 1000
          return dayjs(date).format('YYYY/MM/DD HH:mm')
        } else {
          return ''
        }
      }
      ApiGetPower({
        active:"",
        well_id:id,
        daterange:date
      }).then(({data}) =>{
        console.log(data)
        let active = [];
        let dates_list = [];
        data.msg.forEach(item => {
          dates_list.push(dateFormat(item.time));
          active.push(item.active);
        });
        let power = {
          title: {
            text: "有功"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            name: "时间",
            data: dates_list
          },
          yAxis: {
            type: "value",
            name: "有功",
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
        let option3 = {
          title: {
            text: "平衡度 ",
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: []
          },
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
  mounted() {
    this.getEleChart();
  }
};
</script>

<style>
</style>
<template>
  <div id="lineHistory">
    <LineChart ref="outputLevel" chart-id="outputLevel" style="height:700px" @click-item="handleClickChart"/>
    <LineChart v-if="this.well_type == 0" ref="udEle-chart" chart-id="udEle-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="ele-chart" chart-id="ele-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="ele-history" chart-id="ele-history" style="height:350px"/>
    <LineChart ref="power-chart" chart-id="power-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="balance-chart" chart-id="balance-chart" style="height:350px;margin-top:10px"/>
    <el-dialog :visible.sync="dialogShow" title="当天数据" :style="styleObject">
      <!-- <el-row style="font-size:16px;margin-bottom:10px">
        <el-col :span="10">井号：{{this.well_name}}</el-col>
        <el-col :span="10">当天时间：{{this.time}}</el-col>
      </el-row> -->
      <el-table
        :data="realdata"
        stripe
        :border="true"
        style="width: 100%;"
        :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
        :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
        <el-table-column label="上报时间" width="160px" align="center">
          <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
        </el-table-column>
        <el-table-column prop="level" label="动液面(米)" width="130px" align="center"></el-table-column>
        <el-table-column prop="output" label="产量(吨)" width="130px" align="center"></el-table-column>
        <el-table-column prop="balance" label="平衡度(米)" width="130px" align="center"></el-table-column>
        <el-table-column prop="active" label="有功(千瓦)" width="130px" align="center"></el-table-column>
        <el-table-column v-if="well_type == 0" prop="up" label="上电流(安培)" width="130px" align="center"></el-table-column>
        <el-table-column v-else prop="electric_current" label="电流(安培)" width="130px" align="center"></el-table-column>
        <el-table-column v-if="well_type == 0" prop="down" label="下电流(安培)" width="130px" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import LineChart from "@/components/ECharts/LineMarker";
import { getHistoryData,viewPowersMonth } from "@/api/welldetail";
import { ApiGetElectdata,ApiGetPower,ApiGetEleHistory,ApiGetWellData,ApiGetUDEleHis} from "@/api/realdata";
import dayjs from "dayjs";
export default {
  name: "lineHistory",
  components: {
    LineChart
  },
  watch: {},
  data() {
    return {
      dialogShow:false,
      well_name:"",
      wellId:"",
      time:"",
      realdata:[],
      well_type:"",
      styleObject: {
        width:'1701px'
      }
    };
  },
  methods: {
    //格式化时间日期
    dataFormat(params) {
      if (params) {
        params *= 1000;
        return dayjs(params).format("YYYY/MM/DD");
      } else {
        return "";
      }
    },
    //搜索日产量折线图
    getOutputChart(id, date) {
     this.wellId = id
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
          dates_list.push(this.dataFormat(item.time));
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
    //获取电流历史数据
    getEleHistory(id, date){
      ApiGetEleHistory({well_id:id,electricity:"",time_range:date}).then(({data}) =>{
        this.well_name = data.msg.well_name
        let time_list = []
        data.msg.times.forEach(item => {
          time_list.push(this.dataFormat(item));
        });
        let electrics = data.msg.electrics
        time_list.reverse()
        electrics.reverse()
        let option = {
          title: {
            text: "历史电流曲线",
            left: "center"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: [
            {
              left: 50
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            }
          ],
          xAxis: {
            type: "category",
            name: "时间",
            data: time_list
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
              name: "电流",
              smooth: true, //光滑
              data: electrics,
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
          this.$refs["ele-history"].initChart(option);
        });
      })
    },
    //获取井的实时数据
    getWellData(){
      ApiGetWellData({well_id:this.wellId,time:this.time}).then(({data}) =>{
        this.realdata = data.msg
        console.log(data.msg)
      })
    },
    //电流曲线图
    getEleChart(id,wellType) { //wellType==0表示抽油机，wellType==1表示螺杆泵
      this.well_type = wellType
      ApiGetElectdata({id:id,p_type:'3',json:''}).then(({data}) =>{
        let P144data = data.datas;
        let time = data.time;
        let subScript = 0
        let upCurrent = []
        let downCurrent = []
        let series = []
        if(wellType == 0){
          this.styleObject = {
            width:'1960px'
          }
          let displacement = data.displacement
          let max = displacement[0]
          for(let i = 0;i< displacement.length; i++){
            if (displacement[i] > max){
              max = displacement[i]
              subScript = i
            }
          }
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
          series = [
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
        }else{
          series = [
            {
              name: '电流',
              type: 'line',
              data:[]
            }
          ]
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
              let tip = "";
              if(params.length > 1){
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
              }else{
                let marker = params[0].marker
                tip = params[0].axisValue+'<br />';
                tip = tip + marker +'电流:'+ params[0].value
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
          series: series
        };
        if (customOption && typeof customOption === "object") {
          if(wellType == 0){
            customOption.series[0].data = upCurrent;
            customOption.series[1].data = downCurrent;
          }else{
            customOption.series[0].data = P144data
          }
          this.$refs["ele-chart"].initChart(customOption);
        }
      })
    },
    //抽油机上下电流历史数据
    getUDEleHis(id,date){
      ApiGetUDEleHis({wellid:id,line:"",daterange:date}).then(({data}) =>{
        let upElectric = [];               //上电流
        let downElectric = [];             //下电流
        let dates_list = [];                //时间
        data.msg.forEach(item =>{
          upElectric.push(item.up)
          downElectric.push(item.down)
          dates_list.push(this.dataFormat(item.date))
        })
        let udEle = {
          title: {
            text: "上下电流历史数据",
            left: "center"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: [
            {
              left: 50
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            }
          ],
          legend: {
            left: 10,
            data: ['上电流','下电流']
          },
          xAxis: {
            type: "category",
            name: "时间",
            data: dates_list
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
              name: "上电流",
              smooth: true, //光滑
              data: upElectric,
              type: "line",
            },
            {
              name: "下电流",
              smooth: true, //光滑
              data: downElectric,
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
          this.$refs["udEle-chart"].initChart(udEle);
        });
      })
    },
    //获取有功曲线图
    getPowerChart(id,date){
      ApiGetPower({
        well_id:id,
        daterange:date
      }).then(({data}) =>{
        let active = [];
        let dates_list = [];
        data.msg.forEach(item => {
          dates_list.push(this.dataFormat(item.time));
          active.push(item.active);
        });
        dates_list.reverse();
        active.reverse()
        let power = {
          title: {
            text: "有功曲线",
            left: "center"
          },
          tooltip: {
            trigger: "axis"
          },
          grid: [
            {
              left: 50
            }
          ],
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
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
            text: "平衡率曲线",
            left: "center"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: []
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            },
            {
              type: "inside",
              realtime: true,
              start: 30,
              end: 70,
              xAxisIndex: 0
            }
          ],
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
    },
    //点击产量和液面高度图
    handleClickChart(params){
      this.dialogShow = true
      this.time = params.name
      this.getWellData()
    }
  },
  created() {
    // this.GetRealdata();
  },
};
</script>

<style>
</style>
<template>
  <div id="lineHistory">
    <LineChart ref="outputLevel" chart-id="outputLevel" style="height:700px" @click-item="handleClickChart"/>
    <LineChart v-if="this.well_type == 0" ref="udEle-chart" chart-id="udEle-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="ele-chart" chart-id="ele-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="ele-history" chart-id="ele-history" style="height:350px"/>
    <LineChart ref="power-chart" chart-id="power-chart" style="height:350px;margin-top:10px"/>
    <LineChart v-if = "well_type == 0" ref="balance-chart" chart-id="balance-chart" style="height:350px;margin-top:10px"/>
    <LineChart v-if = "well_type == 0" ref="displace-chart" chart-id="displace-chart" style="height:350px;margin-top:10px"/>
    <LineChart ref="active-chart" chart-id="active-chart" style="height:350px;margin-top:10px"/>
    
    <!-- <LineChart ref="ele-historychart" chart-id="ele-historychart" style="height: 350px;margin-top:10px " /> -->
    <!-- <div style="text-align:center;">
      <el-button icon="el-icon-arrow-left" @click="leftLine" :disabled="leftDisabled"></el-button>
      <el-button icon="el-icon-arrow-right" @click="rightLine" :disabled="rightDisabled"></el-button>
      <span class="dailylength" style="margin-left:20px">历史数据个数:{{elelength}}</span>
      <span class="dailylength" style="margin-left:20px" v-show="currEleDiasbled">当前展示第{{this.elestart_index+1}}、{{this.elestart_index+2}}、{{this.elestart_index+3}}组数据</span>
    </div>
   
    <LineChart ref="work_chart" chart-id="work_chart" style="height: 350px;margin-top:10px" />
    <div style="text-align:center;">
      <el-button icon="el-icon-arrow-left" @click="leftWorkLine" :disabled="leftWorkDis"></el-button>
      <el-button icon="el-icon-arrow-right" @click="rightWorkLine" :disabled="rightWorkDis"></el-button>
      <span class="dailylength" style="margin-left:20px;">历史数据个数:{{worklength}}</span>
      <span class="dailylength" style="margin-left:20px" v-show="currWorkDiasbled">当前展示第{{this.workstart_index+1}}、{{this.workstart_index+2}}、{{this.workstart_index+3}}组数据</span>
    </div> -->
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
        <el-table-column prop="balance" label="平衡度" width="130px" align="center">
          <template slot-scope="scope">
            <div v-if="well_type==0">
              <span>{{scope.row.balance}}</span>
            </div>
            <div v-if="well_type==1">
              <span>{{"-"}}</span>
            </div>
          </template>
        </el-table-column>
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
import { ApiGetElectdata ,ApiGetHistorydatas,ApiGetPowerdata,ApiGetPower,ApiGetEleHistory,ApiGetWellData,ApiGetUDEleHis} from "@/api/realdata";
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
      },
      // x_list1: [],
      // number0: "",
      // number: "",
      // leftDisabled: false,
      // rightDisabled: true,
      // leftWorkDis: false,
      // rightWorkDis: true,
      // currEleDiasbled:false,//控制电流当前第几组数据的显示和隐藏
      // currWorkDiasbled:false,//控制有功当前第几组数据的显示和隐藏
      // worklength: [],
      // elelength: [],
      // elestart_index: 0,
      // eleend_index: 0,
      // workstart_index: 0,
      // workend_index: 0,
      // tempele: [],
      // tempWork: [],
      // reset: false,
      // e_current_page:1,
      // w_current_page:1,
      // P144data: [],
      // interval: 11,
      // datatype: 0,
      // splitLine1: "", //分隔线1
      // splitLine2: "", //分隔线2
      // splitLine3: "", //分隔线3
      // P144Workdata: [],
      // searchid:'',
      // searchdate:'',
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
    // //电流初始化时
    // getEleWork(id,date) {
    //   this.searchid = id
    //   this.searchdate = date
    //   let eleparams = {};
    //   eleparams = {
    //     id: id,
    //     history: "",
    //     p_type: "3",
    //     daterange: date
    //   };
    //   if(this.e_current_page >1){
    //     eleparams.page = this.e_current_page;
    //   }
    //   ApiGetHistorydatas(eleparams).then(res => {
    //     this.elelength = res.data.msg.totalcount;
    //     if(this.elelength==0){
    //       this.currEleDiasbled=false;//当电流历史数据为0时，隐藏电流的当前第几组数据
    //     }else{
    //       this.currEleDiasbled=true;//当电流历史数据不为0时，显示电流的当前第几组数据
    //     }
    //     if (this.reset == false) {
    //         this.interval = 11;
    //         this.datatype = 0;
    //         this.number = 144;
    //         this.number1 = 154;
    //     }
    //     // this.list = res.data.msg.data[0];
    //     if(this.e_current_page === 1){
    //       this.P144data = res.data.msg.data;
    //       let width = 3;
    //       this.elestart_index = 0;
    //       this.eleend_index = this.elestart_index + width;
    //     }
    //     if(this.e_current_page > 1){
    //       this.P144data = [...this.P144data,...res.data.msg.data];
    //     }
    //     let array_datas = [];
    //     for (let i = this.elestart_index; i < this.eleend_index; i++) {
    //       array_datas.push(this.P144data[i]);
    //     }
    //     if (array_datas[2] == undefined) {
    //       array_datas.pop();
    //     }
    //     if (array_datas[1] == undefined) {
    //       array_datas.pop();
    //     }
    //     if (array_datas[0] !== undefined) {
    //       array_datas.forEach(t => {
    //         this.tempele = this.tempele.concat(t.datas);
    //       });
    //     }
    //     this.getEleChart();
    //     if (this.elelength > 3) {
    //       this.leftDisabled = false;
    //       this.rightDisabled = true;
    //     } else if (this.elelength <= 3) {
    //       this.leftDisabled = true;
    //       this.rightDisabled = true;
    //     }
    //   });
    // },
    // //调用历史有功数据
    // getWork(id,date) {
    //   let workparams = {};
    //     workparams = {
    //       id: id,
    //       history: "",
    //       p_type: "2",
    //       daterange: date
    //     };
      
    //   if(this.w_current_page > 1){
    //     workparams.page = this.w_current_page;
    //   }
    //   ApiGetHistorydatas(workparams).then(res => {
    //     this.worklength = res.data.msg.totalcount;
    //     if(this.worklength==0)
    //     {
    //       this.currWorkDiasbled=false;//当有功历史数据为0时，隐藏有功的当前第几组数据
    //     }
    //     else
    //     {
    //       this.currWorkDiasbled=true;//当有功历史数据不为0时，显示有功的当前第几组数据
    //     }
    //     if (this.reset == false) {
    //         this.interval = 11;
    //         this.datatype = 0;
    //         this.number = 144;
    //         this.number1 = 154;
    //     } else {
    //         this.number = 144;
    //         this.number1 = 154;
    //         this.interval = 11;
    //     }
    //     if(this.w_current_page === 1){
    //        this.P144Workdata = res.data.msg.data;
    //        let width1 = 3;

    //        this.workstart_index = 0;

    //        this.workend_index = this.workstart_index + width1;
    //     }
    //     if(this.w_current_page > 1){
    //       this.P144Workdata = [...this.P144Workdata,...res.data.msg.data];
    //     }
    //     let array_datas1 = [];
    //     for (let i = this.workstart_index; i < this.workend_index; i++) {
    //       array_datas1.push(this.P144Workdata[i]);
    //     }
    //     if (array_datas1[2] == undefined) {
    //       array_datas1.pop();
    //     }
    //     if (array_datas1[1] == undefined) {
    //       array_datas1.pop();
    //     }
    //     if (array_datas1[0] !== undefined) {
    //       array_datas1.forEach(t => {
    //         this.tempWork = this.tempWork.concat(t.datas);
    //       });
    //     }
    //     this.getWorkChart();
    //     if (this.worklength > 3) {
    //       this.leftWorkDis = false;
    //       this.rightWorkDis = true;
    //     } else if (this.worklength <= 0) {
    //       this.leftWorkDis = true;
    //       this.rightWorkDis = true;
    //     }
    //   });
    // },
    // //电流左移
    // leftLine() {
    //   this.rightDisabled = false;
    //   this.tempele = [];
    //   this.x_list1 = [];
    //   let width = 3;
    //   this.elestart_index += 1;
    //   this.eleend_index = this.elestart_index + width;
    //   if(this.eleend_index % 20 === 0){
    //      this.e_current_page += 1;
    //      this.getEleWork(this.searchid,this.searchdate);
    //   }
    //   let array_datas = [];
    //   for (let i = this.elestart_index; i < this.eleend_index; i++) {
    //     array_datas.push(this.P144data[i]);
    //   }
    //   if (array_datas.length) {
    //     array_datas.forEach(t => {
    //       this.tempele = this.tempele.concat(t.datas);
    //     });
    //   }
    //   if (this.eleend_index <= this.elelength) {
    //     this.rightDisabled = false;
    //     this.getEleChart();
    //     if (this.eleend_index == this.elelength) {
    //       this.leftDisabled = true;
    //     }
    //   } else {
    //     this.leftDisabled = true;
    //     this.rightDisabled = false;
    //   }
    // },
    // //电流右移
    // rightLine() {
    //   this.tempele = [];
    //   this.x_list1 = [];
    //   let width = 3;
    //   this.elestart_index -= 1;
    //   this.eleend_index = this.elestart_index + width;
    //   let array_datas = [];
    //   for (let i = this.elestart_index; i < this.eleend_index; i++) {
    //     array_datas.push(this.P144data[i]);
    //   }
    //   if (array_datas.length) {
    //     array_datas.forEach(t => {
    //       this.tempele = this.tempele.concat(t.datas);
    //     });
    //   }
    //   if (this.elestart_index >= 0) {
    //     this.leftDisabled = false;
    //     this.getEleChart();
    //     if (this.elestart_index == 0) {
    //       this.rightDisabled = true;
    //     }
    //   } else {
    //     this.rightDisabled = true;
    //     this.leftDisabled = false;
    //   }
    // },
    // //有功左移
    // leftWorkLine() {
    //   this.x_list1 = [];
    //   this.tempWork = [];
    //   let width = 3;
    //   this.workstart_index += 1;
    //   this.workend_index = this.workstart_index + width;
    //   if(this.workend_index % 20 === 0){
    //     this.w_current_page += 1;
    //     this.getWork(this.searchid,this.searchdate);
    //   }
    //   let array_datas = [];
    //   for (let i = this.workstart_index; i < this.workend_index; i++) {
    //     array_datas.push(this.P144Workdata[i]);
    //   }
    //   if (array_datas.length) {
    //     array_datas.forEach(t => {
    //       this.tempWork = this.tempWork.concat(t.datas);
    //     });
    //   }
    //   console.log(this.workstart_index)
    //   if (this.workend_index <= this.worklength) {
    //     this.getWorkChart();
    //     this.rightWorkDis = false;

    //     if (this.workend_index == this.worklength) {
    //       this.leftWorkDis = true;
    //     }
    //   } else {
    //     this.leftWorkDis = true;
    //     this.rightWorkDis = false;
    //   }
    // },    
    // //有功右移
    // rightWorkLine() {
    //   this.tempWork = [];
    //   this.x_list1 = [];
    //   let width = 3;
    //   this.workstart_index -= 1;
    //   this.workend_index = this.workstart_index + width;
    //   let array_datas = [];
    //   for (let i = this.workstart_index; i < this.workend_index; i++) {
    //     array_datas.push(this.P144Workdata[i]);
    //   }
    //   if (array_datas.length) {
    //     array_datas.forEach(t => {
    //       this.tempWork = this.tempWork.concat(t.datas);
    //     });
    //   }
    //   if (this.workstart_index >= 0) {
    //     this.getWorkChart();
    //     this.leftWorkDis = false;
    //     if (this.workstart_index == 0) {
    //       this.rightWorkDis = true;
    //     }
    //   } else {
    //     this.rightWorkDis = true;
    //     this.leftWorkDis = false;
    //   }
    // },
    // // 获取历史电流和有功数据
    // //电流曲线图
    // getEleChart() {
    //   this.x_list1 = [];
    //   let x_list = [];
    //   let x_list1 = [];
    //   let x_list2 = [];
    //   for (let i = 1; i <= this.number + 1; i++) {
    //       x_list.push(i);
    //     }
    //     for (let i = 1; i <= this.number + 1; i++) {
    //       x_list1.push(i);
    //     }
    //     for (let i = 1; i <= this.number1 + 1; i++) {
    //       x_list2.push(i);
    //     }
    //   this.x_list1 = x_list.concat(x_list1).concat(x_list2);
    //   this.splitLine1 = 144;
    //     this.splitLine2 = 289;
    //     this.splitLine3 = 434;
    //   let value = ""; //存储将坐标点转换为数字格式后的坐标点
    //   let times = 1;
    //   let customOption = {
    //     title: {
    //       text: "电流A",
    //       left: "center"
    //     },
    //     tooltip: {
    //       trigger: "axis",
    //       position: function(point, params, dom, rect, size) {
    //         //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
    //         var x = point[0]; //
    //         var y = point[1];
    //         var viewWidth = size.viewSize[0];
    //         var viewHeight = size.viewSize[1];
    //         var boxWidth = size.contentSize[0];
    //         var boxHeight = size.contentSize[1];
    //         var posX = 0; //x坐标位置
    //         var posY = 0; //y坐标位置
    //         if (x < boxWidth) {
    //           //左边放不开
    //           posX = x + 10;
    //         } else {
    //           //左边放的下
    //           posX = x - boxWidth;
    //         }
    //         if (y < boxHeight) {
    //           //上边放不开
    //           posY = 0;
    //         } else {
    //           //上边放得下
    //           posY = y - boxHeight;
    //         }
    //         return [posX, posY];
    //       }
    //     },
    //     grid: [
    //         {
    //           left: 50
    //         }
    //       ],
    //     xAxis: {
    //       type: "category",
    //       data: this.x_list1,
    //       name: "点数",
    //       //    min:1,
    //       nameTextStyle: { fontSize: 16 },
    //       boundaryGap: false,
    //       axisLabel: {
    //         interval: 0,
    //         fontSize: 13,
    //         formatter: function(value, index) {
    //           if (times == 1 && (value == 1 || value == "1")) {
    //             return 1;
    //           }
    //           times += 1;
    //           var intvalue = parseInt(value);
    //             if (value!=1&&value % 12 == 1) {
    //               return value;
    //             }
    //         }
    //       }
    //     },
    //     yAxis: {
    //       type: "value",
    //       name: "安培",
    //       nameTextStyle: { fontSize: 16 }
    //     },
    //     series: [
    //       {
    //         name: "电流量",
    //         symbol: "none",
    //         smooth: true, //光滑
    //         data: this.tempele,
    //         type: "line",
    //         itemStyle: {
    //           normal: {
    //             label: {
    //               show: false, //开启显示
    //               position: "top", //在上方显示
    //               textStyle: {
    //                 //数值样式
    //                 color: "black",
    //                 fontSize: 16
    //               }
    //             }
    //           }
    //         },
    //         markLine: {
    //           symbol: "none", //去掉警戒线最后面的箭头
    //           silent: true, //鼠标悬停事件  true没有，false有
    //           data: [
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine1
    //             },
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine2
    //             },
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine3
    //             }
    //           ]
    //         }
    //       }
    //     ]
    //   };
    //   this.$nextTick(() => {
    //     this.$refs["ele-historychart"].initChart(customOption);
    //   });
    //   this.tempele = [];
    // },
    // //有功曲线图
    // getWorkChart() {
    //   this.x_list1 = [];
    //   let x_list = [];
    //   let x_list1 = [];
    //   let x_list2 = [];
    //     for (let i = 1; i <= this.number + 1; i++) {
    //       x_list.push(i);
    //     }

    //     for (let i = 1; i <= this.number + 1; i++) {
    //       x_list1.push(i);
    //     }

    //     for (let i = 1; i <= this.number1 + 1; i++) {
    //       x_list2.push(i);
    //     }
    //   this.x_list1 = x_list.concat(x_list1).concat(x_list2);
    //     this.splitLine1 = 144;
    //     this.splitLine2 = 289;
    //     this.splitLine3 = 434;
    //   let times = 1;
    //   let customOption1 = {
    //     title: {
    //       text: " 有功kw",
    //       left: "center"
    //     },
    //     tooltip: {
    //       trigger: "axis",
    //       position: function(point, params, dom, rect, size) {
    //         //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
    //         var x = point[0]; //
    //         var y = point[1];
    //         var viewWidth = size.viewSize[0];
    //         var viewHeight = size.viewSize[1];
    //         var boxWidth = size.contentSize[0];
    //         var boxHeight = size.contentSize[1];
    //         var posX = 0; //x坐标位置
    //         var posY = 0; //y坐标位置
    //         if (x < boxWidth) {
    //           //左边放不开
    //           posX = x + 10;
    //         } else {
    //           //左边放的下
    //           posX = x - boxWidth;
    //         }
    //         if (y < boxHeight) {
    //           //上边放不开
    //           posY = 0;
    //         } else {
    //           //上边放得下
    //           posY = y - boxHeight;
    //         }
    //         return [posX, posY];
    //       }
    //     },
    //     grid: [
    //         {
    //           left: 50
    //         }
    //       ],
    //     xAxis: {
    //       type: "category",
    //       data: this.x_list1,
    //       name: "点数",
    //       nameTextStyle: { fontSize: 16 },
    //       boundaryGap: false,
    //       axisLabel: {
    //         interval: 0,
    //         fontSize: 13,
    //         formatter: function(value, index) {
    //           if (times == 1 && (value == 1 || value == "1")) {
    //             return 1;
    //           }
    //           times += 1;
    //           var intvalue = parseInt(value);
    //             if (value!=1&&value % 12 == 1) {
    //               return value;
    //             }
    //         }
    //       }
    //     },
    //     yAxis: {
    //       type: "value",
    //       name: "千瓦",
    //       nameTextStyle: { fontSize: 16 }
    //     },
    //     series: [
    //       {
    //         name: "有功",
    //         symbol: "none",
    //         smooth: true, //光滑
    //         data: this.tempWork,
    //         type: "line",
    //         itemStyle: {
    //           normal: {
    //             label: {
    //               show: false, //开启显示
    //               position: "top", //在上方显示
    //               textStyle: {
    //                 //数值样式
    //                 color: "black",
    //                 fontSize: 16
    //               }
    //             }
    //           }
    //         },
    //         markLine: {
    //           symbol: "none", //去掉警戒线最后面的箭头
    //           silent: true, //鼠标悬停事件  true没有，false有
    //           data: [
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine1
    //             },
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine2
    //             },
    //             {
    //               lineStyle: {
    //                 //警戒线的样式  ，虚实  颜色
    //                 type: "solid",
    //                 color: "graylight"
    //               },
    //               xAxis: this.splitLine3
    //             }
    //           ]
    //         }
    //       }
    //     ]
    //   };
    //   this.$refs["work_chart"].initChart(customOption1);
    //   this.tempWork = [];
    // },
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
    //获取井的实时数据
    getWellData(){
      ApiGetWellData({well_id:this.wellId,time:this.time}).then(({data}) =>{
        this.realdata = data.msg
        // console.log(this.realdata)
      })
    },
    //电流曲线图
    getSingleEleChart(id,wellType) { //wellType==0表示抽油机，wellType==1表示螺杆泵
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
    //获取平衡度曲线图
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
            text: "平衡度曲线",
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
            name: "",
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
    //获取位移曲线图
    getDisplaceChart(id,wellType){
      ApiGetElectdata({id:id,p_type:'1',json:''}).then(({data}) =>{
        // console.log(data)
        let P144data = data.datas;
        let time = data.time;
        let y_data = []
        if(wellType == 0){
          this.styleObject = {
            width:'1960px'
          }
        }
        for(let i = 0;i < P144data.length;i++){
          y_data.push(P144data[i])
        }
        // console.log(y_data)
        let  x_list = []
        var j = 0; 
        for (let i = 0 ; i < 145; i ++)
          x_list.push(i)
        let customOption = {
          title: {
            text: "悬点轨迹:"+time,
            left: "center"
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
            name: "位移",
            axisLabel: {
              fontSize: 14
            }
          },
          series: {
            name: "位移",
            smooth: true, //光滑
            type: "line",
            data: y_data,
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
        this.$refs["displace-chart"].initChart(customOption);
      })
    },
    //获取最新的位移和有功曲线图
    getActiveChart(id,wellType){
      function dateTimeFormat(date) {
        if (date) {
          date *= 1000
          return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
        } else {
          return ''
        }
      }
      ApiGetPowerdata({id:id}).then(({data}) =>{
        let displacement = data.displacement.displacement
        let active = data.active.displacement
        let time = dateTimeFormat(data.active.time);
        let y_data = []
        this.styleObject = {
          width:'1960px'
        }
        for(let i = 0;i < active.length;i++){
          y_data.push(active[i])
        }
        // console.log(y_data)
        let  x_list = []
        let name = ""
        var j = 0; 
        if(wellType == 0){
          for (let i = 0 ; i < displacement.length; i ++)
            x_list.push(displacement[i])
            name = "位移"
        }else{
          for (let i = 0 ; i < 145; i ++)
            x_list.push(i)
            name = "点位数"
        }
        let customOption = {
          title: {
            text: "有功曲线:"+time,
            left: "center"
          },
          grid: [
            {
              left: 50
            }
          ],
          xAxis: {
            name:name,
            type: "category",
            data: x_list,
          },
          yAxis: {
            type: "value",
            name: "有功",
            axisLabel: {
              fontSize: 14
            }
          },
          series: {
            name: "有功",
            smooth: true, //光滑
            type: "line",
            data: y_data,
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
        this.$refs["active-chart"].initChart(customOption);
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
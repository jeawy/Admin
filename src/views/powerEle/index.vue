<template>
  <div id="powerele">
    <div class="data-title">
      <div class="title-text">历史数据曲线</div>
    </div>
    <div class="data-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="4">
            井名&nbsp;:&nbsp;
            <el-select
              v-model="wellname"
              placeholder="请选择"
              style="width: 130px"
              @change="getWellDetails(wellname)"
              filterable
            >
              <el-option
                v-for="(item, index) of wellList"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :lg="6" class="col-bg" v-if="datePicker == ''"
            >起止日期&nbsp;:&nbsp;{{ startdate }}-{{ enddate }}</el-col
          >
          <el-col :lg="6" class="col-bg" v-else>时间范围：{{ date }}</el-col>
          <el-col :lg="3" class="col-bg">
            <el-button
              type="primary"
              @click="historyLine"
              style="margin-top: -10px"
              >时间范围查询</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="power_chart"
              chart-id="power_chart"
              style="height: 350px"
            />
          </div>
        </el-card>
      </el-row>
    </div>
    <div class="data-table">
        <el-card shadow="never" body-style="padding:0px;">
            <div>
                <el-button class="compare" type="primary" @click="powercompare()">堆叠对比</el-button>
            </div>
            <el-table
              ref="multipleTable"
              stripe
              :border="true"
              :data="tableData"
              class="power-table"
              tooltip-effect="dark"
              style="width: 98%"
              :max-height="340"
              :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400,'text-align':'center'}"
              :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,'text-align':'center'}"
              @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="时间">
                <template slot-scope="scope">{{ scope.row.time }}</template>
            </el-table-column>
            <el-table-column prop="name" label="有功">
              <template slot-scope="scope">
                {{scope.row.p144_data == null?'':scope.row.p144_data.join(' ')}}<br>
              </template>
            </el-table-column>
            </el-table>
        </el-card>
    </div>
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="power_stack"
              chart-id="power_stack"
              style="height: 350px"
            />
          </div>
        </el-card>
      </el-row>
    </div>
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="outputLevel"
              chart-id="outputLevel"
              style="height: 560px"
            />
          </div>
        </el-card>
      </el-row>
    </div>
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div class="chart">
            <LineChart
              ref="ele-history"
              chart-id="ele-history"
              style="height: 350px"
            />
          </div>
        </el-card>
      </el-row>
    </div>
    <el-dialog title="时间选择" :visible.sync="history" width="400px" top="5vh">
      <div class="history-middle">
        <el-row>
          <el-col :lg="4" :sm="4">时间:</el-col>
          <el-col :lg="20" :sm="20">
            <el-date-picker
              class="datePicker"
              v-model="datePicker"
              align="right"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="pickerOptions"
              value-format="yyyy/MM/dd"
            ></el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="16">
            <el-button
              type="primary"
              style="width: 60px; height: 30px; margin-top: 30px"
              @click="submitDate"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import LineChart from "@/components/ECharts/LineMarker";
import {
  getHistoryData
} from "@/api/welldetail";
import {
  ApiGetEleHistory,
  ApiPowerData
} from "@/api/realdata";
import { 
  ApiGetWellList
} from "@/api/wellList";
import dayjs from "dayjs";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
        wellname:"",
        wellid:"",
        wellList:[],
        startdate:"",
        enddate:"",
        datePicker:"",
        date:"",
        tableData: [],
        multipleSelection: [],
        pickerMinDate: '',
        pickerOptions: {
          // onPick: ({ maxDate, minDate }) => {
          //   this.pickerMinDate = minDate.getTime()
          //   if (maxDate) {
          //     this.pickerMinDate = ''
          //   }
          // },
          // disabledDate(time) {
          //   if (this.pickerMinDate !== '') {
          //     const day30 = (30 - 1) * 24 * 3600 * 1000
          //     let maxTime = this.pickerMinDate + day30
          //     if (maxTime > new Date()) {
          //       maxTime = new Date()
          //     }
          //     return time.getTime() > maxTime
          //   }
          //   return time.getTime() > Date.now()
          // },
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "昨天",
              onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, start]);
              }
            },
            {
              text: "最近7日",
              onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近30日",
              onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        history:false
    };
  },
  mounted() {},

  methods: {
    //时间格式化
    timeFormat(params) {
      return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
    },
    //格式化时间日期
    dateFormat(params) {
      if (params) {
        params *= 1000;
        return dayjs(params).format("YYYY/MM/DD");
      } else {
        return "";
      }
    },
    //获取近300天时间的函数
    getDateRange(dateNow,intervalDays,bolPastTime){        
      let oneDayTime = 24 * 60 * 60 * 1000;        
      let list = [];        
      let lastDay;         
      if(bolPastTime == true){            
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);            
        list.push(this.formateDate(lastDay));            
        list.push(this.formateDate(dateNow));        
      }else{            
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);            
        list.push(this.formateDate(dateNow));            
        list.push(this.formateDate(lastDay));        
      }        
      return list;     
    },
    //格式化时间
    formateDate(time){        
      let year = time.getFullYear()        
      let month = time.getMonth() + 1        
      let day = time.getDate()         
      if (month < 10) {         
        month = '0' + month        
      }         
      if (day < 10) {          
        day = '0' + day        
        }         
      return year + '/' + month + '/' + day + ''      
    },
    // 获取井号
    GetwellList() {
      ApiGetWellList().then(({data}) => {
        this.wellList = data.msg.well_list;
        this.wellid = data.msg.well_list.map(item => {
          return item.id;
        });
        this.wellname = this.wellid[0];
        this.getPowerChart(this.wellname,this.date);
        this.getOutputChart(this.wellname,this.date);
        this.getEleHistory(this.wellname,this.date);
        this.powercompare()
      });
    },
    // 查看井详情
    getWellDetails(id){
      this.getPowerChart(id,this.date);
      this.getOutputChart(id,this.date)
      this.getEleHistory(id,this.date)
    },
    // 选择日期范围
    historyLine(){
      this.history = true
    },
    // 时间选择器点确认
    submitDate() {
      this.date = this.datePicker[0] + "-" + this.datePicker[1];
      this.getPowerChart(this.wellname,this.date);
      this.getOutputChart(this.wellname,this.date);
      this.getEleHistory(this.wellname,this.date);
      this.history = false;
    },
    // 获取有功曲线图
    getPowerChart(id,daterange){
      // 横轴
      let x_list = [];
      // 纵轴  
      let active_list = [];
      // 时间
      let time = [];
      //s
      let series = [];
      for (let i = 1; i <= 145; i++) {
        x_list.push(i);
      }
      ApiPowerData({id:id,daterange:daterange}).then(({data}) =>{
        this.tableData = data.msg
        series = data.msg.map(item =>{
          return{
            name: item.time,
            showSymbol: true, // 是否显示点
            smooth: true, //光滑
            data: item.p144_data,
            type: "line"
          }
        })
        let customOption = {
          title: {
            text: " 有功kw",
            left: "center"
          },
          tooltip: {
            trigger: "axis",
            position: function(point, params, dom, rect, size) {
              //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
              var x = point[0]; //
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0; //x坐标位置
              var posY = 0; //y坐标位置
              if (x < boxWidth) {
                //左边放不开
                posX = x + 10;
              } else {
                //左边放的下
                posX = x - boxWidth;
              }
              if (y < boxHeight) {
                //上边放不开
                posY = 0;
              } else {
                //上边放得下
                posY = y - boxHeight;
              }
              return [posX, posY];
            }
          },
          grid: [
            {
              left: 50,
              right: 50,
              height: "70%"
            }
          ],
          tooltip: {
            trigger: "axis",
            position: function(point, params, dom, rect, size) {
              //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
              var x = point[0]; //
              var y = point[1];
              var viewWidth = size.viewSize[0];
              var viewHeight = size.viewSize[1];
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];
              var posX = 0; //x坐标位置
              var posY = 0; //y坐标位置
              if (x < boxWidth) {
                //左边放不开
                posX = x + 10;
              } else {
                //左边放的下
                posX = x - boxWidth;
              }
              if (y < boxHeight) {
                //上边放不开
                posY = 5;
              } else {
                //上边放得下
                posY = y;
              }
              return [posX, posY];
            }
          },
          xAxis: {
            type: "category",
            data: x_list,
            name: "点数",
            nameTextStyle: { fontSize: 16 },
            boundaryGap: false,
            axisLabel: {
              interval: 5,
              fontSize: 13
            }
          },
          yAxis: {
            type: "value",
            name: "千瓦",
            nameTextStyle: { fontSize: 16 }
          },
          series: series
        };
        this.$nextTick(() => {
          this.$refs["power_chart"].initChart(customOption);
        })
      })
    },
    // 堆叠对比
    powercompare(){
      // 横轴
      let x_list = [];
      // 纵轴  
      let active_list = [];
      // 时间
      let time = [];
      //s
      let series = [];
      for (let i = 1; i <= 145; i++) {
        x_list.push(i);
      }
      series = this.multipleSelection.map(item =>{
        return{
          name: item.time,
          showSymbol: true, // 是否显示点
          smooth: true, //光滑
          data: item.p144_data,
          type: "line"
        }
      })
      let customOption = {
        title: {
          text: " 有功堆叠比较",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          position: function(point, params, dom, rect, size) {
            //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
            var x = point[0]; //
            var y = point[1];
            var viewWidth = size.viewSize[0];
            var viewHeight = size.viewSize[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            var posX = 0; //x坐标位置
            var posY = 0; //y坐标位置
            if (x < boxWidth) {
              //左边放不开
              posX = x + 10;
            } else {
              //左边放的下
              posX = x - boxWidth;
            }
            if (y < boxHeight) {
              //上边放不开
              posY = 0;
            } else {
              //上边放得下
              posY = y - boxHeight;
            }
            return [posX, posY];
          }
        },
        grid: [
          {
            left: 50,
            right: 50,
            height: "70%"
          }
        ],
        tooltip: {
          trigger: "axis",
          position: function(point, params, dom, rect, size) {
            //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
            var x = point[0]; //
            var y = point[1];
            var viewWidth = size.viewSize[0];
            var viewHeight = size.viewSize[1];
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            var posX = 0; //x坐标位置
            var posY = 0; //y坐标位置
            if (x < boxWidth) {
              //左边放不开
              posX = x + 10;
            } else {
              //左边放的下
              posX = x - boxWidth;
            }
            if (y < boxHeight) {
              //上边放不开
              posY = 5;
            } else {
              //上边放得下
              posY = y;
            }
            return [posX, posY];
          }
        },
        xAxis: {
          type: "category",
          data: x_list,
          name: "点数",
          nameTextStyle: { fontSize: 16 },
          boundaryGap: false,
          axisLabel: {
            interval: 5,
            fontSize: 13
          }
        },
        yAxis: {
          type: "value",
          name: "千瓦",
          nameTextStyle: { fontSize: 16 }
        },
        series: series
      };
      this.$nextTick(() => {
        this.$refs["power_stack"].initChart(customOption);
      })
    },
    // 选中表格中的数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取电流曲线图
    getEleChart(){

    },
    // 获取电流表格
    getEleTable(){

    },
    // 获取电流堆叠曲线图
    getEleStack(){

    },
    //搜索日产量折线图
    getOutputChart(id,date) {
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
        data.msg.forEach(item => {
          dates_list.push(this.dateFormat(item.time));
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
    getEleHistory(id,date){
      ApiGetEleHistory({well_id:id,time_range:date}).then(({data}) =>{
        let time_list = []
        data.msg.times.forEach(item => {
          time_list.push(this.dateFormat(item));
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
    }
  },

  created() {
    var date = new Date();
    var list = this.getDateRange(date,7,true)
    this.startdate = this.timeFormat(list[0])
    this.enddate = this.timeFormat(list[1])
    this.date = this.startdate + "-" + this.enddate
    this.GetwellList();
  },
};
</script>
<style lang="scss" scoped>
#powerele {
  .row-bg {
    align-items: center;
  }
  .col-bg {
    padding: 5px 2px 0 45px;
  }
  .data-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .data-header {
    margin: 10px;
  }
  .data-chart,.data-table {
    margin: 10px;
    .elchart {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }
  .compare,.power-table{
    margin:15px
  }
  .el-table td,.el-table th{
    text-align: center !important;
  }
  .history-middle {
    margin: 10px 20px;
  }
  .datePicker {
    width: 250px;
  }

  .chart {
    padding-top: 10px;
  }
}
</style>
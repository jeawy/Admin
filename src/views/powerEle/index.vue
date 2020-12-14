<template>
  <div id="powerele">
    <div class="data-title">
      <!-- <div class="title-text">历史数据曲线</div> -->
    </div>
    <!-- <div class="data-header">
      <el-card shadow="never">
        <el-row class="row-bg">
          <el-col :lg="4">
            井名：
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
          <el-col :lg="6" class="row-bg">
            时间范围：
            <el-date-picker
              style="width:200px"
              v-model="datePicker_all"
              type="daterange"
              align="right"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="mini"
              :picker-options="pickerOptions_all"
              value-format="yyyy/MM/dd"
            ></el-date-picker>
          </el-col>
          <el-col :lg="3" class="col-bg">
            <el-button
              type="primary"
              @click="searchall"
              style="margin-top: -10px"
              >查询</el-button
            >
          </el-col>
          <el-button class="compare" type="primary" @click="powercompare()">堆叠对比</el-button>
        </el-row>
      </el-card>
    </div> -->
    <div class="data-chart">
      <el-card shadow="never" body-style="padding:0px;" v-loading="loading">
        <el-row :gutter="15" class="elchart">
          <el-col :lg="6" style="margin-top:15px">
            <el-card shadow="never" body-style="padding:0px;" class="left-mark">
            <div class="left-mark">
              井&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; 名：
              <el-select
                v-model="wellname"
                placeholder="请选择"
                style="width: 200px"
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
            </div>
            <div class="left-mark">
              时间范围：
              <el-date-picker
                style="width:200px"
                v-model="datePicker_all"
                type="daterange"
                align="right"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                size="mini"
                :picker-options="pickerOptions_all"
                value-format="yyyy/MM/dd"
              ></el-date-picker>
            </div>
            <div class="left-mark">
              <el-button type="primary" @click="searchall()">查询</el-button>
              <el-button type="primary" @click="showstack()" v-if="showchart">
                隐藏堆叠对比
              </el-button>
              <el-button type="primary" @click="showstack()" v-else>
                展示堆叠对比
              </el-button>
            </div>
            </el-card>
            <el-card shadow="never" body-style="padding:0px;" class="left-mark">
                <div class="left-mark">
                请选择检测时间点
                </div>
                <el-table
                  ref="multipleTable"
                  :data="tableData" 
                  stripe

                  class="power-table"
                  tooltip-effect="dark"
                  style="width:85%"
                  :max-height="380"
                  :header-cell-style="{color:'#212529',fontSize:'16px'}"
                  :row-style="{fontSize:'16px',color:'#212529;'}"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" align="center"></el-table-column> 
                  <el-table-column label="时间" align="center">
                    <template slot-scope="scope">{{ scope.row.time }}</template>
                  </el-table-column>
                </el-table>
                <div class="left-mark">
                  <el-button type="primary" @click="powercompare()">堆叠对比</el-button>
                </div>
            </el-card>
          </el-col>
          <el-col :lg="18">
            <div class="chart">
              <LineChart
                ref="power_chart"
                chart-id="power_chart"
                style="height: 350px"
              />
              <div style="text-align:center;">
                <el-button icon="el-icon-arrow-left" @click="leftWorkLine" :disabled="leftWorkDis"></el-button>
                <el-button icon="el-icon-arrow-right" @click="rightWorkLine" :disabled="rightWorkDis"></el-button>
                <span class="dailylength" style="margin-left:20px;">历史数据个数:{{worklength}}</span>
                <span class="dailylength" style="margin-left:20px" v-show="currentDiasbled">
                  当前展示第{{this.start_index+1}}({{time[0]}})、
                  {{this.start_index+2}}({{time[1]}})、
                  {{this.start_index+3}}({{time[2]}})组数据</span>
              </div>
            </div>
            <div class="chart" v-show="showchart">
              <LineChart
                ref="power_stack"
                chart-id="power_stack"
                style="height: 350px"
              />
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- <div class="data-table">
        <el-card shadow="never" body-style="padding:0px;">
          <div style="display:flex">
            <el-button class="compare" type="primary" @click="powercompare()">堆叠对比</el-button>
            <span @click="openExplain()" style="margin:20px">
              提示:
              <svg-icon icon-class="wenhao" />
            </span>
          </div>
          <el-table
            ref="multipleTable"
            stripe
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
            :border="true"
            class="power-table"
            tooltip-effect="dark"
            style="width: 98%"
            :max-height="340"
            :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400,'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,'text-align':'center'}"
            @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="60" align="center" ></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column label="时间" width="110" align="center">
              <template slot-scope="scope">{{ scope.row.time }}</template>
          </el-table-column>
          <el-table-column prop="name" label="有功">
            <template slot-scope="scope">
              {{scope.row.p144_data == null?'':scope.row.p144_data.join(' ')}}<br>
            </template>
          </el-table-column>
          </el-table>
          <div style="margin:15px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next"
              :total="powertabletotal">
            </el-pagination>
          </div>
        </el-card>
    </div> -->
    <!-- <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
        </el-card>
      </el-row>
    </div> -->
    <div class="data-chart">
      <el-row :gutter="15" class="elchart">
        <el-card shadow="never" body-style="padding:0px;">
          <div style="margin:10px">时间选择：
            <el-date-picker
              style="width:200px"
              v-model="datePicker_output"
              type="daterange"
              align="right"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="mini"
              :picker-options="pickerOptions_output"
              value-format="yyyy/MM/dd"
            ></el-date-picker>
            <el-button 
              type="primary"
              @click="search()"
              style="margin-top: -10px">查询</el-button>
          </div>
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
    <el-dialog title="堆叠对比操作说明" :visible.sync="explainVisible" width="365px">
      <div style="font-size:14px">
        <span style="font-weight:bold">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          选中下方表格第一列中的任意复选框，然后点击"堆叠对比"按钮,
          则在"有功堆叠对比"曲线图中会堆叠展示表中选中的有功数据。
        </span>
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
        loading: false,
        wellname:"",
        wellid:"",
        wellList:[],
        // 控制所有曲线的时间范围
        datePicker_all:[],
        // 查询该时间范围内的所有曲线
        date_all:"",
        // 查询该时间返回内的电流、产量和液面
        date_output:"",
        //左右移动的按钮展示或隐藏
        leftWorkDis: false,
        rightWorkDis: true,
        worklength: [],  // 有功数据长度
        currentDiasbled:false, // 控制有功当前第几组数据的显示和隐藏
        // 当前展示有功的第几组数的最小值（比如当前显示第1,2,3组数，start_index=1,end_index=3）
        start_index: 0,   
        end_index:0,      
        power_current_page:1, //有功进行分页
        tableData: [],
        // 有功接口返回的数据
        P144Workdata:[],
        // 表中被选中的数据
        multipleSelection: [],
        selectDate: '',
        // 可以控制所有曲线的时间段
        pickerOptions_all: {
          onPick: ({maxDate, minDate}) => {
            this.selectDate= minDate.getTime();
            if (maxDate) {
              this.selectDate= ''
            }
          }, disabledDate: (time) => {
            if (this.selectDate!== '') {
              const one = 30 * 24 * 3600 * 1000;
              const minTime = this.selectDate- one;
              const maxTime = this.selectDate+ one;
              return time.getTime() < minTime || time.getTime() > maxTime
            }
          },
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
        // 产量和液面时间选择器
        pickerOptions_output:{
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
        // 产量和液面时间选择器对应的值
        datePicker_output:[],
        // 有功接口数据的有功
        active_list:[],
        // 有功接口数据的时间
        time:[],
        // 表格中的数据总数
        powertabletotal:0,
        // 当前页
        currentPage: 1,
        // 每页的数据总量
        pagesize:10,
        explainVisible:false,
        showchart:true
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
      ApiGetWellList({page:1,pagenum:10000}).then(({data}) => {
        this.wellList = data.msg.well_list;
        this.wellid = data.msg.well_list.map(item => {
          return item.id;
        });
        if(this.$route.params.id){
          this.wellname = parseInt(this.$route.params.id);
        }else{
          this.wellname = this.wellid[0];
        }
        this.getPower(this.wellname,this.date_all);
        this.getOutputChart(this.wellname,this.date_all);
        this.getEleHistory(this.wellname,this.date_all);
        this.powercompare();
      });
    },
    // 查看井详情
    getWellDetails(id){
      this.date_all = this.datePicker_all[0] + "-" + this.datePicker_all[1];
      this.datePicker_output = this.datePicker_all
      this.getPower(id,this.date_all);
      this.getOutputChart(id,this.date_all)
      this.getEleHistory(id,this.date_all)
    },
    // 时间选择器点确认，针对所有曲线
    searchall() {
      this.loading = true;
      this.date_all = this.datePicker_all[0] + "-" + this.datePicker_all[1];
      this.datePicker_output = this.datePicker_all
      this.getPower(this.wellname,this.date_all);
      this.getOutputChart(this.wellname,this.date_all);
      this.getEleHistory(this.wellname,this.date_all);
    },
    // 时间选择器点确认，针对产量和液面以及历史电流曲线
    search(){
      this.date_output = this.datePicker_output[0] + "-" + this.datePicker_output[1];
      this.getOutputChart(this.wellname,this.date_output);
      this.getEleHistory(this.wellname,this.date_output);
    },
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 初始化有功
    getPower(id,daterange){
      let array_datas = [];
      this.active_list = [];
      this.time = [];
      ApiPowerData({id:id,daterange:daterange}).then(({data}) =>{
        this.tableData = data.msg
        this.powertabletotal = this.tableData.length
        this.worklength = data.msg.length
        if(this.worklength==0)
        {
          this.currentDiasbled=false;//当有功历史数据为0时，隐藏有功的当前第几组数据
        }
        else
        {
          this.currentDiasbled=true;//当有功历史数据不为0时，显示有功的当前第几组数据
        }
        if(this.power_current_page === 1){
           this.P144Workdata = data.msg;
           let width = 3;
           this.start_index = 0;
           this.end_index = this.start_index + width;
        }
        if(this.power_current_page > 1){
          this.P144Workdata = [...this.P144Workdata,...data.msg];
        }
        if(this.P144Workdata.length > 0){
          for (let i = this.start_index; i < this.end_index; i++) {
            array_datas.push(this.P144Workdata[i]);
          }
          if (array_datas[2] == undefined) {
            array_datas.pop();
          }
          if (array_datas[1] == undefined) {
            array_datas.pop();
          }
          if (array_datas[0] !== undefined) {
            array_datas.forEach(item => {
              this.active_list = this.active_list.concat(item.p144_data);
              this.time = this.time.concat(item.time)
            });
          }
        }else{
          this.active_list = []
          this.time = []
        }
        this.getPowerChart(this.active_list,this.time)
        if (this.worklength > 3) {
          this.leftWorkDis = false;
          this.rightWorkDis = true;
        } else if (this.worklength <= 0) {
          this.leftWorkDis = true;
          this.rightWorkDis = true;
        }
      })
    },
    // 获取有功曲线图
    getPowerChart(active_list,time){
      // 整个横轴坐标值
      let x_lists = []
      // 横轴(第一组145点)
      let x_list1 = [];
      // 横轴(第二组145点)
      let x_list2 = [];
      // 横轴(第三组145点)
      let x_list3 = [];
      let times = 1;
      for (let i = 1; i <= 145; i++) {
        x_list1.push(i);
        x_list2.push(i);
      }
      for(let i = 1; i <= 154; i++){
        x_list3.push(i)
      }
      x_lists = x_list1.concat(x_list2).concat(x_list3);
      let customOption = {
          title: {
            text: " 有功kw",
            left: "center"
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
            formatter: function(params) {
              var tip = "";
              let marker = params[0].marker; 
              tip = params[0].axisValue+'<br />';
              if(params[0].dataIndex >=0 && params[0].dataIndex <= 144){
                tip = tip + marker +'时间：'+ time[0] + '</br>'
                    + marker + '有功数：'+ params[0].value;
              }
              else if (params[0].dataIndex >=145 && params[0].dataIndex <= 289){
                tip = tip + marker +'时间：'+ time[1] + '</br>'
                    + marker + '有功数：'+ params[0].value;
              }else{
                tip = tip + marker +'时间：'+ time[2] + '</br>'
                    + marker + '有功数：'+ params[0].value;
              }
              return tip;
            },
            axisPointer: {
              animation: true
            }
          },
          xAxis: {
            type: "category",
            data: x_lists,
            name: "点数",
            nameTextStyle: { fontSize: 16 },
            boundaryGap: false,
            axisLabel: {
              interval: 0,
              fontSize: 13,
              formatter: function(value, index) {
              if (times == 1 && (value == 1 || value == "1")) {
                return 1;
              }
              times += 1;
              var intvalue = parseInt(value);
                if (value!=1&&value % 12 == 1) {
                  return value;
                }
              }
            }
          },
          yAxis: {
            type: "value",
            name: "千瓦",
            nameTextStyle: { fontSize: 16 }
          },
          series: [{
            showSymbol: false, // 是否显示点
            smooth: true, //光滑
            data: active_list,
            type: "line",
            markLine: {
              symbol: "none", //去掉警戒线最后面的箭头
              silent: true, //鼠标悬停事件  true没有，false有
              data: [
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: 144
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: 289
                },
                {
                  lineStyle: {
                    //警戒线的样式  ，虚实  颜色
                    type: "solid",
                    color: "graylight"
                  },
                  xAxis: 434
                }
              ]
            }
          }]
        };
        this.$nextTick(() => {
          this.loading = false;
          this.$refs["power_chart"].initChart(customOption);
        })
    },
     //有功左移
    leftWorkLine() {
      this.loading = true;
      this.active_list = [];
      this.time = [];
      let width = 3;
      this.start_index += 1;
      this.end_index = this.start_index + width;
      let array_datas = [];
      for (let i = this.start_index; i < this.end_index; i++) {
        array_datas.push(this.P144Workdata[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(item => {
          this.active_list = this.active_list.concat(item.p144_data);
          this.time = this.time.concat(item.time)
        });
        this.getPowerChart(this.active_list,this.time);
      }
      if (this.end_index <= this.worklength) {
        this.rightWorkDis = false;
        if (this.end_index == this.worklength) {
          this.leftWorkDis = true;
        }
      } else {
        this.leftWorkDis = true;
        this.rightWorkDis = false;
      }
    },
    //有功右移
    rightWorkLine() {
      this.loading = true;
      this.active_list = [];
      this.time = []
      let width = 3;
      this.start_index -= 1;
      this.end_index = this.start_index + width;
      let array_datas = [];
      for (let i = this.start_index; i < this.end_index; i++) {
        array_datas.push(this.P144Workdata[i]);
      }
      if (array_datas[0] !== undefined) {
        array_datas.forEach(item => {
          this.active_list = this.active_list.concat(item.p144_data);
          this.time = this.time.concat(item.time)
        });
        this.getPowerChart(this.active_list,this.time);
      }
      if (this.start_index >= 0) {
        this.leftWorkDis = false;
        if (this.start_index == 0) {
          this.rightWorkDis = true;
        }
      } else {
        this.rightWorkDis = true;
        this.leftWorkDis = false;
      }
    },
    // 打开提示
    openExplain() {
      this.explainVisible = true;
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
    // 是否展示有功堆叠图
    showstack(){
      this.showchart = !this.showchart
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
    var day_millisecond = 60*60*24; //一天的毫秒数
    var before_day = ""
    var after_day = ""
    var list = this.getDateRange(date,7,true)
    this.loading = true;
    if(this.$route.params.date){
      before_day = this.$route.params.date - day_millisecond*2;
      after_day = this.$route.params.date + day_millisecond
      before_day = this.dateFormat(before_day)
      after_day = this.dateFormat(after_day)
      this.datePicker_all[0] = before_day
      this.datePicker_all[1] = after_day
    }else{
      this.datePicker_all[0] = this.timeFormat(list[0])
      this.datePicker_all[1] = this.timeFormat(list[1])
    }
    this.date_all = this.datePicker_all[0] + "-" + this.datePicker_all[1]
    this.datePicker_output = this.datePicker_all
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
  .left-mark{
    margin:20px
  }
  .data-title {
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  /deep/ .el-checkbox__inner{
    border: 1px solid #000;
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
    border: 1px solid rgb(212, 209, 209);
    margin:15px
  }
  .history-middle {
    margin: 10px 20px;
  }
  .datePicker_all {
    width: 250px;
  }

  .chart {
    padding-top: 10px;
  }
}
</style>
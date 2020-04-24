<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&amp;ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&amp;__ec_v__=20190126"></script>
<script>
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
import { ApiGetHomedata } from "@/api/homeData";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    BaiduMap,
    LineChart
  },
  data() {
    return {
      days:1,
      dynamic:1,
      openCount:'',
      stopCount:'',
      openPercentage:0,
      total:'',
      wellid:0,
      wellId:[],
      alarmStatus:"",
      time:"",
      default: {
        date:[],
        beginDate: '',
        endDate: ''
      },
      pickerOptions: {
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
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "自定义",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    homeData(days){
      let data = {days:days};
      ApiGetHomedata(data).then(res => {
        let chartData = res.data
        let wellName = []
        let output = [] 
        let level = []
        this.openCount = chartData.open_count
        this.stopCount = chartData.stop_count
        this.openPercentage = chartData.open_percentage
        this.total = chartData.total
        chartData.results.forEach(item => {
            wellName.push(item.well.name)
            output.push(item.output)
            level.push(item.level)
            this.wellId.push(item.well.id)
        });
        //开关井状态
        let chart1 = [
          {
            name: "开井",
            value: res.data.open_count
          },
          {
            name: "关井",
            value: res.data.stop_count
          }
        ];
        //告警汇总
        let chart2 = [
          {
            name: "新增",
            value: 10
          },
          {
            name: "忽略",
            value: 20
          },
          {
            name: "关闭",
            value: 30
          },
          {
            name: "误报",
            value: 40
          },
          {
            name: "已处置",
            value: 50
          }
        ]
        this.$nextTick(()=>{
          this.$refs["well-status"].initChart("", chart1);
          this.$refs["alarm-summary"].initChart("", chart2);
        });
        //产量柱状图
        let option1 = {
            title: {
            text: "产量TOP20",
            textStyle: {
                //---主标题内容样式
                color: "#000",
                fontSize:16
                // height:"50px"
            },
            padding:[5,18], //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                }
            },
            grid: {
                left: "3%",
                top: "12%",
                height:370,
                containLabel: true
            },
            legend: {
                data:[]
            },
            xAxis: [
            {
                name:'井号',
                type: "category",
                triggerEvent:true,
                data: wellName,
                // nameGap :15,
                axisLabel: {
                    //---坐标轴 标签
                    fontSize:14,
                    show: true, //---是否显示
                    inside: false, //---是否朝内
                    interval: 0,
                    rotate: 45,
                    margin: 5 //---刻度标签与轴线之间的距离
                }
            }
            ],
            yAxis: [
            {
                type: "value",
                name:'吨',
                splitLine:{show:false},
                axisLabel:{
                    fontSize:14,
                },
                }
            ],
            series: [
            {
                name: "产量",
                type: "bar",
                barWidth: 30,
                barMaxWidth: 50,
                barCategoryGap: "30%",
                barGap: "0%",
                data: output,
                itemStyle: {
                    normal: {
                        label: {
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 10
                            }
                        }
                    }
                }, 
            }
            ]
        };
        //液面高度柱状图
        let option2 = {
          title: {
            text: "液面高度",
            textStyle: {
              //---主标题内容样式
              color: "#000",
              fontSize:16
              // height:"50px"
            },
            padding: [1,18] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
              data:[]
          },
          grid: {
            left: "3%",
            top:"12%",
            bottom: "3%",
            height:370,
            containLabel: true
          },
          xAxis: [
            {
              name:'井号',
              type: "category",
              data: wellName,
              axisLabel: {
                fontSize:14,
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate:45,
                margin: 5
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name:"米",
              splitLine:{show:false},
              axisLabel:{
                  fontSize:14,
              },
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              barCategoryGap: "30%",
              barGap: "0%",
              data: level,
              itemStyle: {
                  normal: {
                      label: {
                          show: true, //开启显示
                          position: 'top', //在上方显示
                          textStyle: { //数值样式
                              color: 'black',
                              fontSize: 10
                          }
                      }
                  }
              }, 
            }
          ]
        };
        //平衡率曲线图
        let option3 = {
          title: {
            text: "平衡率"
          },
          grid: {
            left: "6%"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {//图例
            data: ["井号1", "CTCC", "CUCC"],// 名字
            tooltip: {
              show: true,
            },
          },
          xAxis: {
            type: "category",
            name: "时间",
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: "value",
            name: "平衡率",
            axisLabel: {
              fontSize: 14
            }
          },
          series: [
            {
              name: "井号1",
              smooth: true, //光滑
              data: [820, 932, 901, 934, 1290, 1330, 1320],
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
        //有功曲线图
        let option4 = {
          title: {
            text: "有功"
          },
          grid: {
            left: "6%"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            name: "时间",
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
              data: [820, 932, 901, 934, 1290, 1330, 1320],
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
        this.$refs["ouput"].initChart(option1);
        this.$refs["level"].initChart(option2);
        this.$refs["balance-rate"].initChart(option3);
        this.$refs["power"].initChart(option4);
        })
    },
    chart_reload(days){
       this.dynamic = days;
       switch (days){
          case 1:
            this.homeData(1)
            break;
          case 7:
            this.homeData(7)
            break;
          case 30:
            this.homeData(30)
            break;
          case 90:
            this.homeData(90)
            break;
          case 180:
            this.homeData(180)
            break;
          case 365:
            this.homeData(365)
            break;
       }
    },
    // getlocation() {
    //   let customOption = {
    //   };
    //   this.$nextTick(() => {
    //     this.$refs["location"].initChart(customOption);
    //   });
    // },
    //点击柱状图
    handleClickChart(params) {
      this.wellid = this.wellId[params.dataIndex]
      this.$router.push({name:'well-detail',params:{id:this.wellid},query:{type:params.pro_type}});
    },
    //点击饼图
    ClickChart(params){
      this.alarmStatus = params.name
      this.$router.push({name:'deviceAlarm',params:{name:this.alarmStatus},query:{type:params.pro_type}});
      console.log(this.alarmStatus)
    },
    //根据时间搜索平衡率和有功曲线图
    search(){
      console.log("搜索功能")
    },
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
      return year + '-' + month + '-' + day + ''      
    }
  },
  created() {
    this.homeData(1);
    var date1 = new Date();
    var list = this.getDateRange(date1,6,true)
    this.default.beginDate = list[0] 
    this.default.endDate = list[1] 
    this.default.date.push(this.default.beginDate) 
    this.default.date.push(this.default.endDate)
    console.log(this.default.date)
  }
};
</script>
<template>
  <div id="home-page" ref="drawer-parent">
    <el-row class="home-header-card" :gutter="15">
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item1" shadow="always">
          <router-link :to="{name:'realdata'}">
            <div class="text-light">实时数据</div>
            <img class="realDataImage"
              src="@/assets/realdata.png" alt="">
          </router-link>
        </el-card>
      </el-col>
      
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item2" shadow="always">
          <router-link :to="{name:'comprehensiveQuery'}">
            <div class="text-light">综合查询</div>
            <img class="queryImage"
                src="@/assets/query.png" alt="">
          </router-link>
        </el-card>
      </el-col>
       
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item3" shadow="always">
          <router-link :to="{name:'alarmQuery'}">
            <div class="text-light">告警查询</div>
            <img class="queryImage"
                src="@/assets/warning.png" alt="">
          </router-link>
        </el-card>
      </el-col>
      
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item4" shadow="always">
          <router-link :to="{name:'deviceStatus'}">
            <div class="text-light">设备状态</div>
            <img class="statisticsImage"
              src="@/assets/statistics.png" alt="">
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="home-header" :gutter="15">
      <el-col :lg="12">
        <el-row class="left" :gutter="15">
          <el-col :lg="24" :sm="24">
            <el-card shadow="always">
              <div class="btn-group" data-toggle="buttons" aria-label="First group">
                <div class="btn" :class="{colorChange:1 == dynamic}" @click="chart_reload(1)">
                  <input type="radio" name="options" id="option1">今天
                </div>
                <div class="btn" :class="{colorChange:7 == dynamic}" @click="chart_reload(7)">
                  <input type="radio" name="options" id="option2">近一周
                </div>
                <div class="btn" :class="{colorChange:30 == dynamic}" @click="chart_reload(30)">
                  <input type="radio" name="options" id="option3">近一月
                </div>
                <div class="btn" :class="{colorChange:90 == dynamic}" @click="chart_reload(90)">
                  <input type="radio" name="options" id="option4">近三月
                </div>
                <div class="btn" :class="{colorChange:180 == dynamic}" @click="chart_reload(180)">
                  <input type="radio" name="options" id="option6">近半年
                </div>
                <div class="btn" :class="{colorChange:365 == dynamic}" @click="chart_reload(365)">
                  <input type="radio" name="options" id="option5">近一年
                </div>
              </div>
              <div>
                <BarChart @click-item="handleClickChart" ref="ouput" chart-id="output" style="height:420px" />
              </div>
              <div style="margin-top:20px">
                <BarChart @click-item="handleClickChart" ref="level" chart-id="level" style="height:420px" />
              </div>
            </el-card>
            <el-col style="height:15px"></el-col>
            <el-card shadow="always" style="height:355px">
              <div>
                油井关联图
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12">
        <el-row class="right" :gutter="15">
          <el-col :lg="24">
            <el-row :gutter="15">
              <el-col :lg="12">
                <el-row class="left-item">
                  <el-col :lg="24">
                    <el-card shadow="always">
                      <chart ref="well-status" chart-id="well-status" />
                      <div class="prompt-text">开井：{{this.openCount}} 关井：{{this.stopCount}} 总计：{{this.stopCount+this.openCount}} </div>
                      <el-progress
                        style="margin-top:10px"
                        color="#28a745"
                        :stroke-width="10"
                        :percentage="openPercentage"
                      ></el-progress>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:255px">
                      <div>
                        <div class="prompt-text">告警</div>
                        <strong style="color:black;font-size:15px">29 已处理 (40%)</strong>
                        <el-progress
                          style="margin-top:10px"
                          color="#28a745"
                          :stroke-width="10"
                          :percentage="20"
                        ></el-progress>
                      </div>
                      <div style="margin-top:10px">
                       <chart @click-item="ClickChart" ref="alarm-summary" chart-id="alarm-summary" />
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :lg="12">
                <el-row class="right-item">
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <div style="display:flex">
                        <img
                            style="width: 76px;height: 74px;margin-top:25px"
                            src="@/assets/output.jpg" alt="">
                        <div style="margin-left:20px;margin-top:25px">
                          <div class="prompt-text">总产油量：(吨)</div>
                          <div style="font-size:25px;margin-top:8px;">{{this.total}}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <router-link :to="{name:'power'}">
                        <div style="display:flex">
                          <img
                              style="width: 80px;height: 82px;margin-top:25px"
                              src="@/assets/work.jpg" alt="">
                          <div class="prompt-text" style="margin-left:20px;margin-top:50px">能耗管理</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <router-link :to="{name:'wellList'}">
                        <div style="display:flex">
                          <img
                              style="width: 82px;height: 78px;margin-top:25px"
                              src="@/assets/info.jpg" alt="">
                          <div class="prompt-text" style="margin-left:20px;margin-top:50px">基础信息</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :lg="24" style="height:15px" />
          <el-col>
            <el-card shadow="always">
              <el-row>
                <el-col :sm="10" style="margin-top:5px">
                  <span style="font-size:15px">时间：</span>
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    style="width:200px"
                    :picker-options="pickerOptions"
                    :default-value="this.default.date"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    size="mini"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-col>
                <el-col :sm="3">
                  <el-button
                    @click="search()"
                    icon="el-icon-search"
                    style="height:27.99px;margin-top:5px"
                    type="primary"/>
                </el-col>
              </el-row>
              <LineChart ref="balance-rate" chart-id="balance-rate" style="height: 350px;margin-top:20px"/>
              <LineChart ref="power" chart-id="power" style="height: 350px"/>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
#home-page {
  font-size: 12px;
  background-color: #f4f5f5;
  /* height: calc(100vh - 84px); */
  position: relative;
  @mixin scrollStyle {
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 6px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0px;
      box-shadow: inset 0 0 0 #fff;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 0 #fff;
      border-radius: 0;
      background: #fff;
    }
  }
  $border: 1px solid #dcdfe6;
  $linkColor: #2d8cf0;
  .el-card__body {
    @include scrollStyle;
  }
  .home-header {
    margin-bottom: 15px;
    .left {
      .el-card {
        height: 950px;
      }
      .btn-group{
        display: flex;
        font-size:15px;
        margin-bottom: 15px;
        .btn{
          border:1px solid #212529;
          padding:8px 15px;
          height: 35px;
          margin-left:8px
        }
        .colorChange{
					background:#262d37;
          color: #fff;
				}
      }
    }
    .middle {
      .el-card {
        height: 615px;
      }
    }
    .right {
      height: 70%;
      .prompt-text {
        display: flex;
        color: #6c757d;
        font-size: 15px;
      }
      .left-item {
        .el-card {
          height: 240px;
        }
      }
      .right-item {
        .el-card {
          height: 140px;
        }
      }
    }
  }
  .home-header-card {
    margin-bottom: 15px;
    .el-card {
      height: 140px;
    }
    .home-header-item1 {
      background: #63c2de;
    }
    .home-header-item2 {
      background: #20a8d8;
    }
    .home-header-item3 {
      background: #ffc107;
    }
    .home-header-item4 {
      background: #f86c6b;
    }
    .realDataImage{
      width: 290px;
      height: 60px;
      margin-top:20px
    }
    .queryImage{
      width: 290px;
      height: 50px;
      margin-top:30px
    }
    .warnImage{
      width: 300px;
      height: 60px;
      margin-top:28px
    }
    .statisticsImage{
      width: 290px;
      height: 60px;
      margin-top:28px
    }
    .text-light {
      color: #f8f9fa;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
  }
  .card-header {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>

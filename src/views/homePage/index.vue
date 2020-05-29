<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&amp;ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&amp;__ec_v__=20190126"></script>
<script>
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
import GraphChart from "@/components/ECharts/GraphChart";
import {
  ApiGetHomedata,
  ApiGetBalance,
  ApiGetAlarm,
  ApiGetDept
} from "@/api/homeData";
import { ApiGetPower } from "@/api/realdata";
import dayjs from "dayjs";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    BaiduMap,
    LineChart,
    GraphChart
  },
  data() {
    return {
      days: 1,
      dynamic: 1,
      openCount: "",
      stopCount: "",
      openPercentage: 0,
      processedPer: 0,
      processedAlarm: 0,
      totalAlarm: 0,
      total: "",
      wellid: 0,
      wellId: [],
      alarmStatus: "",
      time: [],
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
      },
      balanceList: [],
      click: false,
    };
  },
  methods: {
    //获取首页数据
    homeData(days) {
      let data = { days: days };
      ApiGetHomedata(data).then(res => {
        let chartData = res.data;
        let wellName = [];
        let output = [];
        let level = [];
        this.openCount = chartData.open_count;
        this.stopCount = chartData.stop_count;
        this.openPercentage = chartData.open_percentage;
        this.total = chartData.total;
        chartData.results.forEach(item => {
          wellName.push(item.well.name);
          output.push(item.output);
          level.push(item.level);
          this.wellId.push(item.well.id);
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
        let colorList = ["#28a745", "#c23531"];
        this.$nextTick(() => {
          this.$refs["well-status"].initChart("", chart1, colorList);
        });
        let option = {
          title: {
            text: "产量和液面高度关系图",
            left: "center"
          },
          tooltip: {
            trigger: "axis",
            // formatter: function(params) {
            //   var tip = "";
            //   let marker0 = params[0].marker; //液面高度
            //   let marker1 = params[1].marker;  //产量
            //   tip = params[0].axisValue+'<br />';
            //   tip = tip + marker1 +'产量:'+ params[1].value + '</p>'
            //         + marker0 +'液面高度:'+ params[0].value;
            //   console.log(tip)
            //   return tip;
            // },
            axisPointer: {
              animation: true
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
              name:"井号",
              type: "category",
              data: wellName,
              axisLabel: {
                //---坐标轴 标签
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 45,
                margin: 5 //---刻度标签与轴线之间的距离
              }
            },
            {
              gridIndex: 1,
              name:"井号",
              type: "category",
              data: wellName,
              position: "top",
              axisLabel: {
                //---坐标轴 标签
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
              data:output
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
        };
        this.$refs["lineChart"].initChart(option);
      });
    },
    //根据时间搜索产量和液面高度柱状图
    chart_reload(days) {
      this.dynamic = days;
      switch (days) {
        case 1:
          this.homeData(1);
          break;
        case 7:
          this.homeData(7);
          break;
        case 30:
          this.homeData(30);
          break;
        case 90:
          this.homeData(90);
          break;
        case 180:
          this.homeData(180);
          break;
        case 365:
          this.homeData(365);
          break;
      }
    },
    //根据时间搜索平衡率和有功曲线图
    getChart() {
      var date1 = new Date();
      var list = this.getDateRange(date1, 7, true);
      let date = "";
      if (this.click == true) {
        date = this.time[0] + "-" + this.time[1];
      } else {
        date = list[0] + "-" + list[1];
      }
      let data = {
        daterange: date
      };
      ApiGetBalance(data).then(({ data }) => {
        let dataList = [];
        let wellName = [];
        let series = [];
        let time_list = [];
        let balance_list = [];
        let name = "";
        data.msg.forEach(item => {
          dataList.push(item.list);
          wellName.push(item.well_name);
        });
        if (dataList == "") {
          this.length = dataList.length + 1;
        } else {
          this.length = dataList.length;
        }
        for (let i = 0; i < this.length; i++) {
          if (dataList == "") {
            time_list = [];
            balance_list = [];
            name = "";
          } else {
            this.balanceList = dataList[i];
            time_list = dataList[0].map(item => {
              return item.date;
            });
            balance_list = this.balanceList.map(item => {
              return item.balance;
            });
            name = wellName[i];
          }
          time_list.reverse();
          balance_list.reverse();
          let item = {
            name: name,
            smooth: true, //光滑
            data: balance_list,
            type: "line"
          };
          series.push(item);
          //平衡率曲线图
          let option3 = {
            title: {
              text: "平衡率"
            },
            grid: {
              left: "8%"
            },
            // legend: {//图例
            //   data: wellName,// 名字
            //   tooltip: {
            //     show: true,
            //   },
            // },
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
                  posY = y - boxHeight;
                }
                return [posX, posY];
              }
            },
            xAxis: {
              type: "category",
              name: "时间",
              data: time_list
            },
            yAxis: {
              type: "value",
              name: "米",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          this.$refs["balance-rate"].initChart(option3);
        }
      });
      let data1 = {};
      if (this.click == true) {
        data1 = {
          active: "",
          daterange: this.time[0] + "-" + this.time[1]
        };
      } else {
        data1 = { active: "" };
      }
      ApiGetPower(data1).then(({ data }) => {
        //时间戳转换函数
        function dateFormat(date) {
          if (date) {
            date *= 1000;
            return dayjs(date).format("YYYY/MM/DD HH:mm");
          } else {
            return "";
          }
        }
        let dataList = data.msg;
        let wellName = [];
        let series = [];
        let active_list = [];
        let dates_list = [];
        if (dataList == "") {
          this.length = dataList.length + 1;
        } else {
          this.length = dataList.length;
        }
        for (let i = 0; i < this.length; i++) {
          if (dataList == "") {
            active_list = [];
            wellName = [];
            dates_list = [];
          } else {
            for (let j = 0; j < dataList[i].length; j++) {
              if (dataList !== "") {
                active_list.push(dataList[i][j].active);
                wellName.push(dataList[i][j].well_name);
                dates_list.push(dateFormat(dataList[i][j].time));
              }
            }
          }
          active_list.reverse();
          dates_list.reverse();
          let item = {
            name: wellName[0],
            smooth: true, //光滑
            data: active_list,
            type: "line"
          };
          series.push(item);
          active_list = [];
          wellName = [];
          let option4 = {
            title: {
              text: "有功"
            },
            grid: {
              left: "8%"
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
              name: "千瓦",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          dates_list = [];
          this.$refs["power"].initChart(option4);
        }
      });
    },
    //判断曲线图是否是根据时间搜索
    search() {
      this.click = true;
      this.getChart();
    },
    //获取首页告警
    getAlarm() {
      ApiGetAlarm().then(({ data }) => {
        let alarmList = [];
        alarmList = data.msg;
        this.processedAlarm =
          alarmList[1].num +
          alarmList[2].num +
          alarmList[3].num +
          alarmList[4].num;
        this.totalAlarm =
          alarmList[0].num +
          alarmList[1].num +
          alarmList[2].num +
          alarmList[3].num +
          alarmList[4].num;
        this.processedPer = Number(
          (this.processedAlarm / this.totalAlarm).toFixed(2)
        );
        //告警汇总
        let chart2 = [
          {
            name: "新增",
            value: alarmList[0].num
          },
          {
            name: "忽略",
            value: alarmList[1].num
          },
          {
            name: "关闭",
            value: alarmList[2].num
          },
          {
            name: "误报",
            value: alarmList[3].num
          },
          {
            name: "已处置",
            value: alarmList[4].num
          }
        ];
        let colorList = ["#c23531", "#d0c5c5", "#2f4554", "#ffcd39", "#28a745"];
        this.$nextTick(() => {
          this.$refs["alarm-summary"].initChart("", chart2, colorList);
        });
      });
    },
    //点击产量和液面高度图
    handleClickChart(params) {
      this.wellid = this.wellId[params.dataIndex];
      this.$router.push({
        name: "well-detail",
        params: { id: this.wellid },
        query: { type: params.pro_type }
      });
    },
    //点击饼图
    ClickChart(params) {
      this.alarmStatus = params.name;
      this.$router.push({
        name: "deviceAlarm",
        params: { name: this.alarmStatus },
        query: { type: params.pro_type }
      });
    },
    //点击油井关联图中的某一项
    clickGraph(params) {
      console.log(params);
    },
    //获取近一周时间的函数
    getDateRange(dateNow, intervalDays, bolPastTime) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let list = [];
      let lastDay;
      if (bolPastTime == true) {
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
        list.push(this.formateDate(lastDay));
        list.push(this.formateDate(dateNow));
      } else {
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
        list.push(this.formateDate(dateNow));
        list.push(this.formateDate(lastDay));
      }
      return list;
    },
    //格式化时间
    formateDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "/" + month + "/" + day + "";
    }
  },
  created() {
    this.homeData(1);
    this.getChart();
    this.getAlarm();
    var date1 = new Date();
    var list = this.getDateRange(date1, 7, true);
    this.time[0] = list[0];
    this.time[1] = list[1];
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
            <img class="realDataImage" src="@/assets/realdata.png" alt />
          </router-link>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item2" shadow="always">
          <router-link :to="{name:'comprehensiveQuery'}">
            <div class="text-light">综合查询</div>
            <img class="queryImage" src="@/assets/query.png" alt />
          </router-link>
        </el-card>
      </el-col>

      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item3" shadow="always">
          <router-link :to="{name:'deviceAlarm'}">
            <div class="text-light">告警查询</div>
            <img class="queryImage" src="@/assets/warning.png" alt />
          </router-link>
        </el-card>
      </el-col>

      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item4" shadow="always">
          <router-link :to="{name:'deviceStatus'}">
            <div class="text-light">设备状态</div>
            <img class="statisticsImage" src="@/assets/statistics.png" alt />
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
                  <input type="radio" name="options" id="option1" />今天
                </div>
                <div class="btn" :class="{colorChange:7 == dynamic}" @click="chart_reload(7)">
                  <input type="radio" name="options" id="option2" />近一周
                </div>
                <div class="btn" :class="{colorChange:30 == dynamic}" @click="chart_reload(30)">
                  <input type="radio" name="options" id="option3" />近一月
                </div>
                <div class="btn" :class="{colorChange:90 == dynamic}" @click="chart_reload(90)">
                  <input type="radio" name="options" id="option4" />近三月
                </div>
                <div class="btn" :class="{colorChange:180 == dynamic}" @click="chart_reload(180)">
                  <input type="radio" name="options" id="option6" />近半年
                </div>
                <div class="btn" :class="{colorChange:365 == dynamic}" @click="chart_reload(365)">
                  <input type="radio" name="options" id="option5" />近一年
                </div>
              </div>
              <div>
                <BarChart
                  @click-item="handleClickChart"
                  ref="lineChart"
                  chart-id="lineChart"
                  style="height:950px;margin-top:50px"
                />
              </div>
            </el-card>
            <el-col style="height:15px"></el-col>
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
                    <el-card shadow="always" style="height:315px">
                      <div>
                        <div style="color: #6c757d;font-size:15px;margin-top:20px">告警</div>
                        <strong
                          style="color:black;font-size:15px"
                        >已处理: {{this.processedAlarm}} 总计: {{this.totalAlarm}}</strong>
                        <el-progress
                          style="margin-top:10px;"
                          color="#28a745"
                          :stroke-width="10"
                          :percentage="processedPer"
                        ></el-progress>
                      </div>
                      <div style="margin-top:30px">
                        <chart
                          @click-item="ClickChart"
                          ref="alarm-summary"
                          chart-id="alarm-summary"
                        />
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :lg="12">
                <el-row class="right-item">
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:90px">
                      <div style="display:flex">
                        <img
                          style="width: 76px;height: 74px;margin-top:-12px"
                          src="@/assets/output.jpg"
                          alt
                        />
                        <div style="margin-left:20px;margin-top:-12px">
                          <div class="prompt-text">总产油量：(吨)</div>
                          <div style="font-size:25px;margin-top:8px;">{{this.total}}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:210px">
                      <chart ref="well-status" chart-id="well-status" style="margin-top:-10px"/>
                      <div
                        style="color: #6c757d;font-size: 15px;"
                      >开井: {{this.openCount}} 关井: {{this.stopCount}} 总计: {{this.stopCount+this.openCount}}</div>
                      <el-progress
                        color="#28a745"
                        :stroke-width="10"
                        :percentage="openPercentage"
                      ></el-progress>
                    </el-card>
                  </el-col>
                  <!-- <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <router-link :to="{name:'power'}">
                        <div style="display:flex">
                          <img
                            style="width: 80px;height: 82px;margin-top:25px"
                            src="@/assets/work.jpg"
                            alt
                          />
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
                            src="@/assets/info.jpg"
                            alt
                          />
                          <div class="prompt-text" style="margin-left:20px;margin-top:50px">基础信息</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col> -->
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :lg="24" style="height:15px" />
          <el-col :lg="24">
            <el-card shadow="always">
              <el-row>
                <el-col :sm="10" :lg="10" style="margin-top:5px">
                  <span style="font-size:15px">时间：</span>
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    style="width:200px"
                    :picker-options="pickerOptions"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    size="mini"
                    value-format="yyyy/MM/dd"
                  ></el-date-picker>
                </el-col>
                <el-col :sm="4" :lg="4">
                  <el-button
                    @click="search()"
                    icon="el-icon-search"
                    style="height:27.99px;margin-top:5px"
                    type="primary"
                  />
                </el-col>
              </el-row>
              <LineChart
                ref="balance-rate"
                chart-id="balance-rate"
                style="height: 350px;margin-top:20px"
              />
              <LineChart ref="power" chart-id="power" style="height: 350px" />
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
        height: 1125px;
      }
      .btn-group {
        display: flex;
        font-size: 15px;
        margin-bottom: 15px;
        .btn {
          border: 1px solid #212529;
          padding: 8px 15px;
          height: 35px;
          margin-left: 8px;
        }
        .colorChange {
          background: #262d37;
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
        font-size: 20px;
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
    .realDataImage {
      width: 290px;
      height: 60px;
      margin-top: 20px;
    }
    .queryImage {
      width: 290px;
      height: 50px;
      margin-top: 30px;
    }
    .warnImage {
      width: 300px;
      height: 60px;
      margin-top: 28px;
    }
    .statisticsImage {
      width: 290px;
      height: 60px;
      margin-top: 28px;
    }
    .text-light {
      color: #f8f9fa;
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
    }
  }
  .card-header {
    font-size: 14px;
    font-weight: 600;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

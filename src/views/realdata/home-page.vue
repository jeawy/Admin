<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&amp;ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&amp;__ec_v__=20190126"></script>
<script>
import { mapState } from "vuex";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import Chart from "@/components/ECharts/PieChart";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
let TimeOut = null;
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    BaiduMap
  },
  mixins: [thumbtackMixin],
  data() {
    return {
      dynamic:1
    };
  },
  methods: {
    chart_reload(days){
       this.dynamic = days;
       switch (days){
          case 1:
            break;
          case 7:
            break;
          case 30:
            break;
          case 90:
            break;
          case 180:
            break;
          case 365:
            break;
       }
    },
    getStatistics() {
      let chartData = [
        {
          name: "开井",
          value: 2
        },
        {
          name: "关井",
          value: 3
        }
      ];
      // //  this.$nextTick(()=>{
      this.$refs["well-status"].initChart("", chartData);
      // //  })
    },
    getoutput() {
      let customOption = {
        title: {
          text: "产量TOP20",
          textStyle: {
            //---主标题内容样式
            color: "#000"
            // height:"50px"
          },
          padding: [3, 0, 100, 50] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["镜头个数", "任务个数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            // nameGap :15,
            axisLabel: {
              //---坐标轴 标签
              show: true, //---是否显示
              inside: false, //---是否朝内
              interval: 0,
              rotate: 0,
              margin: 5 //---刻度标签与轴线之间的距离
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            // name: "任务个数",
            type: "bar",
            barWidth: 30,
            barMaxWidth: 50,
            barCategoryGap: "30%",
            barGap: "0%",
            data: [120, 200, 150, 80, 70, 110, 130]
          }
        ]
      };
      this.$refs["ouput"].initChart(customOption);
    },
    getlevel() {
      let customOption = {
        title: {
          text: "液面高度",
          textStyle: {
            //---主标题内容样式
            color: "#000"
            // height:"50px"
          },
          padding: [3, 0, 100, 50] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          // data: ["镜头个数", "任务个数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周末"],
            // nameGap :15,
            axisLabel: {
              //---坐标轴 标签
              show: true, //---是否显示
              inside: false, //---是否朝内
              interval: 0,
              rotate: 0,
              margin: 5 //---刻度标签与轴线之间的距离
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            // name: "任务个数",
            type: "bar",
            barWidth: 30,
            barMaxWidth: 50,
            barCategoryGap: "30%",
            barGap: "0%",
            data: [120, 200, 150, 80, 70, 110, 130]
          }
        ]
      };
      this.$refs["level"].initChart(customOption);
    },
    getlocation() {
      let customOption = {
      };
      this.$nextTick(() => {
        this.$refs["location"].initChart(customOption);
      });
    }
  },
  created() {},
  mounted() {
    this.getStatistics();
    this.getoutput();
    this.getlevel();
    this.getlocation();
  }
};
</script>
<template>
  <div id="home-page" ref="drawer-parent">
    <el-row class="home-header-card" :gutter="15">
      <el-col :span="6" class="card-warp">
        <el-card class="home-header-item1" shadow="always">
          <a href="/#/realdata/realdata">
            <p class="text-light">实时数据</p>
            <img
              style="width: 270px;height: 60px;margin-top:20px"
              src="@/assets/realdata.png" alt="">
          </a>
        </el-card>
      </el-col>
      <el-col :span="6" class="card-warp">
        <el-card class="home-header-item2" shadow="always">
          <p class="text-light">综合查询</p>
          <img
            style="width: 270px;height: 50px;margin-top:30px"
            src="@/assets/query.png" alt="">
        </el-card>
      </el-col>
      <el-col :span="6" class="card-warp">
        <el-card class="home-header-item3" shadow="always">
          <p class="text-light">告警</p>
          <img
            style="width: 270px;height: 60px;margin-top:28px"
            src="@/assets/warning.png" alt="">
        </el-card>
      </el-col>
      <el-col :span="6" class="card-warp">
        <el-card class="home-header-item4" shadow="always">
          <p class="text-light">统计分析</p>
          <img
            style="width: 260px;height: 60px;margin-top:28px"
            src="@/assets/statistics.png" alt="">
        </el-card>
      </el-col>
    </el-row>
    <el-row class="home-header" :gutter="15">
      <el-col :span="12">
        <el-row class="left" :gutter="15">
          <el-col :span="24" class="card-warp">
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
                <BarChart ref="ouput" chart-id="output" style="height:400px" />
              </div>
              <div style="margin-top:50px">
                <BarChart ref="level" chart-id="level" style="height:400px" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="right" :gutter="15">
          <el-col :span="24" class="card-warp">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-row class="left-item">
                  <el-col :span="24">
                    <el-card shadow="always">
                      <chart ref="well-status" chart-id="well-status" />
                      <div class="prompt-text">开井：2 关井：3</div>
                      <el-progress
                        style="margin-top:10px"
                        color="#28a745"
                        :stroke-width="10"
                        :percentage="20"
                      ></el-progress>
                    </el-card>
                  </el-col>
                  <el-col style="height:10px"></el-col>
                  <el-col :span="24">
                    <el-card shadow="always" style="height:200px">
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
                        <div class="prompt-text">工况诊断</div>
                        <strong style="color:black;font-size:15px">24 已完成 (20%)</strong>
                        <el-progress
                          style="margin-top:10px"
                          color="#28a745"
                          :stroke-width="10"
                          :percentage="20"
                        ></el-progress>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row class="right-item">
                  <el-col :span="24">
                    <el-card shadow="always">
                      <div style="display:flex">
                        <img
                            style="width: 76px;height: 74px;margin-top:10px"
                            src="@/assets/output.jpg" alt="">
                        <div style="margin-left:20px;margin-top:10px">
                          <div class="prompt-text">总产油量：(吨)</div>
                          <div style="font-size:25px;margin-top:8px;">84212.59</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :span="24">
                    <el-card shadow="always">
                      <div style="display:flex">
                        <img
                              style="width: 80px;height:82px;margin-top:10px"
                              src="@/assets/work.jpg" alt="">
                          <div class="prompt-text" style="margin-left:20px;margin-top:30px">工况诊断</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :span="24">
                    <el-card shadow="always">
                      <div style="display:flex">
                        <img
                              style="width: 82px;height: 78px;margin-top:10px"
                              src="@/assets/info.jpg" alt="">
                        <div class="prompt-text" style="margin-left:20px;margin-top:30px">基础信息</div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24" style="height:15px" />
          <el-col :span="24" class="card-warp">
            <el-card shadow="always">
              <div class="card-header">
                <h4 style="font-size:17px">油井位置分布</h4>
              </div>
              <div>
                <BaiduMap ref="location" chart-id="location" style="height: 465px;width:600px" />
              </div>
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
        height: 990px;
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

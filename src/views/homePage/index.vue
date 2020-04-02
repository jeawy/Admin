<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&amp;ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&amp;__ec_v__=20190126"></script>
<script>
import Chart from "@/components/ECharts/PieChart";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
import { ApiGetHomedata } from "@/api/homeData";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    BaiduMap
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
      wellId:[]
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
        let chart = [
        {
          name: "开井",
          value: res.data.open_count
        },
        {
          name: "关井",
          value: res.data.stop_count
        }
        ];
        this.$nextTick(()=>{
          this.$refs["well-status"].initChart("", chart);
        });
        let option1 = {
            title: {
            text: "产量TOP20",
            textStyle: {
                //---主标题内容样式
                color: "#000",
                fontSize:20
                // height:"50px"
            },
            padding:[20,18], //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                }
            },
            grid: {
                left: "3%",
                top: "20%",
                height:370,
                containLabel: true
            },
            legend: {
                data:[]
            },
            xAxis: [
            {
                name:'井号',
                nameTextStyle:{fontSize:16},
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
                nameTextStyle:{fontSize:16},
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
        let option2 = {
        title: {
          text: "液面高度",
          textStyle: {
            //---主标题内容样式
            color: "#000",
            fontSize:20
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
          bottom: "3%",
          height:370,
          containLabel: true
        },
        xAxis: [
          {
            name:'井号',
            type: "category",
            nameTextStyle:{fontSize:16},
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
            nameTextStyle:{fontSize:16},
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
        this.$refs["ouput"].initChart(option1);
        this.$refs["level"].initChart(option2);
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
    getlocation() {
      let customOption = {
      };
      this.$nextTick(() => {
        this.$refs["location"].initChart(customOption);
      });
    },
    handleClickChart(params) {
      this.wellid = this.wellId[params.dataIndex]
      this.$router.push({name:'well-detail',params:{id:this.wellid},query:{type:params.pro_type}});
    },
  },
  created() {
    this.homeData(1);
  },
  mounted() {
    this.getlocation();
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
          <router-link :to="{name:'alarmQuery'}">
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
                <BarChart @click-item="handleClickChart" ref="ouput" chart-id="output" style="height:450px" />
              </div>
              <div style="margin-top:50px">
                <BarChart @click-item="handleClickChart" ref="level" chart-id="level" style="height:450px" />
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
                  <el-col style="height:10px"></el-col>
                  <el-col :lg="24">
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
              <el-col :lg="12">
                <el-row class="right-item">
                  <el-col :lg="24">
                    <el-card shadow="always">
                      <div style="display:flex">
                        <img
                            style="width: 76px;height: 74px;margin-top:10px"
                            src="@/assets/output.jpg" alt="">
                        <div style="margin-left:20px;margin-top:10px">
                          <div class="prompt-text">总产油量：(吨)</div>
                          <div style="font-size:25px;margin-top:8px;">{{this.total}}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always">
                      <router-link :to="{name:'deviceStatus'}">
                        <div style="display:flex">
                          <img
                              style="width: 80px;height: 82px;margin-top:10px"
                              src="@/assets/work.jpg" alt="">
                          <div class="prompt-text" style="margin-left:20px;margin-top:30px">工况诊断</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always">
                      <router-link :to="{name:'wellList'}">
                        <div style="display:flex">
                          <img
                              style="width: 82px;height: 78px;margin-top:10px"
                              src="@/assets/info.jpg" alt="">
                          <div class="prompt-text" style="margin-left:20px;margin-top:30px">基础信息</div>
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
              <div class="card-header">
                <h4 style="font-size:17px">油井位置分布</h4>
              </div>
              <div>
                <BaiduMap ref="location" chart-id="location" />
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
        height: 1012px;
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

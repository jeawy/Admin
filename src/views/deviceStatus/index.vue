
<template>
  <div id="home-page" ref="drawer-parent">
    <div>
    <el-row :gutter="10">
      <el-col :sm="12" >    
        <el-card>
          <BarChart @click-item="handleClickChart" ref="rated_power" chart-id="rated_power" style="height:450px" />
        </el-card>
      </el-col>

      <el-col :sm="12">
        <el-card>
          <BarChart @click-item="handleClickChart" ref="frequency" chart-id="frequency" style="height:450px" />
          <div style="display:flex">
            aaa
          </div>
        </el-card>
      </el-col>
    </el-row>
    </div>
    <div style="margin-top:10px">
    <el-row :gutter="10">
      <el-col :sm="12">    
        <el-card>
         <BarChart @click-item="handleClickChart" ref="balance" chart-id="balance" />
        </el-card>
      </el-col>

      <el-col :sm="12">
         <el-card>
          <BarChart @click-item="handleClickChart" ref="system_efficiency" chart-id="system_efficiency" />
        </el-card>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import BarChart from "@/components/ECharts/BarMarker";
import { ApiGetHomedata } from "@/api/homeData";
import { ApiGetRealdata } from "@/api/realdata";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,

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
      well_ids:[]
    };
  },
  methods: {
    
    homeData(days){
      ApiGetRealdata({real:""}).then(res=>{
          let chartData = res.data
          // 井名
          let well_name = []
          // 频率
          let frequency = []
          // 功率利用率
          let rated_power = []
          // 平衡率
          let balance = []
          // 系统效率
          let system_efficiency = []
          // 循环放进数组
          chartData.msg.forEach(item => {
            well_name.push(item.well_name)
            frequency.push(item.frequency)
            rated_power.push(item.rated_power)
            system_efficiency.push(item.system_efficiency)
            this.well_ids.push(item.well_id)
          });

        let option1 = {
            title: {
            text: "功率利用率",
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
                data: well_name,
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
                splitLine:{show:false},
                axisLabel:{
                    fontSize:14,
                },
                nameTextStyle:{fontSize:16},
                }
            ],
            series: [
            {
                name: "效率",
                type: "bar",
                barWidth: 30,
                barMaxWidth: 50,
                barCategoryGap: "30%",
                barGap: "0%",
                data: rated_power,
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
        this.$refs["rated_power"].initChart(option1);
        
        let option3 = {
            title: {
            text: "频率",
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
              data:[ ],
            
                
            },
            xAxis: [
            {
                name:'井号',
                nameTextStyle:{fontSize:16},
                type: "category",
                triggerEvent:true,
                data: well_name,
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
                splitLine:{show:false},
                axisLabel:{
                    fontSize:14,
                },
                nameTextStyle:{fontSize:16},
                }
            ],
            series: [
            {
                name: "效率",
                type: "bar",
                barWidth: 30,
                barMaxWidth: 50,
                barCategoryGap: "30%",
                barGap: "0%",
                data: frequency,
                itemStyle: {
                     
                    normal: {
                        label: {
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 10
                            }
                        },
                        color:function (params){
                        if (params.data<40){
                            return 'yellow'
                        }
                        else if(params.data>50){
                            return 'red'
                        }
                        else{
                          return 'orange'
                        }

                    }
                    }
                }, 
            }
            ]
        };
     
        this.$refs["frequency"].initChart(option3);
        let option2 = {
            title: {
            text: "平衡率",
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
                data: well_name,
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
                splitLine:{show:false},
                axisLabel:{
                    fontSize:14,
                },
                nameTextStyle:{fontSize:16},
                }
            ],
            series: [
            {
                name: "平衡率",
                type: "bar",
                barWidth: 30,
                barMaxWidth: 50,
                barCategoryGap: "30%",
                barGap: "0%",
                data: balance,
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
        this.$refs["balance"].initChart(option2);

        let option4 = {
            title: {
            text: "系统效率",
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
                data: well_name,
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
                splitLine:{show:false},
                axisLabel:{
                    fontSize:14,
                },
                nameTextStyle:{fontSize:16},
                }
            ],
            series: [
            {
                name: "系统效率",
                type: "bar",
                barWidth: 30,
                barMaxWidth: 50,
                barCategoryGap: "30%",
                barGap: "0%",
                data: system_efficiency,
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
        this.$refs["system_efficiency"].initChart(option4);

        });

    },
    
    handleClickChart(params) {
      
      this.well_id = this.well_ids[params.dataIndex]

      this.$router.push({name:'well-detail',params:{id:this.well_id},query:{type:params.pro_type}});
      
    },
  },
  created() {
    this.homeData(1);
    // this.realData()
    
  },
  mounted() {
   
  }
};
</script>

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

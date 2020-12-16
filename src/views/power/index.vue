
<template>
  <div id="home-page" ref="drawer-parent">
    <div class="content">
      <el-row class="row-bg">
        <el-col :span="5">
          <span class="toptext">归属:</span>
          <el-cascader
              :options="deptsbelong"
              v-model="belong"
              :props="{expandTrigger: 'hover'}"
              placeholder="请选择归属"
              change-on-select
              type="text"
              style="width:200px;"
            ></el-cascader>
        </el-col>
        <el-col :span="4">
          <span class="toptext">井名:</span>
          <el-select v-model="wellname" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in wellNameList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="6" type="flex">
          <span class="toptext">上报日期:</span>
          <el-date-picker
            v-model="wellDatePicker"
            type="daterange"
            align="right"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="mini"
            style="width:200px"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-col> -->
        <el-col :span="4">
          <el-button type="primary" class="button" @click="searchWell(1)">点击查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
    <el-row :gutter="10">
      <el-col :sm="12" >            
        <el-card>
          <!-- 功率利用率 -->
          <div class="header-top">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div style="width:20px;height:20px;background:red;border-radius:5px"></div>
                <div style="padding-left:5px">功率利用率：&ge;20%</div>
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:yellow;border-radius:5px"></div>
                <div style="padding-left:5px">功率利用率：&lt;20%</div>
              </div>
          </div>
          <BarChart @click-item="handleClickChart" ref="rated_power" chart-id="rated_power" style="height:450px" />
        </el-card>
      </el-col>

      <el-col :sm="12">
        <el-card > 
          <!-- 频率 -->
         <div class="header-top">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div style="width:20px;height:20px;background:red;border-radius:5px"></div>
                <div style="padding-left:5px">频率：>80</div>
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:orange;border-radius:5px"></div>
                <div style="padding-left:5px">频率：60-80</div>
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:rgb(180,180,0);border-radius:5px"></div>
                <div style="padding-left:5px">频率：40-60</div> 
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:yellow;border-radius:5px"></div>
                <div style="padding-left:5px">频率：&lt;40</div> 
              </div>
          </div>
          <BarChart @click-item="handleClickChart" ref="frequency" chart-id="frequency" style="height:450px" />
        </el-card>
      </el-col>                   
    </el-row>
    </div>
    <div style="margin-top:10px">
    <el-row :gutter="10">
      <el-col :sm="12">
        <el-card>
          <!-- 平衡度 -->
          <div class="header-top">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div style="width:20px;height:20px;background:red;border-radius:5px"></div>
                <div style="padding-left:5px">平衡度：&ge;80%</div>
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:yellow;border-radius:5px"></div>
                <div style="padding-left:5px">平衡度：&lt;80%</div>
              </div>
          </div>
         <BarChart @click-item="handleClickChart" ref="balance" chart-id="balance" />
        </el-card>
      </el-col>

      <el-col :sm="12">
         <el-card>
           <!-- 系统效率 -->
           <div class="header-top">
              <div style="display: flex;align-items: center;justify-content: center;">
                <div style="width:20px;height:20px;background:red;border-radius:5px"></div>
                <div style="padding-left:5px">系统效率：&ge;20%</div>
              </div>
              <div style="display: flex;align-items: center;justify-content: center;padding-left:5px;">
                <div style="width:20px;height:20px;background:yellow;border-radius:5px"></div>
                <div style="padding-left:5px">系统效率：&lt;20%</div>
              </div>
          </div>
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
import { ApiGetRealdata,ApiSearchPower } from "@/api/realdata";
import { getDept } from "@/api/admin";
import { ApiGetSimpleWellList } from "@/api/wellList";
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
      well_ids:[],
      depts: [],
      deptsbelong: [],
      belong:'',
      wellDatePicker:'',
      wellname:'',
      wellNameList:[],
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '昨天',
            onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, start]);
            }
          },{
            text: '最近7日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近30日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
    };
  },
  methods: {
    // 查看归属列表
     getDeptList() {
      getDept().then(res => {
        this.depts = res.data.msg;
        this.formatMemberList()
      });
    },
    //获取所有井名和id
    getWellList(){
      ApiGetSimpleWellList().then(({data}) => {
          this.wellNameList =data.msg.well_list;
      });
    },
    //获取归属列表
    async formatMemberList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.deptsbelong = JSON.parse(
        JSON.stringify(this.depts)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.deptsbelong);  
    },
    // 进行搜索
    searchWell(type){
      let parm = {}
      if(type == 1){
        parm = {
          deptid:this.belong[this.belong.length-1],
          name:this.wellname,
          // daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
        }
      }
      ApiSearchPower(parm).then(res=>{
          let chartData = res.data
          // 井名
          let well_name = []
          // 频率
          let frequency = []
          // 功率利用率
          let rated_power = []
          // 平衡度
          let balance = []
          // 系统效率
          let system_efficiency = []
          // 功率利用率对应的井名
          let power_well = []
          // 频率对应的井号
          let fre_well = []
          // 平衡度对应的井号
          let balance_well = []
          // 系统效率对应的井号
          let sys_well = []
          // 循环放进数组
          chartData.msg.forEach(item => {
            if(item.rated_power == null){
              power_well.push('')
            }else{
              power_well.push(item.well_name)
            }
            if(item.frequency == 0){
              fre_well.push('')
            }else{
              fre_well.push(item.well_name)
            }
            if(item.balance == 0){
              balance_well.push('')
            }else{
              balance_well.push(item.well_name)
            }
            if(item.system_efficiency == 0){
              sys_well.push('')
            }else{
              sys_well.push(item.well_name)
            }
            rated_power.push(item.rated_power)
            frequency.push(item.frequency)
            balance.push(item.balance)
            system_efficiency.push(item.system_efficiency)
            well_name.push(item.well_name)
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
                },
                formatter:function(params){
                  var tip = "";
                  let marker = params[0].marker;
                  if(params[0].axisValue){
                    tip = params[0].axisValue+'<br />';
                    tip  = tip + marker+'功率利用率:'+params[0].value+'%';
                    return tip;
                  }
                }
            },
            grid: {
                left: "3%",
                top: "20%",
                bottom:"5%",
                // height:365,
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
                data: power_well,
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
                name: "功率利用率",
                type: "bar",
                barWidth: 15,
                barMaxWidth: 20,
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
                        },
                        color:function(params){
                          // 功率利用率低于20% 黄色展示
                          if (params.data<20){
                            return 'yellow';
                          }
                          // 大于20% 红色展示
                          else{
                            return 'red'
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
                },
                formatter:function(params){
                  var tip = "";
                  let marker = params[0].marker;
                  if(params[0].axisValue != 0){
                    tip = params[0].axisValue+'<br />';
                    tip  = tip + marker+'频率:'+params[0].value;
                    return tip;
                  }
                }
            },
            grid: {
                left: "3%",
                top: "20%",
                bottom:"5%",
                // height:365,
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
                data: fre_well,
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
                name: "频率",
                type: "bar",
                barWidth: 15,
                barMaxWidth: 20,
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
                        // 频率小于40 
                        if (params.data>80){
                          return 'red'
                        }
                        else if(params.data<80 && params.data>=60){
                          return 'orange'
                        }
                        else if(params.data<60 && params.data>=40){
                          return 'rgb(180,180,0)'
                        }
                        else{
                          return 'yellow'
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
            text: "平衡度",
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
                },

                formatter:function(params){
                 var tip = "";
                 let marker = params[0].marker;
                 if (params[0].axisValue != 0){
                  tip = params[0].axisValue+'<br />';
                  tip  = tip + marker+'平衡度:'+params[0].value+'%';
                  return tip;
                 }
                }
            },
            grid: {
                left: "3%",
                top: "20%",
                height:365,
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
                data: balance_well,
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
                name: "平衡度",
                type: "bar",
                barWidth: 15,
                barMaxWidth: 20,
                barCategoryGap: "30%",
                barGap: "0%",
                data: balance,
                valueType:"percent",
                itemStyle: {
                    normal: {
                        label: {
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 10
                            },
                        },
                        color:function (params){
                        // 平衡度20%  展示为黄色
                        if (params.data<80){
                            return 'yellow'
                        }
                        else{
                          return 'red'
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
                },
                formatter:function(params){
                 var tip = "";
                 let marker = params[0].marker;
                 if (params[0].axisValue != 0){
                  tip = params[0].axisValue+'<br />';
                  tip  = tip + marker+'系统效率:'+params[0].value+'%';
                  return tip;
                 }
                }
            },
            grid: {
                left: "3%",
                top: "20%",
                height:365,
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
                data: sys_well,
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
                barWidth: 15,
                barMaxWidth: 20,
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
                            
                        },
                        color:function (params){
                        // 系统效率低于20%  展示为黄色
                        if (params.data<20){
                            return 'yellow'
                        }
                        else{
                          return 'red'
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
    this.searchWell();
    this.getDeptList();
    this.getWellList();
    
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
  .content{
    padding-bottom: 10px;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding:5px 2px 0 5px;
  }
  .toptext{
    font-size: 14px;
  }
  .header-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom:-35px;
    z-index: 100;
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

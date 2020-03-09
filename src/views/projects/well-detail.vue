<template>
  <div id="detail">
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="left">
          <el-row>
            <el-col :span="13">
              <img style="width: 170px;height: 173px;" src="@/assets/well_logo.png" />
            </el-col>
            <el-col :span="9">
              <div>
                <el-row>
                  <label class="well_no">{{wellDetail.name}}</label>
                  <img
                    src="@/assets/on.png"
                    style="vertical-align: middle;"
                    v-if="wellDetail.status == 0"
                  />
                  <img
                    src="@/assets/off.png"
                    style="vertical-align: middle;"
                    v-if="wellDetail.status == 1"
                  />
                  <div>{{wellDetail.well_type}}</div>
                  <div>开机时间:02/26 08:31:59</div>
                  <div>最大/小载荷:</div>
                  <div>配产：</div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" style="margin-left:20px;">
              <div>产量(吨)：{{wellDetail.output}}</div>
              <div>频率(Hz)：{{wellDetail.frequency}}</div>
              <div>油温：</div>
              <div>电压：</div>
              <div>日耗电(千瓦时)：{{wellDetail.power_consumption}}</div>
              <div>平衡度(米)：{{wellDetail.balance}}</div>
              <div>有功(千瓦)：{{wellDetail.active}}</div>
              <div>现场视频：</div>
              <div>冲程(米)：{{wellDetail.stroke}}</div>
              <div>油压(兆帕)：{{wellDetail.oil_pressure}}</div>
              <div>偏磨：</div>
              <div>电机功率(Kw)：{{wellDetail.power?wellDetail.power:"-"}}</div>
              <div>大平衡块数量：{{wellDetail.num_big_balance?wellDetail.num_big_balance:"-"}}</div>
              <div>泵径(mm)：{{wellDetail.pump_diameter?wellDetail.pump_diameter:"-"}}</div>
              <div>泵挂(m)：{{wellDetail.pump_hanging?wellDetail.pump_hanging:"-"}}</div>
              <div>工频运行：{{wellDetail.power_frequency_operation?wellDetail.power_frequency_operation:"-"}}</div>
              <div>停机状态：{{wellDetail.stop_status?wellDetail.stop_status:"-"}}</div>
              <div>告警情况：{{wellDetail.warning?wellDetail.warning:"-"}}</div>
              <div>大平衡块尺寸2(m): {{wellDetail.size_2_big_balance?wellDetail.size_2_big_balance:"-"}}</div>
              <div>小平衡块尺寸2(m)：{{wellDetail.size_2_small_balance?wellDetail.size_2_small_balance:"-"}}</div>
              <div>曲柄尺寸2(m)：{{wellDetail.size_2_crank?wellDetail.size_2_crank:"-"}}</div>
              <div>大平衡块重量2(Kn)：{{wellDetail.weight_2_big_balance?wellDetail.weight_2_big_balance:"-"}}</div>
              <div>小平衡块重量2(Kn)：{{wellDetail.weight_2_small_balance?wellDetail.weight_2_small_balance:"-"}}</div>
              <div>曲柄重量2(Kn)：{{wellDetail.weight_2_crank?wellDetail.weight_2_crank:"-"}}</div>
              <div>有功2(Kw)：{{wellDetail.active2?wellDetail.active2:"-"}}</div>
              <div>数据更新时间：{{wellDetail.time}}</div>
            </el-col>
            <el-col :span="11">
              <div>动液面(米):{{wellDetail.level}}</div>
              <div>建议调整量1(米)：{{wellDetail.adjustment1}}</div>
              <div>建议调整量2(米)：{{wellDetail.adjustment2}}</div>
              <div>建议调整量3(米)：{{wellDetail.adjustment3}}</div>
              <div>建议调整量4(米)：{{wellDetail.adjustment4}}</div>
              <div>建议调整量5(米)：{{wellDetail.adjustment5}}</div>
              <div>流压：</div>
              <div>泵效：</div>
              <div>电流(安培)：{{wellDetail.electric_current}}</div>
              <div>冲次(次/分) ：{{wellDetail.rush_times}}</div>
              <div>结蜡：</div>
              <div>套压(兆帕)：{{wellDetail.nesting_pressure}}</div>
              <div>沉没度：{{wellDetail.sunken}}</div>
              <div>电机类型：{{wellDetail.motor_type?wellDetail.motor_type:"异步"}}</div>
              <div>小平衡块数量：{{wellDetail.num_small_balance?wellDetail.num_small_balance:"-"}}</div>
              <div>油管外径(mm)：{{wellDetail.tubing_outer_diameter?wellDetail.tubing_outer_diameter:"-"}}</div>
              <div>含水：{{wellDetail.watery?wellDetail.watery:"-"}}</div>
              <div>变频运行：{{wellDetail.frequency_conversion_operation?wellDetail.frequency_conversion_operation:"-"}}</div>
              <div>诊断情况：{{wellDetail.diagnosis?wellDetail.diagnosis:"-"}}</div>
              <div>大平衡块尺寸1(m)：{{wellDetail.size_1_big_balance?wellDetail.size_1_big_balance:"-"}}</div>
              <div>小平衡块尺寸1(m)：{{wellDetail.size_1_small_balance?wellDetail.size_1_small_balance:"-"}}</div>
              <div>曲柄尺寸1(m)：{{wellDetail.size_1_crank?wellDetail.size_1_crank:"-"}}</div>
              <div>大平衡块重量1(Kn)：{{wellDetail.weight_1_big_balance?wellDetail.weight_1_big_balance:"-"}}</div>
              <div>小平衡块重量1(Kn)：{{wellDetail.weight_1_small_balance?wellDetail.weight_1_small_balances:"-"}}</div>
              <div>曲柄重量1(Kn)：{{wellDetail.weight_1_crank?wellDetail.weight_1_crank:"-"}}</div>
              <div>油套温度(度)：{{wellDetail.oil_jacket_temperature?wellDetail.oil_jacket_temperature:"-"}}</div>
              <div>抽油机运行状态：{{wellDetail.run_status?wellDetail.run_status:"-"}}</div>
              <div>偏置角：{{wellDetail.offset_angle?wellDetail.offset_angle:"-"}}</div>
            </el-col>
          </el-row>
        </div>
        <div class="left">
          <BarChart ref="powermonth" chart-id="powermonth" style="width:100%;height:380px;" />
          <BarChart ref="poweryear" chart-id="poweryear" style="width:100%;height:380px;" />
        </div>
      </el-col>
      <el-col :span="15">
        <div class="right">
          <el-row>
            <div class="selectTime">
              <span>时间范围</span>
              <el-date-picker
                style="width:350px;"
                v-model="time"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
              <el-button
                @click="search()"
                icon="el-icon-search"
                style="height:27.99px;margin-left: -5px;"
                type="primary"
              />
              <a target="__blank" href>点击查看更多点位数据</a>
            </div>
          </el-row>
          <el-row>
            <el-tabs v-model="activeName">
              <el-tab-pane label="产量及页面历史曲线" name="lineHistory">
                <lineHistory ref="lineHistory" />
              </el-tab-pane>
              <el-tab-pane label="产量及页面历史表格" name="tableHistory">
                <tableHistory ref="tableHistory" />
              </el-tab-pane>
              <el-tab-pane label="开关井记录" name="recordHistory">
               <recordHistory ref="recordHistory" />
              </el-tab-pane>
              <el-tab-pane label="实测数据表格" name="measure-record"></el-tab-pane>
            </el-tabs>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChart from "@/components/ECharts/BarMarker";
import lineHistory from "./components/line-History/index";
import tableHistory from "./components/table-History/index";
import recordHistory from "./components/record-History/index";
import dayjs from "dayjs";
import { ApiGetElectdata } from "@/api/realdata";
import {
  getWellDetail,
  viewPowersMonth,
  getHistoryData
} from "@/api/welldetail";

export default {
  components: {
    BarChart,
    lineHistory,
    tableHistory,
    recordHistory
  },
  data() {
    return {
      endtime: "",
      activeName: "lineHistory",
      wellDetail: [],
      monthList: [],

      pickerOptions: {
        shortcuts: [
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
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      time: ""
    };
  },
  methods: {
    //月耗电量和年耗电量
    getPowerMonth() {
      viewPowersMonth({
        id: this.$route.params.id
      }).then(({ data }) => {
        let month_power = [];
        let month_power_dates = [];
        // this.monthList = data.powers_month_list;
        data.powers_month_list.forEach(item => {
          month_power.push(item.power);
          month_power_dates.push(item.month);
        });
        let years_power = [];
        let years_power_dates = [];
        // this.monthList = data.powers_month_list;
        data.powers_year_list.forEach(item => {
          years_power.push(item.power);
          years_power_dates.push(item.year);
        });

        let powerMonthOption = {
          title: {
            text: "月耗电量"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: month_power_dates
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14
            }
          },
          grid: {
            left: 50
          },
          series: [
            {
              data: month_power,
              type: "bar",
              barWidth: 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
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
        this.$refs["powermonth"].initChart(powerMonthOption);
        let powerYearOption = {
          title: {
            text: "年耗电量"
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: years_power_dates
          },
          yAxis: {
            type: "value",
            name: "千瓦时",
            axisLabel: {
              fontSize: 14
            }
          },
          grid: {
            left: 50
          },
          series: [
            {
              data: years_power,
              type: "bar",
              barWidth: 20,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
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
        this.$refs["poweryear"].initChart(powerYearOption);
      });
    },
    //搜索页面产量
    search(time) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.$refs["lineHistory"].getOutputChart(
        this.$route.params.id,
        dataFormat(this.time[0]) + "-" + dataFormat(this.time[1])
      );
      this.$refs["tableHistory"].getHistoryData(
        this.$route.params.id,
        dataFormat(this.time[0]) + "-" + dataFormat(this.time[1])
      );
    },
    //井的详情信息
    getWellDetails() {
      getWellDetail({ id: this.$route.params.id, json: "" }).then(
        ({ data }) => {
          this.wellDetail = data.entities_list[0];
        }
      );
      this.$nextTick(() => {
        this.$refs["lineHistory"].getOutputChart(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["lineHistory"].getEleChart(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["tableHistory"].getHistoryData(this.$route.params.id);
      });
      this.$nextTick(() => {
        this.$refs["recordHistory"].getRecordData(this.$route.params.id);
      });
    }
  },
  created() {
    this.getWellDetails();
  },
  mounted() {
    this.getPowerMonth();
  }
};
</script>

<style lang="scss" scoped>
#detail {
  font-size: 12px;
  background-color: #f4f5f5;
  // height: calc(100vh - 84px);
  position: relative;
  .left {
    border: 1px solid rgba(0, 0, 0, 0.125);
    // height: 800px;
  }
  .right {
    border: 1px solid rgba(0, 0, 0, 0.125);
  }
}
.well_no {
  font-size: 17px;
  font-weight: 700;
}
div {
  font-size: 14px;
  margin-bottom: 0.5rem;
}
.selectTime {
  margin-top: 5px;
  margin-left: 5px;
}
</style>

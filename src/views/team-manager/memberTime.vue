<!-- 人员工时 -->
<template>
  <div id="rememberTime">
    <ElCard>
      <template slot="header">
        <label for>部门：</label>
        <el-select v-model="deptId" @change="getFreeTime()">
          <el-option
            v-for="(item,index) of loginMessage.dept"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </template>

      <div v-if="deptId">
        <HotChart chart-id="line-chart1" ref="line-chart1" height="500px" /> 
        <el-divider />
     <!--部门内，全部项目的任务/人员分配图(甘特图表示) -->
     <personalDistribute :dept-id="deptId"/>
      </div>
      <div v-else class="text-center">选择部门查看</div>
    </ElCard>
  </div>
</template>

<script>
import HotChart from "@/components/ECharts/HotChart";
import { getMemberTime } from "@/api/statistics";
import personalDistribute from "./components/personalDistribute";
import dayjs from "dayjs";
export default {
  name: "rememberTime",
  components: { HotChart, personalDistribute },
  data() {
    return {
      deptId: this.$store.state.login.userInfo.dept[0].id,
      loginMessage: this.$store.state.login.userInfo,
      freeTime: [],
      userDate: [],
      dateList: [],
      dataCellList: []
    };
  },
  watch: {},
  methods: {
    getFreeTime() {
      this.dateList = [];
      this.userDate = [];
      this.dataCellList = [];
      let payload = { dept_id: this.deptId, day: 30 };
      function dataFormat(params) {
        if (params) {
          params *= 1000;
          return dayjs(params).format("YYYY/MM/DD");
        } else {
          return "";
        }
      }
      getMemberTime(payload).then(({ data }) => {
        [...data.msg].map((item, Ind) => {
          this.userDate.push(item.user);
          item.work.map((todo, ind) => {
            this.dataCellList.push([Ind, ind, todo.task_num]);
          });
        });
        this.dataCellList = this.dataCellList.map(function(item) {
          return [item[1], item[0], item[2] || "-"];
        });
        [...data.msg][0].work.map(item => {
          this.dateList.push(dataFormat(item.day));
        });

        let chartData = {
          title: {
            text: "制作人员任务统计(注：此图展示员工近30天的每日任务量, 灰色代表空闲时间)",
            textStyle: {
              //---主标题内容样式
              color: "#000"
              // height:"50px"
            },
            padding: [3, 0, 50, 50] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            position: "top"
          },
          animation: false,
          grid: {
            height: "70%",
            left: "5%",
            right: "5%",
            y: "10%"
          },
          xAxis: {
            type: "category",
            data: this.dateList,
            splitArea: {
              show: false
            }
          },
          yAxis: {
            type: "category",
            data: this.userDate,
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: 0,
            max: 50,
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: "2%"
          },
          series: [
            {
              name: "任务统计",
              type: "heatmap",
              data: this.dataCellList,
              label: {
                normal: {
                  show: true,
                  color: "#000000"
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: "rgba(0, 0, 0, 0.7)"
                }
              }
            }
          ]
        };
        this.$nextTick(() => {
          this.$refs["line-chart1"].initChart(chartData);
        });
      });
    }
  },
  created() {
    this.getFreeTime();
  }
};
</script>
<style lang='scss' scoped>
</style>
<template>
  <div id="alarmQuery">
      <el-row class="row-bg">
        <el-col class="col-bg">
          井名:
        </el-col>
        <el-col>
          <el-input class="input" v-model="wellName"></el-input>
        </el-col>
        <el-col class="col-bg type">
          告警类型:
        </el-col>
        <el-col>
          <el-select v-model="alarmCategory" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="col-bg">
          告警时间:
        </el-col>
        <el-col type="flex">
          <el-date-picker
            class="datePicker"
            v-model="alarmDatePicker"
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
        </el-col>
        <el-col class="col-bg">
          产生方式:
        </el-col>
        <el-col>
          <el-input class="input" v-model="productWay"></el-input>
        </el-col>
        <el-col class="col-bg">
          告警状态:
        </el-col>
        <el-col>
          <el-select v-model="alarmStatus" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in status1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row-bg">
        <el-col class="col-bg">
          处置人:
        </el-col>
        <el-col>
          <el-input class="input" v-model="handleMan"></el-input>
        </el-col>
        <el-col class="col-bg">
          处置状态:
        </el-col>
        <el-col>
          <el-select v-model="handleStatus" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in status2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="col-bg">
          处置时间:
        </el-col>
        <el-col>
          <el-date-picker
            class="datePicker"
            v-model="handleDatePicker"
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
        </el-col>
        <el-col>
          <el-button type="primary" style="height:27.99px;margin-left:10px" @click="searchWell()">点击查询</el-button>
        </el-col>
      </el-row>
    <el-table
      :data="comprehensivedata"
      stripe
      :border="true"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
      <el-table-column prop="welltype" width="100" label="井" align="center"></el-table-column>
      <el-table-column prop="welltype" width="120" label="告警类型" align="center"></el-table-column>
      <el-table-column prop="welltype" width="120" label="告警标题" align="center"></el-table-column>
      <el-table-column prop="welltype" width="120" label="产生方式" align="center"></el-table-column>
      <el-table-column label="告警时间" width="170px" align="center">
        <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="welltype" width="120" label="告警状态" align="center"></el-table-column>
      <el-table-column prop="welltype" width="120" label="告警处置" align="center"></el-table-column>
      <el-table-column prop="welltype" width="80" label="处置人" align="center"></el-table-column>
      <el-table-column label="处置时间" width="160px" align="center">
        <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="welltype" width="120" label="处置状态" align="center"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          style="margin-top:10px"
        ></el-pagination>
      </div>
  </div>
</template>
<script>
import { ApiGetRealdata, getDetail } from "@/api/realdata";
export default {
  data() {
    return {
      alarmQuery: [],
      alarmCategory: "",
      alarmStatus: "",
      alarmDatePicker: "",
      handleDatePicker:"",
      handleStatus:"",
      category: [
        {
          value: "0",
          label: "开关井异常"
        },
        {
          value: "1",
          label: "动液面高度异常"
        },
        {
          value: "2",
          label: "日产量异常"
        }
      ],
      wellName: null,
      status1: [
        {
          value: "0",
          label: "新增"
        },
        {
          value: "1",
          label: "忽略"
        },
        {
          value: "2",
          label: "关闭"
        },
        {
          value: "3",
          label: "误报"
        }
      ],
      status2: [
        {
          value: "0",
          label: "忽略"
        },
        {
          value: "1",
          label: "关闭"
        },
        {
          value: "2",
          label: "误报"
        },
        {
          value: "3",
          label: "已处置"
        }
      ],
      uploadVisible: false,
      path: null,
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
      total: 0,
      pageCount: 0,
      currentPage: 1,
      pageSize: 20,
      cutType: -1, //分页类型
      // pageSizeList: [20, 30, 50, 100],

    };
  },
  methods: {
    //分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetcomprehensiveData();//正常查看
          break;
        case 1:
          this.searchWell(); //筛选分页查看
          break;
      }
      // 
    },
    GetcomprehensiveData() {
      ApiGetRealdata({page:this.currentPage}).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
      });
    },
    searchWell(){
      this.cutType = 1;
      let data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
        daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
      };
      ApiGetRealdata(data).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
      });
    },
    // 运行状态格式化显示
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "开井";
          break;
        case 1:
          return "关井";
          break;
        case 2:
          return "设备已被移除";
          break;
      }
    }
  },
  created() {
    this.GetcomprehensiveData();
  }
};
</script>
<style lang="scss">
#alarmQuery {
  //   font-size: 12px;
  background-color: #f4f5f5;
  .links {
    cursor: pointer;
    color: #918e8e;
  };
  .el-col {
    width: auto;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding:5px 2px 0 5px;
  }
  .datePicker{
    width:210px
  }
  .input{
    width:120px
  }
  .cell-wellstatus{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

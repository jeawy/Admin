<template>
  <div id="comprehensiveQuery">
      <el-row class="row-bg">
        <el-col :span="2" class="col-bg">
          井类别:
        </el-col>
        <el-col :span="3">
          <el-select v-model="wellCategory" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="col-bg">
          井号:
        </el-col>
        <el-col :span="2">
          <el-input v-model="wellNumber"></el-input>
        </el-col>
        <el-col :span="2" class="col-bg">
          状态:
        </el-col>
        <el-col :span="2">
          <el-select v-model="wellStatus" placeholder="请选择" style="width:130px;" filterable>
            <el-option
              v-for="item in wellstatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" class="col-bg">
          上报日期:
        </el-col>
        <el-col :span="4" type="flex">
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
        </el-col>
        <el-col :span="5">
          <el-button type="primary" style="height:27.99px" @click="searchWell()">点击查询</el-button>
          <el-button type="primary" style="height:27.99px" @click="targetUpload">导出结果</el-button>
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
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column prop="welltype" label="井类别" align="center"></el-table-column>
      <el-table-column label="井号" width="120">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.wellid},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="运行状态" width="120" :formatter="Status" align="center"></el-table-column>
      <el-table-column prop="factory" label="厂" align="center"></el-table-column>
      <el-table-column prop="mine" label="矿" align="center"></el-table-column>
      <el-table-column label="上报时间" width="150px" align="center">
        <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="frequency" label="频率(Hz)" width="100px" align="center"></el-table-column>
      <el-table-column prop="level" label="动液面(米)" width="100px" align="center"></el-table-column>
      <el-table-column prop="output" label="产量(吨)" align="center"></el-table-column>
      <el-table-column prop="power_consumption" label="日耗电(千瓦时)" width="150px" align="center"></el-table-column>
      <el-table-column prop="balance" label="平衡度(米)" width="100px" align="center"></el-table-column>
      <el-table-column prop="adjustment1" label="建议调整量1(米)" width="150px" align="center"></el-table-column>
      <el-table-column prop="adjustment2" label="建议调整量2(米)" width="150px" align="center"></el-table-column>
      <el-table-column prop="adjustment3" label="建议调整量3(米)" width="150px" align="center"></el-table-column>
      <el-table-column prop="adjustment4" label="建议调整量4(米)" width="150px" align="center"></el-table-column>
      <el-table-column prop="adjustment5" label="建议调整量5(米)" width="150px" align="center"></el-table-column>
      <el-table-column prop="active" label="有功(千瓦)" width="100px" align="center"></el-table-column>
      <el-table-column prop="electric_current" label="电流(安培)" width="120px" align="center"></el-table-column>
      <el-table-column prop="rush_times" label="冲次(次/分)/转速(转/分)" width="200px" align="center"></el-table-column>
      <el-table-column prop="stroke" label="冲程(米)" align="center"></el-table-column>
      <el-table-column prop="oil_pressure" label="油压(兆帕)" width="100px" align="center"></el-table-column>
      <el-table-column prop="nesting_pressure" label="套压(兆帕)" width="100px" align="center"></el-table-column>
      <el-table-column prop="sunken" label="沉没度(米)" width="100px" align="center"></el-table-column>
      <el-table-column prop="sunken" label="运行时长" width="100px" align="center"></el-table-column>
      <el-table-column prop="watery" label="含水" align="center"></el-table-column>
      <el-table-column prop="oil_temperature" label="油温" align="center"></el-table-column>
      <el-table-column prop="address" label="电压" align="center"></el-table-column>
      <el-table-column prop="address" label="最大/小载荷" width="120px" align="center"></el-table-column>
      <el-table-column prop="address" label="泵效" align="center"></el-table-column>
      <el-table-column prop="address" label="结蜡" align="center"></el-table-column>
      <el-table-column prop="address" label="偏磨" align="center"></el-table-column>
      <el-table-column prop="address" label="流压" align="center"></el-table-column>
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
    <!-- 导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRealdata, getDetail } from "@/api/realdata";
export default {
  data() {
    return {
      comprehensivedata: [],
      wellCategory: "-1",
      wellStatus: "-1",
      wellDatePicker: "",
      category: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "抽油机"
        },
        {
          value: "1",
          label: "螺杆泵"
        }
      ],
      wellNumber: null,
      wellstatus: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "开井"
        },
        {
          value: "1",
          label: "关井"
        },
        {
          value: "2",
          label: "已移除"
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
      getRealdata({page:this.currentPage}).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
      });
    },
    searchWell(){
      let data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
        daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
      };
      getRealdata(data).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
      });
    },
    // 实时数据导出dialog
    targetUpload() {
      const data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
        daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
        print: "null"
      };
      getRealdata(data).then(({ data }) => {
        this.uploadVisible = true;
        this.path = data.file;
      });
    },
    // 导出Excel
    download() {
      const data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      this.uploadVisible = false;
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
#comprehensiveQuery {
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
}
</style>

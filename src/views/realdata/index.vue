<template>
  <div id="realdata">
    <div style="padding-bottom: 10px;">
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
        <el-col :span="6">
          <el-button type="primary" style="height:27.99px" @click="searchWell()">点击查询</el-button>
          <el-button type="primary" style="height:27.99px" @click="targetUpload">导出结果</el-button>
        </el-col>
        <!-- <el-col :span="4">
        <el-button type="danger" style="height:27.99px" @click="histaryData()">历史数据</el-button>
        </el-col>-->
      </el-row>
    </div>
    <el-table
      :data="realdata"
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
      <el-table-column label="开/关井时间" width="150px" align="center">
        <template slot-scope="scope">{{scope.row.changed_time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column label="历史数据" width="100px" align="center">
        <template slot-scope="scope">
          <div @click="history(scope.row.name)">历史数据</div>
        </template>
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
    <!-- <el-drawer
    
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
    >
      <span>我来啦!</span>
    </el-drawer> -->
  </div>
</template>
<script>
import { getRealdata, getDetail } from "@/api/realdata";
export default {
  data() {
    return {
      realdata: [],
      wellCategory: "-1",
      wellStatus: "-1",
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
      // drawer: false,
      // direction: 'btt',
    };
  },
  methods: {
    GetRealdata() {
      getRealdata({ realdata: "" }).then(res => {
        this.realdata = res.data.realdata;
      });
    },
    history(){
      console.log("历史数据")
    },
    searchWell() {
      let data = {
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus
      };
      getRealdata(data).then(res => {
        this.realdata = res.data.realdata;
      });
    },
    // 实时数据导出dialog
    targetUpload() {
      const data = {
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
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
    this.GetRealdata();
  }
};
</script>
<style lang="scss">
#realdata {
  font-size: 12px;
  background-color: #f4f5f5;
  .links {
    cursor: pointer;
    color: #918e8e;
  }
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
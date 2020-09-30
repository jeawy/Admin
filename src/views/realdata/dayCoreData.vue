<template>
  <div id="coredata">
    <div class="content">
      <el-row class="row-bg">
        <el-col :span="2" class="col-bg">井号:</el-col>
        <el-col :span="4">
          <el-input v-model="wellNumber" style="width:140px"></el-input>
        </el-col>
        <el-col :span="2" class="col-bg">时间:</el-col>
        <el-col :span="4">
          <el-date-picker
            style="width:200px"
            v-model="wellDatePicker"
            type="daterange"
            align="right"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="mini"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="button" @click="searchWell()">点击查询</el-button>
          <el-button type="primary" class="button" @click="targetUpload" :loading="loading">导出结果</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="coredata"
      stripe
      :border="true"
      style="width: 100%;"
      :max-height="tableHeight"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="well_no__name" label="井号" align="center"></el-table-column>
      <el-table-column label="上报时间" align="center" width="180">
        <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="output" label="产量（吨）" align="center"></el-table-column>
      <el-table-column prop="level" label="液面高度（米）" width="140" align="center"></el-table-column>
      <el-table-column prop="active" label="有功" align="center"></el-table-column>
      <el-table-column prop="electric_current" label="电流" align="center"></el-table-column>
      <el-table-column prop="balance" label="平衡度" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.well_no__well_type==0">
            <span>{{scope.row.balance}}</span>
          </div>
          <div v-if="scope.row.well_no__well_type==1">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="up" label="上电流" align="center"></el-table-column>
      <el-table-column prop="down" label="下电流" align="center"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizeList"
        layout="total, sizes, prev, pager, next, jumper"
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
          <span @click="download" class="downloadExcle">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ApiGetCoreData, ApiExportCoreData } from "@/api/realdata";
export default {
  data() {
    return {
      wellNumber: null,
      wellDatePicker: "",
      coredata: [],
      uploadVisible: false,
      path: null,
      isDShow: false,
      tableHistoryData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近7日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近30日",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      total: 0,
      pageCount: 0,
      currentPage: 1,
      pageSize: 50,
      pageSizeList: [10, 30, 50, 100],
      cutType: -1, //分页类型
      clientHeight: "",
      tableHeight: 0,
      loading:false     //给导出按钮加loading效果
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetCoreData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetCoreData(); //正常查看
          break;
        case 1:
          this.searchWell(); //筛选分页查看
          break;
      }
      //
    },
    GetCoreData() {
      ApiGetCoreData({page:this.currentPage,pagenum:this.pageSize}).then(({ data }) => {
        this.coredata = data.msg;
        console.log(this.coredata)
        this.total = data.total;
      });
    },
    searchWell() {
      this.cutType = 1;
      let datarange = "";
      if (this.wellDatePicker !== "") {
        datarange = this.wellDatePicker[0] + "-" + this.wellDatePicker[1];
      }
      let data = {
        wellname: this.wellNumber,
        daterange: datarange,
        page:this.currentPage,
        pagenum:this.pageSize
      };
      ApiGetCoreData(data).then(({ data }) => {
        this.coredata = data.msg;
        this.total = data.total;
      });
    },
    // 实时数据导出dialog
    targetUpload() {
      this.loading = true;
      let datarange = "";
      if (this.wellDatePicker !== "") {
        datarange = this.wellDatePicker[0] + "-" + this.wellDatePicker[1];
      }
      const data = {
        wellname: this.wellNumber,
        daterange: datarange
      };
      ApiExportCoreData(data).then(({ data }) => {
        this.uploadVisible = true;
        this.path = data.path;
      });
    },
    // 导出Excel
    download() {
      const data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
      this.loading = false
    },
    //取消弹框
    cancel(){
      this.uploadVisible = false;
      this.loading = false
    },
    //确认下载
    uploadExcel() {
      this.uploadVisible = false;
      this.loading = false
    },
  },
  created() {
    this.GetCoreData();
    this.clientHeight = `${document.documentElement.clientHeight}`; //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 214;
  }
};
</script>
<style lang="scss" scoped>
#coredata {
  font-size: 12px;
  background-color: #f4f5f5;
  .content {
    padding-bottom: 10px;
  }
  .button {
    height: 27.99px;
    margin-left: 10px;
  }
  .el-col {
    width: auto;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 2px 0 5px;
  }
  .downloadExcle {
    cursor: pointer;
    color: #2d8cf0;
  }
}
</style>
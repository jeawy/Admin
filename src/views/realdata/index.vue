<template>
  <div id="realdata">
    <div class="content">
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
          <el-button type="primary" class="button" @click="searchWell()">点击查询</el-button>
          <el-button type="primary" class="button" @click="targetUpload">导出结果</el-button>
        </el-col>
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
     <el-table-column label="井号" width="120" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.wellid},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column  label="运行状态" width="120" align="center">
         <template slot-scope="scope">
           <div v-if="scope.row.status==0" class="cell-wellstatus">
             {{scope.row.status|wellStatus}}
             <img src="@/assets/on.png"/>
           </div>
           <div v-if="scope.row.status==1" class="cell-wellstatus">
             {{scope.row.status|wellStatus}}
              <img src="@/assets/off.png"/>
           </div>
         </template>
      </el-table-column>
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
          <div @click="history(scope.row.wellid,scope.row.name,scope.row.factory,scope.row.mine,scope.row.status,scope.row.welltype)">历史数据</div>
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
          <span @click="download" class="downloadExcle">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
    <Drawer 
    ref="showdrawer"
    scrollable 
    v-model="isDShow" 
    :mask-style="{backgroundColor: 'transparent'}"
    :mask="true"
    draggable
    width="48%">
    <el-row type="flex" align="middle">
      <el-col :span="8">
        <div style="font-weight: 700; font-size: 18px;">
        {{wellfactory}}{{wellmine}}/{{wellname}}{{wellStatus}}
        </div>
      </el-col>
      <el-col :span="2">
        <span v-if="wellStatus == '开井'" class="">
              <img src="@/assets/on.png"/>
           </span>
           <span v-if="wellStatus == '关井'" class="">
              <img src="@/assets/off.png"/>
           </span>
      </el-col>
    </el-row>
    <el-divider class="divider"/>
    <el-row type="flex" justify="end" align="middle" class="row-time-select">
       <el-col :span="3">
          时间范围:
        </el-col>
        <el-col :span="6" type="flex">
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
    </el-row>
    <el-row>
      <el-col :span="24">
       <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="产量及页面历史曲线" name="first">
                <line-history ref="linehistory"/>
                <barchart-history ref="barcharthistory"/>
            </el-tab-pane>
            <el-tab-pane label="产量及页面历史表格" name="second">
               <table-history ref="tablehistory" /> 
            </el-tab-pane>
            <el-tab-pane label="开关井记录" name="third">
              <table-record ref="tablerecord" />
            </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    </Drawer>
  </div>
</template>
<script>
import tableHistory from './components/table-history'
import lineHistory from './components/line-history'
import tableRecord from './components/table-record'
import barchartHistory from './components/barchart-history';
import { ApiGetRealdata,ApiGetHistorydata } from "@/api/realdata";
export default {
  components: {tableHistory, lineHistory ,barchartHistory,tableRecord},
  data() {
    return {
      wellname:"",
      wellfactory:null,
      wellmine:"",
      welltype:'',
      wellStatus:'',
      wellDatePicker: "",
      activeName: "first",
      wellid:'',
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
      isDShow: false,
      tableHistoryData:[],
       pickerOptions: {
          shortcuts: [{
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
    GetRealdata() {
      ApiGetRealdata({ realdata: "" }).then(res => {
        this.realdata = res.data.realdata;
      });
    },
    handleClick(tab, event) {
  
    },
    history(wellid,wellname,wellfactory,wellmine,wellstatus,welltype){
      this.isDShow = true;
      this.wellid = wellid;
      this.wellfactory = wellfactory;
      this.wellmine = wellmine;
      this.wellname = wellname;
      this.welltype = welltype;
      if(wellstatus == 0){
        this.wellStatus = "开井";
      }else if(wellstatus == 1){
        this.wellStatus = "关井";
      }
      this.getLineHistory(wellid);
      this.$refs["linehistory"].getOutputChart(wellid);
      this.$refs["linehistory"].getOutputLiquid(wellid);
      this.$refs["linehistory"].getEleChart(wellid);
      this.$refs["barcharthistory"].getPowerMonth(wellid);
      this.$refs["tablehistory"].getHistoryData(wellid);
      this.$refs["tablerecord"].getRecordData(wellid);
    },
    getLineHistory(){
       console.log("曲线图")
    },
    searchWell() {
      let data = {
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus
      };
      ApiGetRealdata(data).then(res => {
        this.realdata = res.data.realdata;
      });
    },
     searchWell(){
      let data = {
        // page: this.currentPage,
        daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
      };
      ApiGetRealdata(data).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
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
      ApiGetRealdata(data).then(({ data }) => {
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
  },
  created() {
    this.GetRealdata();
  }
};
</script>
<style lang="scss" scoped>
#realdata {
  font-size: 12px;
  background-color: #f4f5f5;
  .content{
    padding-bottom: 10px;
  }
  .button{
    height:27.99px
  }
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
  .cell-wellstatus{
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      padding-left: 5px;
    }
  }
  .col-bg-header{
    font-weight: 700;
    font-size: 18px;
    .img{
      padding-top: 5px;
    }
  }
  .col-bg-drawer{
    padding-top:5px;
  }
  .row-time-select{
    width: 95%;
  }
  .divider{
        margin: 10px 0;
  }
  .downloadExcle{
    cursor:pointer;
    color:#2d8cf0
  }
}
</style>
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
          归属:
        </el-col>
        <el-col :span="3">
          <el-cascader
              :options="deptsbelong"
              v-model="belong"
              :props="{expandTrigger: 'hover'}"
              placeholder="请选择归属"
              change-on-select
              type="text"
              style="width:230px;"
            ></el-cascader>
        </el-col>
        <el-col :span="2" class="col-bg">
          井号:
        </el-col>
        <el-col :span="2">
          <el-input v-model="wellNumber" style="width:130px;"></el-input>
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
      :max-height="tableHeight"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="welltype" label="井类别" align="center"></el-table-column>
      <el-table-column label="井号" width="120" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.wellid},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column  label="运行状态" width="90" align="center">
         <template slot-scope="scope">
           <div v-if="scope.row.status==0" class="cell-wellstatus">
             <span class="well-status">{{scope.row.status|wellStatus}}</span>
             <svg-icon icon-class="wellon" />
             <!-- <img src="@/assets/on.png"/> -->
           </div>
           <div v-if="scope.row.status==1" class="cell-wellstatus">
             <span class="well-status">{{scope.row.status|wellStatus}}</span>
             <svg-icon icon-class="welloff" />
              <!-- <img src="@/assets/off.png"/> -->
           </div>
         </template>
      </el-table-column> 
      <el-table-column prop="belongs" label="归属" width="230" align="center"></el-table-column>
      <el-table-column label="上报时间" width="110px" align="center">
        <template slot-scope="scope">{{scope.row.time|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="frequency" label="频率(Hz)" width="60px" align="center"></el-table-column>
      <el-table-column prop="level" label="动液面(米)" width="80px" align="center"></el-table-column>
      <el-table-column prop="output" label="产量(吨)" align="center"></el-table-column>
      <el-table-column prop="power_consumption" label="日耗电(千瓦时)" width="80px" align="center"></el-table-column>
      <el-table-column prop="balance" label="平衡度" width="80px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.balance}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="建议调整量1(米)" width="90px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.adjustment1}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="建议调整量2(米)" width="90px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.adjustment2}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="建议调整量3(米)" width="90px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.adjustment3}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="建议调整量4(米)" width="90px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.adjustment4}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="建议调整量5(米)" width="90px" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.welltype=='抽油机'">
            <span>{{scope.row.adjustment5}}</span>
          </div>
          <div v-if="scope.row.welltype=='螺杆泵'">
            <span>{{"-"}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="active" label="有功(千瓦)" width="70px" align="center"></el-table-column>
      <el-table-column prop="electric_current" label="电流(安培)" width="70px" align="center"></el-table-column>
      <el-table-column prop="rush_times" label="冲次(次/分)/转速(转/分)" width="120px" align="center"></el-table-column>
      <el-table-column prop="stroke" label="冲程(米)" align="center"  width="70px"></el-table-column>
      <el-table-column prop="oil_pressure" label="油压(兆帕)" width="70px" align="center"></el-table-column>
      <el-table-column prop="nesting_pressure" label="套压(兆帕)" width="70px" align="center"></el-table-column>
      <el-table-column prop="sunken" label="沉没度(米)" width="80px" align="center"></el-table-column>
     
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
import { ApiGetRealdata, getDetail } from "@/api/realdata";
import { getDept } from "@/api/admin";
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
      pageSizeList: [20, 30, 50, 100],
      clientHeight:"",
      tableHeight:0,
      depts: [],
      deptsbelong: [],
      belong:'',
    };
  },
  methods: {
    getDeptList() {
      getDept().then(res => {
        this.depts = res.data.msg;
        this.formatMemberList()
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
     handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage =1;
      this.searchWell();
    },
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
      ApiGetRealdata({page:this.currentPage,pagenum:this.pageSize}).then(res => {
        this.comprehensivedata = res.data.realdata;
        this.total = res.data.page_count;
      });
    },
    searchWell(){
      this.cutType = 1;
      let data = {
        page: this.currentPage,
        pagenum:this.pageSize,
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
        belong_id:this.belong[this.belong.length-1],
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
        page: this.currentPage,
        well_type: this.wellCategory,
        number: this.wellNumber,
        status: this.wellStatus,
        daterange:this.wellDatePicker[0]+'-'+this.wellDatePicker[1],
        print: "null"
      };
      ApiGetRealdata(data).then(({ data }) => {
        this.uploadVisible = true;
        this.path = data.path;
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
    this.getDeptList();
    this.GetcomprehensiveData();
    this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
    this.tableHeight = this.clientHeight - 208
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
  .well-status{
    padding-right:5px
  }
  .cell-wellstatus{
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      padding-left: 5px;
    }
  }
}
</style>

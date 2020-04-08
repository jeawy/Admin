<template>
  <div id="wellList">
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
          井名:
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
        <el-col :span="5">
          <el-button type="primary" style="height:27.99px;margin-left:10px" @click="searchWell()">点击查询</el-button>
        </el-col>
      </el-row>
    <el-table
      :data="wellList"
      stripe
      :border="true"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="130" label="序号" align="center"></el-table-column>
      <el-table-column prop="number" label="井号" width="130" align="center"></el-table-column>
      <el-table-column label="井名" width="200" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'well-detail',params:{id:scope.row.id},query:{type:scope.row.pro_type}}"
          >{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="factory" label="厂" width="130" align="center"></el-table-column>
      <el-table-column prop="mine" label="矿" width="130" align="center"></el-table-column>
      <el-table-column prop="depth" label="泵深(米)" width="130" align="center"></el-table-column>
      <el-table-column prop="depth" label="油藏中深" width="130" align="center"></el-table-column>
      <el-table-column label="类型" width="130" align="center">
        <template slot-scope="scope">
           <div v-if="scope.row.well_type==0">
             {{scope.row.well_type|welltype}}
           </div>
           <div v-if="scope.row.well_type==1">
             {{scope.row.well_type|welltype}}
           </div>
         </template>
      </el-table-column>
      <el-table-column  label="状态" width="130" align="center">
         <template slot-scope="scope">
           <div v-if="scope.row.status==0" class="cell-wellstatus">
             <span class="well-status">{{scope.row.status|wellStatus}}</span>
             <svg-icon icon-class="wellon" />
           </div>
           <div v-if="scope.row.status==1" class="cell-wellstatus">
              <span class="well-status">{{scope.row.status|wellStatus}}</span>
              <svg-icon icon-class="welloff" />
           </div>
         </template>
      </el-table-column>
      <el-table-column label="状态变动日期" align="center" width="220px">
        <template slot-scope="scope">{{scope.row.changed_time|dateTimeFormat}}</template>
      </el-table-column>
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
  </div>
</template>
<script>
import { ApiGetWellList } from "@/api/wellList";
export default {
  data() {
    return {
      wellList: [],
      wellCategory: "-1",
      wellStatus: "",
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
      total: 0,
      currentPage: 1,
      pageSize: 50,
      pageSizeList: [10,  30, 50, 100],
      cutType: -1, //分页类型 
    };
  },
  methods: {
     handleSizeChange(val) {
      this.pageSize = val;
      this.GetwellList();
    },
    //分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetwellList();//正常查看
          break;
        case 1:
          this.searchWell(); //筛选分页查看
          break;
      }
      // 
    },
    GetwellList() {
      ApiGetWellList({page:this.currentPage,pagenum:this.pageSize}).then(res => {
        this.wellList = res.data.msg.well_list;
        this.total = res.data.msg.total;
      });
    },
    searchWell(){
      this.cutType = 1;
      let data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        wellno: this.wellNumber,
        status: this.wellStatus,
      };
      ApiGetWellList(data).then(res => {
        this.wellList = res.data.msg.well_list;
        this.total = res.data.msg.total;
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
    this.GetwellList();
  }
};
</script>
<style lang="scss">
#wellList {
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
  }
}
</style>

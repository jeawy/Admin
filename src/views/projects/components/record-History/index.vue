<template>
  <div id="tablerecord">
    <!-- 开关井记录 -->
    <el-table
     :data="recorddata.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      :border="true"
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column> 
      <el-table-column prop="status" label="开/关井" :formatter="Status"   align="center"></el-table-column>
       <el-table-column prop="time" label="时间"  align="center"></el-table-column>
      <el-table-column prop="last" label="持续时间(小时)"  align="center"></el-table-column>
    </el-table>
     <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20,30,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recorddata.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {ApiGetWellRecord} from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  name: "recordHistory",
  data() {
    return {
      recorddata: [],
      currentPage: 1, // 当前页码

      total: 0, // 总条数

      pageSize: 20 // 每页的数据条数
    };
  },
  methods: {
     handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
 
    getRecordData(wellid,date) {
      let lines = {};
      lines = {
        id: wellid,
        daterange: date
      };
      ApiGetWellRecord(lines).then(res => {
        // this.recorddata = data;
         this.recorddata = res.data;
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
    },
    
  }
};
</script>
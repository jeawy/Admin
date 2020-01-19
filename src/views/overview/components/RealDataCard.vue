<template>
  <el-card shadow="always" :body-style="{overflowY:'scroll',height:'245px'}">
  </el-card>
</template>
<script>
import { myRecord } from "@/api/training";
export default {
  data() {
    return {
      RecordList: [],
      tableLoading: false
    };
  },
  created() {
    this.myRecordList();
  },
  methods: {
    //是否提交作业格式化显示
    submitionFormat: function(row, column) {
      switch (row.submit_flag) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    myRecordList() {
      this.tableLoading = true;
      myRecord().then(({ data }) => {
        this.RecordList = [...data.msg];
        this.tableLoading = false;
      });
    }
  }
};
</script>
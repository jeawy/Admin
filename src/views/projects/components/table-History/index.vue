<template>
  <div id="tableHistory">
  <el-table 
  
    stripe 
    :border="true"  
    style="width: 100%;"
    :header-cell-style="{color:'#212529',fontSize:'14px',fontWeight:400}"
    :row-style="{fontSize:'14px',color:'#212529;',fontWeight:400,}">
      <el-table-column type="index" width="60" label="序号"  align="center"></el-table-column>
    <el-table-column  label="上报时间" align="center"></el-table-column>
    <el-table-column  label="频率(Hz)" align="center" width="60"></el-table-column>
    <el-table-column  label="动液面(米)" align="center" width="60"></el-table-column>
    <el-table-column  label="产量(吨)" align="center" width="60"></el-table-column>
    <el-table-column  label="日耗电(千瓦时)" align="center" width="60"></el-table-column>
    <el-table-column  label="平衡度(米)" align="center"></el-table-column>
    <el-table-column  label="建议调整量1(米)" align="center"></el-table-column>
    <el-table-column  label="建议调整量2(米)" align="center"></el-table-column>
    <el-table-column  label="建议调整量3(米)" align="center"></el-table-column>
    <el-table-column  label="建议调整量4(米)" align="center"></el-table-column>
    <el-table-column  label="建议调整量5(米)" align="center"></el-table-column>
     <el-table-column  label="有功(千瓦)" align="center"></el-table-column>
    <el-table-column  label="电流(安培)" align="center"></el-table-column>
    <el-table-column  label="冲次(次/分)/转速(转/分)" align="center"></el-table-column>
    <el-table-column  label="冲程(米)" align="center"></el-table-column>
    <el-table-column  label="油压(兆帕)" align="center"></el-table-column>
     <el-table-column  label="套压(兆帕)" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "tableHistory",
  components: {
  
  },
  watch: {},
  data() {
    return {};
  },
  methods: {
   
  },
  created() {
   
  }
};
</script>

<style lang="scss">

</style>
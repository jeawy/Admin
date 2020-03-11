<template>
  <div id="dataOperation">
    <el-row :gutter="20">
      <el-col :span="4">
      <el-button type="primary" class="btn" @click="openDialog(1)" size="medium">固定调参</el-button>
      </el-col>
      <el-col :span="4">
      <el-button  type="warning" class="btn" @click="openDialog(2)" size="medium">自动调参</el-button>
      </el-col>
      <el-col :span="4">
      <el-button type="primary" class="btn" @click="openDialog(3)" size="medium">参量修改</el-button>
      </el-col>
     <el-col :span="5">
      <el-button type="success" class="btn" @click="openDialog(4)" size="medium">发送实测值</el-button>
      </el-col>
      <el-col :span="6">
      <el-button  type="warning" class="btn" @click="openDialog(5)" size="medium">直接指令发送</el-button>
      </el-col>
    </el-row>
    <el-row>
      <!-- <el-table
        stripe
        :border="true"
        style="width: 100%;"
        :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
        :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
      >
        <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
        <el-table-column  label="井号" width="100px" align="center"></el-table-column>
        <el-table-column label="测量时间" width="180px" align="center"></el-table-column>
        <el-table-column  label="实测液面(米)" width="150px" align="center"></el-table-column>
        <el-table-column  label="实测产量(吨)" width="150px" align="center"></el-table-column>
      </el-table> -->
    </el-row>
    <el-dialog title="调频" :visible.sync="dialogVisible1" width="380px">
      <el-form :model="freguencyModal" ref="freguency-modal" label-width="100px" :rules="rules">
        <el-form-item label="频率" prop="freguency">
          <el-input-number v-model="freguencyModal.freguency" :precision="2" :step="0.1" :max="10"></el-input-number>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="freguencyForm('freguencyModal')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { ApiGetWellRecord } from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  name: "dataOperation",
  data() {
    return {
      data: "",
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      freguencyModal:{freguency:0},
      rules: {}
    };
  },
  methods: {
     openDialog(Type) {
      if (Type === 1) {
        this.dialogVisible1 = true;
      }
       if (Type === 2) {
        this.dialogVisible2 = true;
      }
       if (Type ===3) {
        this.dialogVisible3 = true;
      }
       if (Type === 4) {
        this.dialogVisible4 = true;
      }
       if (Type === 5) {
        this.dialogVisible5 = true;
      }
    },
    freguencyForm(freguencyModal) {
     
    },
    cancel() {
      this.dialogVisible1 = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 5px;
  margin-bottom: 10px;
}
.butn {
  text-align: right;
  margin-top: 50px;
}
</style>
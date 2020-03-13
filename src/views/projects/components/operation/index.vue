<template>
  <div id="dataOperation">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" class="btn" @click="openDialog(1)" size="medium"  v-if="auth">固定调参</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="warning" class="btn" @click="openDialog(2)" size="medium"  v-if="auth">自动调参</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="btn" @click="openDialog(3)" size="medium"  v-if="auth">参量修改</el-button>
      </el-col>
      <el-col :span="5">
        <el-button type="success" class="btn" @click="openDialog(4)" size="medium"  v-if="auth">发送实测值</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="warning" class="btn" @click="openDialog(5)" size="medium"  v-if="auth">直接指令发送</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="orderList"
        stripe
        :border="true"
        style="width: 100%;"
        :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
        :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
      >
        <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
        <el-table-column
          prop="order_type"
          label="指令类型"
          :formatter="Order_type"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column prop="text" label="内容" width="230px" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" width="100px" :formatter="Status" align="center"></el-table-column>
        <el-table-column label="执行日期" width="150px" align="center">
          <template slot-scope="scope">{{scope.row.exe_date|dateTimeFormat}}</template>
        </el-table-column>
        <el-table-column prop="result" label="执行结果" width="100px" align="center"></el-table-column>
         <el-table-column label="操作" align="center" width="100px" v-if="auth">
             <template slot-scope="scope">
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteOrder(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
              />
            </el-tooltip>
              </template>
         </el-table-column>
      </el-table>

    </el-row>
    <el-dialog title="调频" :visible.sync="dialogVisible1" width="380px">
      <el-form :model="freguencyModal" ref="freguency-modal" label-width="100px" :rules="rules">
        <el-form-item label="频率" prop="freguency">
          <el-input-number v-model="freguencyModal.freguency" :precision="1" :step="0.1" :max="10"></el-input-number>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="freguencyForm('freguencyModal')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="自动调参" :visible.sync="dialogVisible2" width="380px">
      <span>确定执行自动调参</span>
      <div class="butn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="autoFreguency()">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="参量修改" :visible.sync="dialogVisible3" width="500px">
      <el-form :model="paramModal" ref="param-modal" :rules="rules">
        <el-form-item label="含水" prop="container">
          <el-input-number v-model="paramModal.container" :precision="2" :step="0.01" size="medium"></el-input-number>
        </el-form-item>
        <el-form-item label="冲程" prop="stroke">
          <el-input-number
            v-model="paramModal.stroke"
            :precision="1"
            :step="0.1"
            placeholder="米"
            size="medium"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="泵型(泵径)" prop="pumptype">
          <el-input-number v-model="paramModal.pumptype" :step="1" placeholder="毫米" size="medium"></el-input-number>
        </el-form-item>
        <el-form-item label="泵挂" prop="pumphanging">
          <el-input-number v-model="paramModal.pumphanging" :step="1" size="medium"></el-input-number>
        </el-form-item>
        <el-form-item label="平衡块" prop="banlence">
          <el-input-number v-model="paramModal.banlence" :step="1" size="medium"></el-input-number>
        </el-form-item>
        <el-form-item label="油管外径尺寸" prop="outerDiameter" placeholder="毫米">
          <el-input-number v-model="paramModal.outerDiameter" :step="1" size="medium"></el-input-number>
        </el-form-item>
        <el-form-item label="机型" prop="machineType ">
          <el-select v-model="paramModal.machineTyper" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="永磁电动机额定功率" prop="permanentMagnetMotorRatedPower" placeholder="千瓦">
          <el-input-number
            v-model="paramModal.permanentMagnetMotorRatedPower"
            :step="0.1"
            size="medium"
            :precision="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="异步电动机额定功率" prop="asynchronous_motor_rated_power" placeholder="千瓦">
          <el-input-number
            v-model="paramModal.asynchronous_motor_rated_power"
            :step="0.1"
            size="medium"
            :precision="1"
          ></el-input-number>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="paramForm('paramModal')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="发送实测数据" :visible.sync="dialogVisible4" width="450px">
      <el-form :model="readdataBtn" ref="readdata-btn" :rules="rules">
        <el-form-item label="声波实测液面值" prop="realLevel ">
          <el-input-number v-model="readdataBtn.realLevel" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="计量间实测产量值" prop="dataOutput">
          <el-input-number v-model="readdataBtn.dataOutput" :precision="0" :step="1"></el-input-number>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="realdataForm('readdataBtn')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="指令发送" :visible.sync="dialogVisible5" width="450px">
      <el-form :model="anyOrderModal" ref="any-order-modal"  :rules="rules">
        <el-form-item  label="十六进制指令" prop="anyOrder" >
        <el-input  v-model="anyOrderModal.anyOrder" placeholder="请输入内容" style="width:300px;"></el-input>
        </el-form-item>
        <div class="butn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="anyOrderForm('anyOrderModal')">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  ApiGetWellRecord,
  ApiGetOrders,
  ApiCreateOrder,
  ApiDeleteOrder
} from "@/api/welldetail";
import dayjs from "dayjs";
export default {
  name: "dataOperation",
  data() {
    return {
      number: "",
      auth:"",
      id: this.$route.params.id,
      orderList: [],
      data: "",
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      freguencyModal: { freguency: 0 },
      rules: {},
      paramModal: {
        container: 0,
        stroke: 0,
        pumptype: 0,
        pumphanging: 0,
        banlence: 0,
        outerDiameter: 0,
        permanentMagnetMotorRatedPower: 0,
        asynchronous_motor_rated_power: 0,
        machineTyper: null
      },
      options: [
        {
          value: "1",
          label: "CYJ3-1.4-6.5HB"
        },
        {
          value: "2",
          label: "CYJ6-2.5-26HB"
        },
        {
          value: "3",
          label: "CYJY6(5)-2.5-26HB"
        },
        {
          value: "4",
          label: "CYJ8-3-37HB"
        },
        {
          value: "5",
          label: "CYJ10-3-37HB"
        },
        {
          value: "6",
          label: "CYJ10-3-53HB"
        },
        {
          value: "7",
          label: "CYJY8-3-37HB"
        },
        {
          value: "8",
          label: "CYJY12-3-53HB"
        },
        {
          value: "9",
          label: "CYJY10-4.2-53HB"
        },
        {
          value: "10",
          label: "CYJY12-4.2-73HB"
        },
        {
          value: "11",
          label: "CYJY14-5.5-73HB"
        },
        {
          value: "12",
          label: "CYJY14-5.5-89HB"
        },
        {
          value: "13",
          label: "CYJY6(5)-3-26HB"
        },
        {
          value: "14",
          label: "CYJY10-3-37HB"
        },
        {
          value: "15",
          label: "CYJY10-3-53HB"
        }
      ],
      value: "",
      readdataBtn: {
        realLevel: 0,
        dataOutput: 0
      },
      anyOrderModal:{
        anyOrder:'',
      },
    };
  },
  methods: {
    //获取指令列表
    getOrderList() {
      ApiGetOrders().then(res => {
        this.orderList = res.data.msg;
      });
    },
    openDialog(Type) {
      if (Type === 1) {
        this.dialogVisible1 = true;
      }
      if (Type === 2) {
        this.dialogVisible2 = true;
      }
      if (Type === 3) {
        this.dialogVisible3 = true;
      }
      if (Type === 4) {
        this.dialogVisible4 = true;
      }
      if (Type === 5) {
        this.dialogVisible5 = true;
      }
    },
    //调频
    freguencyForm(freguencyModal) {
      let freguency = {};
      freguency = {
        well_no: this.number,
        frequency: this.freguencyModal.freguency
      };
      ApiCreateOrder(freguency).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible1 = false;
          this.freguencyModal = {};
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.freguencyModal = {};
        }
      });
    },
    //自动调参
    autoFreguency() {
      ApiCreateOrder({ well_no: this.number, auto: "" }).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible2 = false;
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //参量修改
    paramForm(paramModal) {
      let param = {};
      param = {
        well_no: this.number,
        param: "",
        container: this.paramModal.container,
        stroke: this.paramModal.stroke,
        pumphanging: this.paramModal.pumphanging,
        pumptype: this.paramModal.pumptype,
        machine_type: this.paramModal.machineTyper,
        outer_diameter: this.paramModal.outerDiameter,
        banlence: this.paramModal.banlence,
        permanent_magnet_motor_rated_power: this.paramModal
          .permanentMagnetMotorRatedPower,
        asynchronous_motor_rated_power: this.paramModal
          .asynchronous_motor_rated_power
      };
      if (param.container === 0) {
        delete param.container;
      }
      if (param.stroke === 0) {
        delete param.stroke;
      }
      if (param.container === 0) {
        delete param.container;
      }
      if (param.pumphanging === 0) {
        delete param.pumphanging;
      }
      if (param.pumptype === 0) {
        delete param.pumptype;
      }
      if (param.machine_type == null) {
        delete param.machine_type;
      }
      if (param.outer_diameter === 0) {
        delete param.outer_diameter;
      }
      if (param.container === 0) {
        delete param.container;
      }
      if (param.banlence === 0) {
        delete param.banlence;
      }
      if (param.asynchronous_motor_rated_power === 0) {
        delete param.asynchronous_motor_rated_power;
      }
      if (param.permanent_magnet_motor_rated_power === 0) {
        delete param.permanent_magnet_motor_rated_power;
      }
      ApiCreateOrder(param).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible3 = false;
          this.paramModal = {};
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.paramModal = {};
        }
      });
    },
    //发送实测值
    realdataForm(readdataBtn) {
      let rel = {};
      rel = {
        well_no: this.number,
        real_level: this.readdataBtn.realLevel,
        data_output: this.readdataBtn.dataOutput
      };
      //  if (rel.real_level === 0) {
      //       delete rel.real_level;
      //     }
      //      if (rel.data_output === 0) {
      //       delete rel.data_output;
      //     }
      ApiCreateOrder(rel).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible4 = false;
          this.readdataBtn = {};
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.readdataBtn = {};
        }
      });
    },
    Order_type: function(row, column) {
      switch (row.order_type) {
        case 0:
          return " 维持当前运行状态";
          break;
        case 1:
          return "固定频率调参";
          break;
        case 2:
          return "现场系统调参";
          break;
        case 3:
          return "参量调整";
          break;
        case 4:
          return "直接指令";
          break;
      }
    },
    //直接指令发送
    anyOrderForm(anyOrderModal){
      let order = {};
       order = {
        well_no: this.number,
        any_order : this.anyOrderModal.anyOrder
      };
        ApiCreateOrder(order).then(res => {
        if (res.data.status === 0) {
          this.$message.success(res.data.msg);
          this.dialogVisible5= false;
          this.anyOrderModal = {};
          this.getOrderList();
        } else {
          this.$message.error(res.data.msg);
          this.anyOrderModal = {};
        }
      });

    },
     //指令删除
    deleteOrder(id) {
      this.$confirm("此操作将永久删除指令, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ApiDeleteOrder({ id: id,method: "delete",}).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getOrderList();
          }
        });
      });
    },
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "未执行";
          break;
        case 1:
          return "已执行";
          break;
      }
    },
    cancel() {
      this.dialogVisible1 = false;
    }
  },

  created() {
    this.getOrderList();
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
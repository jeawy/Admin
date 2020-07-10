<template>
  <div id="built">
    <el-form :model="addwellForm" status-icon ref="addwellForm" label-width="90px">
      <el-row :gutter="15">
        <el-col :sm="6">
          <el-form-item label="归属:" prop="belongs">
            <el-cascader
              :options="depts"
              v-model="addwellForm.belongs"
              type="text"
              :props="props"
              style="width:160px;"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="井号:" prop="number">
            <el-input
              v-model="addwellForm.number"
              placeholder="必须为数字"
              oninput="value=value.replace(/[^\d]/g,'')"
              style="width:160px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="井名:" prop="name">
            <el-input v-model="addwellForm.name" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label=" 状态:" prop="status">
            <el-select v-model="addwellForm.status" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in statuslist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="油井类别:" prop="well_type">
            <el-select v-model="addwellForm.well_type" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in category"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="泵深:" prop="depth">
            <el-input-number v-model="addwellForm.depth" style="width:160px;" ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="现场设备:" prop="ip">
            <el-input
              v-model="addwellForm.ip"
              placeholder="数字或小数点"
              oninput="value=value.replace(/[^\d.]/g,'')"
              style="width:160px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="含水:" prop="watery">
            <el-input-number v-model="addwellForm.watery" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="光杆规范:" prop="rod">
            <el-input
              v-model="addwellForm.rod"
              placeholder="数字或小数点"
              oninput="value=value.replace(/[^\d.]/g,'')"
              style="width:160px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="套管规范:" prop="cover">
            <el-input
              v-model="addwellForm.cover"
              placeholder="数字或小数点"
              oninput="value=value.replace(/[^\d.]/g,'')"
              style="width:160px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="油管规范:" prop="pipe">
            <el-input
              v-model="addwellForm.pipe"
              placeholder="数字或小数点"
              oninput="value=value.replace(/[^\d.]/g,'')"
              style="width:160px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="机型:" prop="machine_type">
            <el-input v-model="addwellForm.machine_type" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="电机:" prop="machine">
            <el-input v-model="addwellForm.machine" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="曲柄:" prop="crank">
            <el-input v-model="addwellForm.crank" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="配电箱:" prop="box">
            <el-input v-model="addwellForm.box" style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="额定功率:" prop="rated_power">
            <el-input-number v-model="addwellForm.rated_power" style="width:160px;" ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="电机功率:" prop="motor_power">
            <el-input-number v-model="addwellForm.motor_power" style="width:160px;" ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="电机类型:" prop="motor_type">
            <el-select v-model="addwellForm.motor_type" placeholder="请选择" style="width:160px;">
              <el-option
                v-for="item in motorType"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="大平衡块数量:" prop="big_balance_num" label-width="130px;">
            <el-input-number v-model="addwellForm.big_balance_num" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="小平衡块数量:" prop="small_balance_num" label-width="130px;">
            <el-input-number v-model="addwellForm.small_balance_num" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
          <el-col :sm="6">
          <el-form-item label="平衡块尺寸1:" prop="size_1_small_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.size_1_small_balance"
              style="width:160px;"
           
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸2:" prop="size_2_small_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.size_2_small_balance"
              style="width:160px;"
          
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸3:" prop="size_1_big_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.size_1_big_balance"
              style="width:160px;"
             
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块尺寸4:" prop="size_2_big_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.size_2_big_balance"
              style="width:160px;"
             
            ></el-input-number>
          </el-form-item>
        </el-col>
      
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
          <el-col :sm="6">
          <el-form-item label="平衡块重量1:" prop="weight_1_small_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.weight_1_small_balance"
              style="width:160px;"
             
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量2:" prop="weight_2_small_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.weight_2_small_balance"
              style="width:160px;"
          
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量3:" prop="weight_1_big_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.weight_1_big_balance"
              style="width:160px;"
            
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="平衡块重量4:" prop="weight_2_big_balance" label-width="130px;">
            <el-input-number
              v-model="addwellForm.weight_2_big_balance"
              style="width:160px;"
              
            ></el-input-number>
          </el-form-item>
        </el-col>
      
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="曲柄尺寸1:" prop="size_1_crank" label-width="130px;">
            <el-input-number v-model="addwellForm.size_1_crank" style="width:160px;" ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="泵径:" prop="pump_diameter">
            <el-input-number
              v-model="addwellForm.pump_diameter"
              style="width:160px;"
          
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="油管外径:" prop="tubing_outer_diameter">
            <el-input-number
              v-model="addwellForm.tubing_outer_diameter"
              style="width:160px;"
            
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="套管内径" prop="casing_inner_diameter">
            <el-input-number
              v-model="addwellForm.casing_inner_diameter"
              style="width:160px;"
            
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="泵挂:" prop="pump_hang">
            <el-input-number v-model="addwellForm.pump_hang" style="width:160px;" ></el-input-number>
          </el-form-item>
        </el-col>
        
      <el-col :sm="6">
          <el-form-item label="曲柄尺寸2:" prop="size_2_crank">
            <el-input-number v-model="addwellForm.size_2_crank" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="曲柄销重量:" prop="crank_pin_weight">
            <el-input-number v-model="addwellForm.crank_pin_weight" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="曲柄重量1:" prop="weight_1_crank">
            <el-input-number v-model="addwellForm.weight_1_crank" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15" style="margin-top:10px;">
        <el-col :sm="6">
          <el-form-item label="曲柄重量2:" prop="weight_2_crank">
            <el-input-number v-model="addwellForm.weight_2_crank" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="偏置角:" prop="offset_angle">
            <el-input-number v-model="addwellForm.offset_angle" style="width:160px;"></el-input-number>
          </el-form-item>
        </el-col>
         <el-col :sm="6">
          <el-form-item label="冲次(转速)上限值:" prop="toplimit">
            <el-input-number v-model="addwellForm.toplimit" style="width:160px;" 
             :min="0&&addwellForm.lowerlimit"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item label="冲次(转速)下限值:" prop="lowerlimit">
            <el-input-number v-model="addwellForm.lowerlimit" style="width:160px;"
             :min="0"  :max="addwellForm.toplimit" ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="btn">
        <el-button @click="cancel">清空</el-button>
        <el-button type="primary" @click="submitForm('addwellForm',)">{{id?'修改':'新建'}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { ApiAddWell, ApiGetWellList, ApiAlterWell } from "@/api/wellList";
import { getDept } from "@/api/admin";
export default {
  data() {
    return {
      id: this.$route.params.id || "",
      // name: this.$route.params.name ,
      //  belongs: this.$route.params.belongs,
      //  well_type:this.$route.params.well_type,
      depts: [],
      addwellForm: {
        //  belongs:[1,2,3,5],
      },
      // value:"0",

      statuslist: [
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
      //   Status: "",
      category: [
        {
          value: "0",
          label: "抽油机"
        },
        {
          value: "1",
          label: "螺杆泵"
        }
      ],
      wellCategory: "",
      motorType: [
        {
          value: "0",
          label: " 异步YB"
        },
        {
          value: "1",
          label: "永磁YC"
        }
      ]
    };
  },
  computed: {
    props() {
      return {
        ActiveRow: {},
        expandTrigger: "hover",
        emitPath: false,
        value: "id",
        label: "name",
        lazy: false,
        GetwellList: [],
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 }).map(item => ({
              leaf: level >= 2
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          }, 1000);
        }
      };
    }
  },
  mounted() {
    if (this.id.id) {
      this.ActiveRow = {
        ...this.id
      };
      this.addwellForm = {
        ...this.ActiveRow,
         motor_power:this.ActiveRow.motor_power==null?undefined:this.ActiveRow.motor_power,
        size_1_crank:this.ActiveRow.size_1_crank==null?undefined:this.ActiveRow.size_1_crank,
          size_2_crank:this.ActiveRow.size_2_crank==null?undefined:this.ActiveRow.size_2_crank,
   weight_1_crank:this.ActiveRow.weight_1_crank==null?undefined:this.ActiveRow.weight_1_crank,
    weight_2_crank:this.ActiveRow.weight_2_crank==null?undefined:this.ActiveRow.weight_2_crank,
     rated_power:this.ActiveRow.rated_power==null?undefined:this.ActiveRow.rated_power,
        big_balance_num:this.ActiveRow.big_balance_num==null?undefined:this.ActiveRow.big_balance_num,
      small_balance_num:this.ActiveRow.small_balance_num==null?undefined:this.ActiveRow.small_balance_num,
  size_1_small_balance:this.ActiveRow.size_1_small_balance==null?undefined:this.ActiveRow.size_1_small_balance,
      size_2_small_balance:this.ActiveRow.size_2_small_balance==null?undefined:this.ActiveRow.size_2_small_balance,
     size_1_big_balance:this.ActiveRow.size_1_big_balance==null?undefined:this.ActiveRow.size_1_big_balance,
     size_2_big_balance:this.ActiveRow.size_2_big_balance==null?undefined:this.ActiveRow.size_2_big_balance,
 weight_1_small_balance:this.ActiveRow.weight_1_small_balance==null?undefined:this.ActiveRow.weight_1_small_balance,
   weight_2_small_balance:this.ActiveRow.weight_2_small_balance==null?undefined:this.ActiveRow.weight_2_small_balance,
        weight_1_big_balance:this.ActiveRow.weight_1_big_balance==null?undefined:this.ActiveRow.weight_1_big_balance,
    weight_2_big_balance:this.ActiveRow.weight_2_big_balance==null?undefined:this.ActiveRow.weight_2_big_balance,
      pump_diameter:this.ActiveRow.pump_diameter==null?undefined:this.ActiveRow.pump_diameter,
       pump_hang:this.ActiveRow.pump_hang==null?undefined:this.ActiveRow.pump_hang,
        tubing_outer_diameter:this.ActiveRow.tubing_outer_diameter==null?undefined:this.ActiveRow.tubing_outer_diameter,
         casing_inner_diameter:this.ActiveRow.casing_inner_diameter==null?undefined:this.ActiveRow.casing_inner_diameter,
    watery:this.ActiveRow.watery==null?undefined:this.ActiveRow.watery,
      //   stroke:this.ActiveRow.stroke==null?undefined:this.ActiveRow.stroke,
      //  impulse_times:this.ActiveRow.impulse_times==null?undefined:this.ActiveRow.impulse_times,
      //   ratedImpulse_times:this.ActiveRow.ratedImpulse_times==null?undefined:this.ActiveRow.ratedImpulse_times,
       depth:this.ActiveRow.depth==null?undefined:this.ActiveRow.depth,
      //   rated_rowArran:this.ActiveRow.rated_rowArran==null?undefined:this.ActiveRow.rated_rowArran,
      //  unbalance_waight:this.ActiveRow.unbalance_waight==null?undefined:this.ActiveRow.unbalance_waight,
        belongs: this.ActiveRow.belongs_ids[3],
        status: String(this.ActiveRow.status),
        well_type: String(this.ActiveRow.well_type)
      };
      // console.log(this.addwellForm.dept_id)
    }
  },
  methods: {
    getDeptList() {
      getDept().then(res => {
        res.data.msg.map(item => {
          item.children.map(ite => {
            ite.children.map(it => {
              it.children.map(i => {
                i.children = null;
              });
            });
          });
        });
        this.depts = res.data.msg;
      });
    },

    submitForm(addwellForm) {
      if (this.id.id) {
        let wellparams = {};
        wellparams = {
          well_id: this.id.id,
          dept_id: this.addwellForm.belongs,
          number: this.addwellForm.number,
          name: this.addwellForm.name,
          status: this.addwellForm.status,
          well_type: this.addwellForm.well_type,
          depth: this.addwellForm.depth,
          ip: this.addwellForm.ip,
          rod: this.addwellForm.rod,
          cover: this.addwellForm.cover,
          pipe: this.addwellForm.pipe,
          machine_type: this.addwellForm.machine_type,
          machine: this.addwellForm.machine,
          crank: this.addwellForm.crank,
          box: this.addwellForm.box,
          rated_power: this.addwellForm.rated_power,
          motor_power: this.addwellForm.motor_power,
          motor_type: this.addwellForm.motor_type,
          big_balance_num: this.addwellForm.big_balance_num,
          small_balance_num: this.addwellForm.small_balance_num,
          size_1_big_balance: this.addwellForm.size_1_big_balance,
          size_2_big_balance: this.addwellForm.size_2_big_balance,
          size_1_small_balance: this.addwellForm.size_1_small_balance,
          size_2_small_balance: this.addwellForm.size_2_small_balance,
          weight_1_big_balance: this.addwellForm.weight_1_big_balance,
          weight_2_big_balance: this.addwellForm.weight_2_big_balance,
          weight_1_small_balance: this.addwellForm.weight_1_small_balance,
          weight_2_small_balance: this.addwellForm.weight_2_small_balance,
          size_1_crank: this.addwellForm.size_1_crank,
                     size_2_crank: this.addwellForm.size_2_crank,
          pump_diameter: this.addwellForm.pump_diameter,
           weight_1_crank: this.addwellForm.weight_1_crank,
          weight_2_crank: this.addwellForm.weight_2_crank,
          tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
          casing_inner_diameter: this.addwellForm.casing_inner_diameter,
          pump_hang: this.addwellForm.pump_hang,
          watery: this.addwellForm.watery,
           toplimit: this.addwellForm.toplimit,
            lowerlimit: this.addwellForm.lowerlimit,
        };

        if (wellparams.dept_id == undefined) {
          delete wellparams.dept_id;
        }
        if (wellparams.number == undefined) {
          delete wellparams.number;
        }
        if (wellparams.name == undefined) {
          delete wellparams.name;
        }
        if (wellparams.status == undefined) {
          delete wellparams.status;
        }
        if (wellparams.well_type == undefined) {
          delete wellparams.well_type;
        }
        if (wellparams.depth == undefined) {
          delete wellparams.depth;
        }
        if (wellparams.ip == undefined) {
          delete wellparams.ip;
        }
        if (wellparams.rod == undefined) {
          delete wellparams.rod;
        }
        if (wellparams.cover == undefined) {
          delete wellparams.cover;
        }
        if (wellparams.pipe == undefined) {
          delete wellparams.pipe;
        }
        if (wellparams.machine_type == undefined) {
          delete wellparams.machine_type;
        }
        if (wellparams.machine == undefined) {
          delete wellparams.machine;
        }
        if (wellparams.crank == undefined) {
          delete wellparams.crank;
        }
        if (wellparams.box == undefined) {
          delete wellparams.box;
        }
        if (wellparams.rated_power == undefined) {
          delete wellparams.rated_power;
        }
        if (wellparams.motor_power == undefined) {
          delete wellparams.motor_power;
        }
        if (wellparams.motor_type == undefined) {
          delete wellparams.motor_type;
        }
        if (wellparams.big_balance_num == undefined) {
          delete wellparams.big_balance_num;
        }
        if (wellparams.small_balance_num == undefined) {
          delete wellparams.small_balance_num;
        }
        if (wellparams.size_1_big_balance == undefined) {
          delete wellparams.size_1_big_balance;
        }
        if (wellparams.size_2_big_balance == undefined) {
          delete wellparams.size_2_big_balance;
        }
        if (wellparams.size_1_small_balance == undefined) {
          delete wellparams.size_1_small_balance;
        }
        if (wellparams.size_2_small_balance == undefined) {
          delete wellparams.size_2_small_balance;
        }
        if (wellparams.weight_1_big_balance == undefined) {
          delete wellparams.weight_1_big_balance;
        }
        if (wellparams.weight_2_big_balance == undefined) {
          delete wellparams.weight_2_big_balance;
        }
        if (wellparams.weight_1_small_balance == undefined) {
          delete wellparams.weight_1_small_balance;
        }
        if (wellparams.weight_2_small_balance == undefined) {
          delete wellparams.weight_2_small_balance;
        }
        if (wellparams.size_1_crank == undefined) {
          delete wellparams.size_1_crank;
        }
        if (wellparams.pump_diameter == undefined) {
          delete wellparams.pump_diameter;
        }
        if (wellparams.tubing_outer_diameter == undefined) {
          delete wellparams.tubing_outer_diameter;
        }
        if (wellparams.casing_inner_diameter == undefined) {
          delete wellparams.casing_inner_diameter;
        }
        if (wellparams.pump_hang == undefined) {
          delete wellparams.pump_hang;
        }
        if (wellparams.watery == undefined) {
          delete wellparams.watery;
        }
        
        if (wellparams.size_2_crank == undefined) {
          delete wellparams.size_2_crank;
        }
        if (wellparams.crank_pin_weight == undefined) {
          delete wellparams.crank_pin_weight;
        }
        if (wellparams.weight_1_crank == undefined) {
          delete wellparams.weight_1_crank;
        }
        if (wellparams.weight_2_crank == undefined) {
          delete wellparams.weight_2_crank;
        }
        if (wellparams.offset_angle == undefined) {
          delete wellparams.offset_angle;
        }
        if (wellparams.toplimit == undefined) {
          delete wellparams.toplimit;
        }
        if (wellparams.lowerlimit == undefined) {
          delete wellparams.lowerlimit;
        }
        ApiAlterWell(wellparams).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            // this.addwellForm={};
          } else {
            this.$message.error(data.msg);
            //  this.addwellForm={};
          }
        });
      } else {
        let wellparams = {};
        wellparams = {
          dept_id: this.addwellForm.belongs,
          number: this.addwellForm.number,
          name: this.addwellForm.name,
          status: this.addwellForm.status,
          well_type: this.addwellForm.well_type,
          depth: this.addwellForm.depth,
          ip: this.addwellForm.ip,
          rod: this.addwellForm.rod,
          cover: this.addwellForm.cover,
          pipe: this.addwellForm.pipe,
          machine_type: this.addwellForm.machine_type,
          machine: this.addwellForm.machine,
          crank: this.addwellForm.crank,
          box: this.addwellForm.box,
          rated_power: this.addwellForm.rated_power,
          motor_power: this.addwellForm.motor_power,
          motor_type: this.addwellForm.motor_type,
          big_balance_num: this.addwellForm.big_balance_num,
          small_balance_num: this.addwellForm.small_balance_num,
          size_1_big_balance: this.addwellForm.size_1_big_balance,
          size_2_big_balance: this.addwellForm.size_2_big_balance,
          size_1_small_balance: this.addwellForm.size_1_small_balance,
          size_2_small_balance: this.addwellForm.size_2_small_balance,
          weight_1_big_balance: this.addwellForm.weight_1_big_balance,
          weight_2_big_balance: this.addwellForm.weight_2_big_balance,
          weight_1_small_balance: this.addwellForm.weight_1_small_balance,
          weight_2_small_balance: this.addwellForm.weight_2_small_balance,
          size_1_crank: this.addwellForm.size_1_crank,
          pump_diameter: this.addwellForm.pump_diameter,
          tubing_outer_diameter: this.addwellForm.tubing_outer_diameter,
          casing_inner_diameter: this.addwellForm.casing_inner_diameter,
          pump_hang: this.addwellForm.pump_hang,
          watery: this.addwellForm.watery,
           size_2_crank: this.addwellForm.size_2_crank,
          crank_pin_weight: this.addwellForm.crank_pin_weight,
          weight_1_crank: this.addwellForm.weight_1_crank,
          weight_2_crank: this.addwellForm.weight_2_crank,
          offset_angle: this.addwellForm.offset_angle,
           toplimit: this.addwellForm.toplimit,
            lowerlimit: this.addwellForm.lowerlimit,
        };
        if (wellparams.dept_id == undefined) {
          delete wellparams.dept_id;
        }
        if (wellparams.number == undefined) {
          delete wellparams.number;
        }
        if (wellparams.name == undefined) {
          delete wellparams.name;
        }
        if (wellparams.status == undefined) {
          delete wellparams.status;
        }
        if (wellparams.well_type == undefined) {
          delete wellparams.well_type;
        }
        if (wellparams.depth == undefined) {
          delete wellparams.depth;
        }
        if (wellparams.ip == undefined) {
          delete wellparams.ip;
        }
        if (wellparams.rod == undefined) {
          delete wellparams.rod;
        }
        if (wellparams.cover == undefined) {
          delete wellparams.cover;
        }
        if (wellparams.pipe == undefined) {
          delete wellparams.pipe;
        }
        if (wellparams.machine_type == undefined) {
          delete wellparams.machine_type;
        }
        if (wellparams.machine == undefined) {
          delete wellparams.machine;
        }
        if (wellparams.crank == undefined) {
          delete wellparams.crank;
        }
        if (wellparams.box == undefined) {
          delete wellparams.box;
        }
        if (wellparams.rated_power == undefined) {
          delete wellparams.rated_power;
        }
        if (wellparams.motor_power == undefined) {
          delete wellparams.motor_power;
        }
        if (wellparams.motor_type == undefined) {
          delete wellparams.motor_type;
        }
        if (wellparams.big_balance_num == undefined) {
          delete wellparams.big_balance_num;
        }
        if (wellparams.small_balance_num == undefined) {
          delete wellparams.small_balance_num;
        }
        if (wellparams.size_1_big_balance == undefined) {
          delete wellparams.size_1_big_balance;
        }
        if (wellparams.size_2_big_balance == undefined) {
          delete wellparams.size_2_big_balance;
        }
        if (wellparams.size_1_small_balance == undefined) {
          delete wellparams.size_1_small_balance;
        }
        if (wellparams.size_2_small_balance == undefined) {
          delete wellparams.size_2_small_balance;
        }
        if (wellparams.weight_1_big_balance == undefined) {
          delete wellparams.weight_1_big_balance;
        }
        if (wellparams.weight_2_big_balance == undefined) {
          delete wellparams.weight_2_big_balance;
        }
        if (wellparams.weight_1_small_balance == undefined) {
          delete wellparams.weight_1_small_balance;
        }
        if (wellparams.weight_2_small_balance == undefined) {
          delete wellparams.weight_2_small_balance;
        }
        if (wellparams.size_1_crank == undefined) {
          delete wellparams.size_1_crank;
        }
        if (wellparams.pump_diameter == undefined) {
          delete wellparams.pump_diameter;
        }
        if (wellparams.tubing_outer_diameter == undefined) {
          delete wellparams.tubing_outer_diameter;
        }
        if (wellparams.casing_inner_diameter == undefined) {
          delete wellparams.casing_inner_diameter;
        }
        if (wellparams.pump_hang == undefined) {
          delete wellparams.pump_hang;
        }
        if (wellparams.watery == undefined) {
          delete wellparams.watery;
        }
        
        if (wellparams.size_2_crank == undefined) {
          delete wellparams.size_2_crank;
        }
        if (wellparams.crank_pin_weight == undefined) {
          delete wellparams.crank_pin_weight;
        }
        if (wellparams.weight_1_crank == undefined) {
          delete wellparams.weight_1_crank;
        }
        if (wellparams.weight_2_crank == undefined) {
          delete wellparams.weight_2_crank;
        }
        if (wellparams.offset_angle == undefined) {
          delete wellparams.offset_angle;
        }
        if (wellparams.toplimit == undefined) {
          delete wellparams.toplimit;
        }
        if (wellparams.lowerlimit == undefined) {
          delete wellparams.lowerlimit;
        }
        ApiAddWell(wellparams).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            // this.addwellForm={};
          } else {
            this.$message.error(data.msg);
            //  this.addwellForm={};
          }
        });
      }
    },
    cancel() {
      this.$refs["addwellForm"].resetFields();
    },
    GetwellList() {
      ApiGetWellList().then(res => {
        this.wellList = res.data.msg.well_list;
        // this.total = res.data.msg.total;
      });
    }
  },
  created() {
    this.getDeptList();
  }
};
</script>
<style lang="scss">
#built {
  //   font-size: 12px;
  background-color: #f4f5f5;
  height: 100%;
  .row-bg-top {
    align-items: center;
    padding: 10px;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 0 0 0;
  }
  .btn {
    text-align: right;
    margin-top: 0px;
    margin-right: 60px;
  }
}
</style>
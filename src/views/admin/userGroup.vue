<template>
  <div id="userGroup">
    <el-container>
      <el-header style="padding:0px;margin: 0px">
        <el-row type="flex" align="middle" justify="space-between">
          <el-row type="flex" align="middle">
            <el-radio-group v-model="radio" style="margin-right:10px">
              <el-radio-button :label="1">所有用户</el-radio-button>
              <el-radio-button :label="2">未分组</el-radio-button>
            </el-radio-group>
            <el-input
              placeholder="输入用户名搜索"
              v-model="filterText"
              prefix-icon="el-icon-search"
              style="width:200px;margin-right:10px"
            ></el-input>用户总数：
            <label for style="color:#ed4014">{{ dealUserCount }}</label>
          </el-row>
          <el-row type="flex" align="middle">
            <template v-if="perssion">
            <el-button
              type="primary"
              @click="openDialog(2)"
              :disabled="this.multipleSelection.length === 0 ||this.multipleSelection.length>1"
            >重置密码</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="openDialog(1)">添加用户</el-button>
              <!-- <el-button
                icon="el-icon-upload2"
                type="success"
                @click="$router.push({name:'import-users'})"
              >
                <slot name="import">用户导入</slot>
              </el-button> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delMulUsers()"
                :disabled="this.multipleSelection.length === 0"
              >批量删除</el-button>
            </template>
          </el-row>
        </el-row>
      </el-header>
      <el-main style="padding: 0px">
        <users-table
          :UserList="UserList"
          :perssion="perssion"
          :tableLoading="tLoading"
          @refresh="getAllUserlist"
          @selection="handleSelectionChange"
        ></users-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogShow1" :title="dialogName" width="400px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="userForm"
        :rules="rules"
        ref="userForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" @input="change($event)">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex" style="padding-top:8px">
            <el-radio-button :label="0">男</el-radio-button>
            <el-radio-button :label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码(默认)" prop="password">
          <el-input v-model="userForm.password" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isactive">
          <el-switch v-model="userForm.isactive"></el-switch>
        </el-form-item>
         <!-- <el-form-item label="是否为练习生" prop="trainingMenber">
          <el-switch 
            v-model="userForm.trainingMenber"  
            @change="showSchool">
            </el-switch>
        </el-form-item> -->
        <!-- <el-form-item label="学校" prop="school" v-show="userForm.trainingMenber">
          <el-input v-model="userForm.school" @input="change($event)" ></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addUser">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogShow2" width="400px">
      <el-form
        :model="resetPassForm"
        status-icon
        :rules="rules"
        ref="resetPassForm"
        label-width="90px"
      >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="resetPassForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="resetPassForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button @click="resetForm('resetPassForm')">重置</el-button> -->
          <el-button type="primary" @click="submitForm('resetPassForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import usersTable from "@/views/components/UsersTable";
import { getUserList, getUserPerfession, deleteUser, editUserDetail } from "@/api/admin";
import { addUser } from "@/api/login";
export default {
  name: "userGroup",

  components: {
    usersTable
  },

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.resetPassForm.checkPass !== "") {
          this.$refs.resetPassForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.resetPassForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写邮箱'));
      } else {
        if (value !== '') { 
          var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if(!reg.test(value)){
            callback(new Error('请检查邮箱格式'));
          }
        }
        callback();
      }
    };
    var validateMobilePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'));
      } else {
        if (value !== '') { 
          var reg=/^1[3456789]\d{9}$/;
          if(!reg.test(value)){
            callback(new Error('请输入有效的手机号码'));
          }
        }
        callback();
      }
    };
    return {
      tLoading:false,
      radio: 1,
      filterText: "",
      UserList: [],
      dialogShow1: false,
      dialogShow2: false,
      dialogName: null,
      perssion: null,
      dealUserCount: 0,
      userForm: {
        password: "123456",
        isactive: true,
        trainingMenber:false

      },
      resetPassForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [{ validator:validateEmail, trigger: "blur" }],
        phone: [{ validator:validateMobilePhone, trigger: "blur" }]},
      buttonStates: {
        createLoading: false
      },
      multipleSelection: [],
    };
  },

  // computed: {
  //   ...mapState('admin',['UserList'])
  // },


  methods: {
    submitForm(resetPassForm) {
      // console.log(this.resetPassForm)
      //  console.log(this.multipleSelection)
      this.$refs[resetPassForm].validate(valid => {
        if (valid) {
          const id = this.multipleSelection.map(item => item.id).join(",");
          editUserDetail({ method: "put", userid: id ,password:this.resetPassForm.pass }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.dialogShow2 = false;
            }
          });
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    change() {
      this.$forceUpdate();
    },
    getAllUserlist() {
      this.tLoading = true
      getUserList().then(({ data }) => {
        this.UserList = [...data];
        this.dealUserCount = this.UserList.length;
        this.tLoading = false
      }).catch(()=>{
        this.tLoading = false
      })
      getUserPerfession().then(({ data }) => {
        this.perssion = data.auth.admin_management;
        //console.log(this.perssion)
      });
    },
    getNullDeptUser() {
      getUserList({ deptid: null }).then(({ data }) => {
        this.UserList = [...data];
      });
    },
    openDialog(Type) {
      if (Type === 1) {
        this.dialogName = "添加用户";
        this.dialogShow1 = true;
      }else if (Type === 2) {
        this.dialogShow2 = true;
      } else {
        this.$router.push({
          name: "user-import"
        });
      }
    },
    //批量删除用户
    delMulUsers() {
      this.$confirm("此操作将永久删除用户,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        deleteUser({ ids: ids, method: "delete" }).then(({ data }) => {
          // console.log(data.msg);
          if (data.status === 0) {
            this.getAllUserlist();
            this.$message.success(data.msg);
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    addUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if (this.userForm.sex === 0) {
            this.userForm = {
              ...this.userForm,
              sex: "男"
            };
          } else {
            this.userForm = {
              ...this.userForm,
              sex: "女"
            };
          }

          addUser(this.userForm).then(({ data }) => {
            if (data.status === 0) {
              this.createLoading = false;
              this.$message.success(data.msg);
              this.dialogShow1 = false;
              this.getAllUserlist();
            } else {
              this.createLoading = false;
              this.$message.error(data.msg);
              this.dialogShow1 = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.dialogShow = false;
      this.$refs["userForm"].resetFields();
      this.userForm = {
        password: "123456",
        isactive: true
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showSchool(){
      this.userForm.trainingMenber ==!this.userForm.trainingMenber;
    }
  },

  watch: {
    radio(val) {
      switch (val) {
        case 1:
          // this.$store.dispatch("admin/get_UserList");
          this.getAllUserlist();
          break;

        case 2:
          this.getNullDeptUser();
          break;
      }
    },
    filterText: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          //this.$store.dispatch("admin/get_UserList",newVal);
          getUserList({ username: newVal }).then(({ data }) => {
            this.UserList = [...data];
          });
        } else {
          this.getAllUserlist();
        }
      }
    }
  },

  created() {
    // this.$store.dispatch("admin/get_UserList");
    this.getAllUserlist();
  }
};
</script>

<style lang="scss" scoped src="./userGroup.scss">
</style>

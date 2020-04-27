<template>
  <div id="wellList" width="100%">
    <el-row class="row-bg">
      <el-col :span="2" class="col-bg">井类别:</el-col>
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
      <el-col :span="2" class="col-bg">井名:</el-col>
      <el-col :span="2">
        <el-input v-model="wellNumber"></el-input>
      </el-col>
      <el-col :span="2" class="col-bg">状态:</el-col>
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
      <el-table-column label="状态" width="130" align="center">
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
      <el-table-column prop="belongs" label="归属" width="230" align="center">
        <template slot-scope="scope">
          <div
            style="width:100%;height:100%;"
            v-if="!scope.row.cascader"
            @click="updateBelongs(scope.row)"
          >{{scope.row.belongs||'-'}}</div>
          <div v-else @click="well_id = scope.row.id">
            <el-cascader
              :options="depts"
              v-model="scope.row.belongs"
              type="text"
              :props="props"
              @change="handleChange"
            ></el-cascader>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="depth" label="泵深(米)" width="130" align="center"></el-table-column>
      <el-table-column prop label="油藏中深" width="130" align="center"></el-table-column>
      <el-table-column label="类型" width="130" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.well_type==0">{{scope.row.well_type|welltype}}</div>
          <div v-if="scope.row.well_type==1">{{scope.row.well_type|welltype}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="rod" label="光杆规范" width="130" align="center"></el-table-column>
       <el-table-column :key="18" label="操作" align="center" width="130px;">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改" placement="top">
            <router-link
              :to="{name:'alter-built',params:{id:scope.row.id,name:scope.row.name,belongs:scope.row.belongs},query:{type:scope.row.pro_type}}"
            >
              <el-button
                class="el-icon-edit"
                type="text"
                style="color:blue"
                v-if="$store.state.login.userInfo.auth.manage_well"
              ></el-button>
            </router-link>
          </el-tooltip>
           <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteWell(scope.row.id)"
                icon="el-icon-delete"
                style="color:red;margin-left:20px;"
                type="text"
                  v-if="$store.state.login.userInfo.auth.manage_well"
              />
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="套管规范" width="130" align="center"></el-table-column>
      <el-table-column prop="pipe" label="油管规范" width="130" align="center"></el-table-column>
      <el-table-column prop="machine_type" label="机型" width="130" align="center"></el-table-column>
      <el-table-column prop="machine" label="电机" width="130" align="center"></el-table-column>
      <el-table-column prop="crank" label="曲柄" width="130" align="center"></el-table-column>
      <el-table-column prop="box" label="配电箱" width="130" align="center"></el-table-column>
     
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
import { ApiGetWellList,ApiDeleteWellList } from "@/api/wellList";
import { putWellDetail } from "@/api/welldetail";
import { getDept } from "@/api/admin";
export default {
  data() {
    return {
      well_id: null,
      index: null,
      wellList: [],
      depts: [],
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
      pageSizeList: [10, 30, 50, 100],
      cutType: -1 // 分页类型
    };
  },
  computed: {
    props() {
      return {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        lazy: false,
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
  methods: {
    updateBelongs(row) {
      row.cascader = 1;
      this.wellList = [...this.wellList];
    },
    handleChange(val) {
      putWellDetail({ well_id: this.well_id, dept_id: val[3] }).then(res => {
        if (res.status === 200) {
          this.$message.success("修改成功");
          this.wellList.find(x => x.id === this.well_id).belongs = this.getname(
            val[3]
          );
          this.wellList.find(x => x.id === this.well_id).cascader = 0;
          this.wellList = [...this.wellList];
        }
      });
    },
    getname(val) {
      let name = "";
      this.depts.map(item => {
        item.children.map(ite => {
          ite.children.map(it => {
            it.children.map(i => {
              if (i.id === val) {
                name = `${item.name}/${ite.name}/${it.name}/${i.name}`;
              }
            });
          });
        });
      });
      return name;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.GetwellList();
    },
    // 分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.GetwellList(); // 正常查看
          break;
        case 1:
          this.searchWell(); // 筛选分页查看
          break;
      }
      //
    },
    GetwellList() {
      ApiGetWellList({ page: this.currentPage, pagenum: this.pageSize }).then(
        res => {
          this.wellList = res.data.msg.well_list;
          this.total = res.data.msg.total;
        }
      );
    },
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

    searchWell() {
      this.cutType = 1;
      let data = {
        page: this.currentPage,
        well_type: this.wellCategory,
        wellno: this.wellNumber,
        status: this.wellStatus
      };
      ApiGetWellList(data).then(res => {
        this.wellList = res.data.msg.well_list;
        this.total = res.data.msg.total;
      });
    },
    putWellBelongs(well_id, dept_id) {
      let data = {
        methods: put,
        well_id: well_id,
        dept_id: dept_id
      };
    },
     //删除
    deleteWell(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ApiDeleteWellList({ well_id: id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.GetwellList();
          }
        });
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
  },
  mounted() {
    this.getDeptList();
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
  }
  .el-col {
    width: auto;
  }
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 5px 2px 0 5px;
  }
  .well-status {
    padding-right: 5px;
  }
  .cell-wellstatus {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

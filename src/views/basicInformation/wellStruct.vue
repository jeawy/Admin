<template>
  <div id="wellInfo">
    <el-col :lg="24" :sm="24">
      <el-scrollbar style="height:100%">
        <el-card shadow="always" style="height:650px">
          <div style="font-weight: bold;font-size:16px">油井组织架构图</div>
          <div>
            <GraphChart
              @click-item="clickGraph"
              ref="well-graph"
              chart-id="well-graph"
              style="height:600px"
            />
          </div>
        </el-card>
      </el-scrollbar>
    </el-col>
  </div>
</template>
<script>
import GraphChart from "@/components/ECharts/GraphChart";
import { ApiGetDept } from "@/api/homeData";
export default {
  components: {
    GraphChart
  },
  data() {
    return {
      wellid:"",
      parentList: [],
      children1: [],
      children2: [],
      children3: [],
      children4: [],
      children5: [],
      noChildNode: [], //没有孩子的节点
      name: [], //所有节点名字
      level: [], //第几层
      status: [], //开关井状态
      nodeList: [],
      linkList: [], //关系图中存放link的数组
      idList:[],
      node1: "",
      node2: "",
      node3: "",
      node4: [],
      node5: [],
      node6: [],
      node7: []
    };
  },
  methods: {
    //节点背景色
    colorFunction(obj) {
      if (obj == 0) {
        return "#18a849"; //开井为绿色
      } else if (obj == 1) {
        return "#FF0000"; //关井为红色
      } else {
        return "#FFC125"; //其他情况均为黄色
      }
    },
    // 油井关联图
    getWellGraph() {
      ApiGetDept().then(({ data }) => {
        let j = 0;
        this.parentList = data.msg; //厂
        data.msg.forEach(item => {
          if (item.children !== "") {
            //判断第一层是否有孩子节点
            this.node1 = item.name;
          }
          this.idList.push(item.id)
          this.name.push(item.name);
          this.level.push(item.level);
          this.status.push(2);
          this.children1.push(item.children); //矿
        });
        this.children1.forEach(item => {
          this.children1 = item;
          item.forEach(key => {
            if (key.children !== "") {
              //判断第二层是否有孩子节点
              this.node2 = key.name;
            }
            this.idList.push(item.id)
            this.name.push(key.name);
            this.level.push(key.level);
            this.status.push(2);
            this.children2.push(key.children); //队
          });
        });
        this.children2.forEach(item => {
          this.children2 = item;
          item.forEach(key => {
            if (key.children !== "") {
              //判断第三层节点是否有孩子节点
              this.node3 = key.name;
            }
            this.idList.push(item.id)
            this.name.push(key.name);
            this.level.push(key.level);
            this.status.push(2);
            this.children3.push(key.children); //计量间
          });
        });
        this.children3.forEach(item => {
          this.children3 = item;
          item.forEach(key => {
            if (key.children !== "") {
              //判断第四层是否有孩子节点
              this.node4.push(key.name);
            }
            this.idList.push(item.id)
            this.name.push(key.name);
            this.level.push(key.level);
            this.status.push(2);
            this.children4.push(key.children); //井
          });
        });
        for (let i = 0; i < this.children4.length; i++) {
          this.children4[i].map(item => {
            this.noChildNode.push(item.well_name);
            this.idList.push(item.well_id)
            this.name.push(item.well_name);
            this.level.push(item.level);
            this.status.push(item.status);
            this.children5.push(item);
          });
        }
        this.children4[0].map(item => {
          this.node5.push(item.well_name);
        });
        this.children4[1].map(item => {
          this.node6.push(item.well_name);
        });
        this.children4[2].map(item => {
          this.node7.push(item.well_name);
        });
        for (j = 0; j < this.name.length; j++) {
          let size = 0;
          let length = 0;
          let arr = {};
          if (this.level[j] == 1) {
            //第一层
            size = 60;
            arr = {
              source: this.node1,
              target: this.node2,
              name: ""
            };
            this.linkList.push(arr);
          } else if (this.level[j] == 2) {
            size = 55;
            arr = {
              source: this.node2,
              target: this.node3,
              name: ""
            };
            this.linkList.push(arr);
          } else if (this.level[j] == 3) {
            size = 50;
          } else if (this.level[j] == 4) {
            size = 45;
            arr = {
              source: this.node3,
              target: this.node4[j - 3],
              name: ""
            };
            this.linkList.push(arr);
          } else if (this.level[j] == 5) {
            size = 40;
            if (j < 6 + this.node5.length) {
              arr = {
                source: this.node4[0],
                target: this.noChildNode[j - 6],
                name: ""
              };
              this.linkList.push(arr);
            } else if (j < 6 + this.node5.length + this.node6.length) {
              arr = {
                source: this.node4[1],
                target: this.noChildNode[j - 6],
                name: ""
              };
              this.linkList.push(arr);
            } else if (
              j <
              6 + this.node5.length + this.node6.length + this.node7.length
            ) {
              arr = {
                source: this.node4[2],
                target: this.noChildNode[j - 6],
                name: ""
              };
              this.linkList.push(arr);
            }
          }
          //标记所有节点
          let array1 = {
            //标记所有的节点
            name: this.name[j], //节点名字
            symbolSize: size,
            category: this.level[j],
            itemStyle: {
              normal: {
                color: this.colorFunction(this.status[j])
              }
            } //节点的背景色
          };
          this.nodeList.push(array1); //节点的坐标位置
        }
        var categories = [];
        for (var i = 0; i < 2; i++) {
          categories[i] = {
            name: "类目" + i
          };
        }
        let dept = {
          // 提示框的配置
          tooltip: {
            trigger: "item",
            formatter: function(para) {
              if (para.name != "x" || para.name != "y") {
                return para.name;
              } else {
                //其他的都正式显示，自己是什么就显示什么。
                return "";
              }
            }
          },
          series: [
            {
              type: "graph", // 类型:关系图
              layout: "force", //图的布局，类型为力导图
              symbolSize: 40, // 调整节点的大小
              roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              // edgeSymbol: ["circle", "arrow"],
              // edgeSymbolSize: [2, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              force: {
                repulsion: 5000,
                edgeLength: [10, 50]
              },
              draggable: false,
              lineStyle: {
                normal: {
                  width: 2,
                  color: "#4b565b"
                }
              },
              edgeLabel: {
                normal: {
                  show: true,
                  formatter: function(x) {
                    return x.data.name;
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {}
                }
              },
              // 数据
              data: this.nodeList,
              links: this.linkList,
              categories: categories
            }
          ]
        };
        this.$nextTick(() => {
          this.$refs["well-graph"].initChart(dept);
        });
      });
    },
    //点击油井关联图中的某一项
    clickGraph(params) {
      // console.log(params);
      if(params.data.category == 5){
        this.wellid = this.idList[params.dataIndex];
        this.$router.push({
          name: "well-detail",
          params: { id: this.wellid },
          query: { type: params.pro_type }
        });
      }
    },
  },
  created() {
    this.getWellGraph();
  }
};
</script>
<style lang="scss">
#wellInfo {
  font-size: 12px;
  background-color: #f4f5f5;
  height: calc(100vh - 84px);
  position: relative;
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
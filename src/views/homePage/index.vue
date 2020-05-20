<script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&amp;ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&amp;__ec_v__=20190126"></script>
<script>
import Chart from "@/components/ECharts/PieChart";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import BaiduMap from "@/components/ECharts/BaiduMap";
import GraphChart from "@/components/ECharts/GraphChart";
import {
  ApiGetHomedata,
  ApiGetBalance,
  ApiGetAlarm,
  ApiGetDept
} from "@/api/homeData";
import { ApiGetPower } from "@/api/realdata";
import dayjs from "dayjs";
export default {
  name: "HomePage",
  components: {
    Chart,
    BarChart,
    BaiduMap,
    LineChart,
    GraphChart
  },
  data() {
    return {
      days: 1,
      dynamic: 1,
      openCount: "",
      stopCount: "",
      openPercentage: 0,
      processedPer: 0,
      processedAlarm: 0,
      totalAlarm: 0,
      total: "",
      wellid: 0,
      wellId: [],
      alarmStatus: "",
      time: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              // const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, start]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "自定义",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      balanceList: [],
      click: false,
      length: 0,
      nodeList: [],
      lineList: [],
      connectLineUD: [],
      connectLineLR: [],
      parentList: [],
      children1: [],
      children2: [],
      children3: [],
      children4: [],
      children5: [],
      name: [], //所有节点名字
      level: [], //第几层
      status: [], //开关井状态
      hasChildNode: [], //拥有孩子的节点
      noChildNode: [], //没有孩子的节点
      childLength: [], //节点的孩子长度
      childLevel: [], //有孩子的节点的节点层数
      hasChildPoint: [], //有孩子节点对应的连接点
      allPoint: [], //所有节点对应的连接点
      dataList: [], //关系图中存放data的数组
      hasChildUD: [], //有孩子节点间的下连接线
      allLinkUD: [], //所有节点间的上连接线
      linkLR: [], //节点间的左右连接线
      linkList: [], //关系图中存放link的数组
      node1:"",
      node2:"",
      node3:"",
      node4:[],
      node5:[],
      node6:[],
      node7:[]
    };
  },
  methods: {
    //获取首页数据
    homeData(days) {
      let data = { days: days };
      ApiGetHomedata(data).then(res => {
        let chartData = res.data;
        let wellName = [];
        let output = [];
        let level = [];
        this.openCount = chartData.open_count;
        this.stopCount = chartData.stop_count;
        this.openPercentage = chartData.open_percentage;
        this.total = chartData.total;
        chartData.results.forEach(item => {
          wellName.push(item.well.name);
          output.push(item.output);
          level.push(item.level);
          this.wellId.push(item.well.id);
        });
        //开关井状态
        let chart1 = [
          {
            name: "开井",
            value: res.data.open_count
          },
          {
            name: "关井",
            value: res.data.stop_count
          }
        ];
        let colorList = ["#28a745","#c23531"]
        this.$nextTick(() => {
          this.$refs["well-status"].initChart("", chart1, colorList);
        });
        //产量柱状图
        let option1 = {
          title: {
            text: "产量TOP20",
            textStyle: {
              //---主标题内容样式
              color: "#000",
              fontSize: 16
              // height:"50px"
            },
            padding: [5, 18] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: "3%",
            top: "12%",
            height: 370,
            containLabel: true
          },
          legend: {
            data: []
          },
          xAxis: [
            {
              name: "井号",
              type: "category",
              triggerEvent: true,
              data: wellName,
              // nameGap :15,
              axisLabel: {
                //---坐标轴 标签
                fontSize: 14,
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 45,
                margin: 5 //---刻度标签与轴线之间的距离
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "吨",
              splitLine: { show: false },
              axisLabel: {
                fontSize: 14
              }
            }
          ],
          series: [
            {
              name: "产量",
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              barCategoryGap: "30%",
              barGap: "0%",
              data: output,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 10
                    }
                  }
                }
              }
            }
          ]
        };
        //液面高度柱状图
        let option2 = {
          title: {
            text: "液面高度",
            textStyle: {
              //---主标题内容样式
              color: "#000",
              fontSize: 16
              // height:"50px"
            },
            padding: [1, 18] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: []
          },
          grid: {
            left: "3%",
            top: "12%",
            bottom: "3%",
            height: 370,
            containLabel: true
          },
          xAxis: [
            {
              name: "井号",
              type: "category",
              data: wellName,
              axisLabel: {
                fontSize: 14,
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 45,
                margin: 5
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "米",
              splitLine: { show: false },
              axisLabel: {
                fontSize: 14
              }
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              barCategoryGap: "30%",
              barGap: "0%",
              data: level,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 10
                    }
                  }
                }
              }
            }
          ]
        };
        this.$refs["ouput"].initChart(option1);
        this.$refs["level"].initChart(option2);
      });
    },
    //根据时间搜索产量和液面高度柱状图
    chart_reload(days) {
      this.dynamic = days;
      switch (days) {
        case 1:
          this.homeData(1);
          break;
        case 7:
          this.homeData(7);
          break;
        case 30:
          this.homeData(30);
          break;
        case 90:
          this.homeData(90);
          break;
        case 180:
          this.homeData(180);
          break;
        case 365:
          this.homeData(365);
          break;
      }
    },
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
    //节点的x坐标
    xCoord(name, level, obj, key) {
      let length1 = this.parentList.length; //第一层的节点个数
      let length2 = this.children1.length; //第二层的节点个数
      let length3 = this.children2.length; //第三层的节点个数
      let length4 = this.children3.length; //第四层的节点个数
      let length5 = this.children5.length; //第五层的节点个数
      let x = [];
      let y = -300;
      let i = key;
      if (level !== 4) {
        for (i = 0; i < obj.length; i++) {
          y += 300;
          x.push(y);
        }
      } else {
        for (i = 0; i < length4 + length5; i++) {
          y += 300;
          x.push(y);
        }
      }
      if (level == 1) {
        return x[key];
      } else if (level == 2) {
        return x[key - length1];
      } else if (level == 3) {
        return x[key - length1 - length2];
      } else if (level == 4) {
        for (let i = key; i < this.childLevel.length; i++) {
          let index = this.hasChildNode.indexOf(this.hasChildNode[key]);
          if (
            name == this.hasChildNode[i] &&
            this.childLength[i - 1] > 1 &&
            index - length1 - length2 - length3 == 0
          ) {
            return x[key - length1 - length2 - length3];
          } else if (index - length1 - length2 - length3 == 1) {
            return x[
              key - length1 - length2 - length3 + this.childLength[i - 1] - 1
            ];
          } else {
            return x[
              key -
                length1 -
                length2 -
                length3 +
                this.childLength[i - 1] +
                this.childLength[i - 2] -
                2
            ];
          }
        }
      } else if (level == 5) {
        return x[key - length1 - length2 - length3 - length4];
      }
    },
    //各节点的x轴坐标函数
    xCoordNode(name, obj, index) {
      if (obj == 1) {
        return this.xCoord(name, obj, this.parentList, index);
      } else if (obj == 2) {
        return this.xCoord(name, obj, this.children1, index);
      } else if (obj == 3) {
        return this.xCoord(name, obj, this.children2, index);
      } else if (obj == 4) {
        return this.xCoord(name, obj, this.children3, index);
      } else if (obj == 5) {
        return this.xCoord(name, obj, this.children5, index);
      }
    },
    //各节点的y轴坐标函数
    yCoordNode(obj) {
      if (obj == 1) {
        return 0;
      } else if (obj == 2) {
        return 200;
      } else if (obj == 3) {
        return 400;
      } else if (obj == 4) {
        return 600;
      } else if (obj == 5) {
        return 800;
      }
    },
    //连接点名字
    lineName(sign, obj, key) {
      //sign标记是有孩子的节点还是所有节点   sign=1为有孩子节点,sign=2为所有节点
      let arr = [];
      let s = 0;
      let m = 10;
      for (let i = 0; i < obj.length; i++) {
        if (sign == 1) {
          s += 1;
          s = "" + s + "";
          arr.push(s);
          s = parseInt(s);
        } else {
          m += 1;
          m = "" + m + "";
          arr.push(m);
          m = parseInt(m);
        }
      }
      return arr[key];
    },
    //连接点的x抽
    xCoordPoint(name, obj, index) {
      if (obj == 1) {
        return this.xCoord(name, obj, this.parentList, index);
      } else if (obj == 2) {
        return this.xCoord(name, obj, this.children1, index);
      } else if (obj == 3) {
        return this.xCoord(name, obj, this.children2, index);
      } else if (obj == 4) {
        return this.xCoord(name, obj, this.children3, index);
      } else if (obj == 5) {
        return this.xCoord(name, obj, this.children5, index);
      }
    },
    //连接点的y抽坐标函数
    yCoordPoint(sign, obj) {
      if (sign == 2) {
        // 所有节点上方对应连接点的y轴坐标
        if (obj == 1) {
          return 100;
        } else if (obj == 2) {
          return 100;
        } else if (obj == 3) {
          return 300;
        } else if (obj == 4) {
          return 500;
        } else if (obj == 5) {
          return 700;
        }
      } else {
        //有孩子节点下方对应连接点的y轴坐标
        if (obj == 1) {
          return 100;
        } else if (obj == 2) {
          return 300;
        } else if (obj == 3) {
          return 500;
        } else if (obj == 4) {
          return 700;
        }
      }
    },
    //左右连接线的源函数
    sourceLR(obj, key) {
      let length1 = this.parentList.length; //第一层的节点个数
      let length2 = this.children1.length; //第二层的节点个数
      let length3 = this.children2.length; //第三层的节点个数
      let length4 = this.children3.length; //第四层的节点个数
      let length5 = this.children5.length; //第五层的节点个数
      if (obj == 1) {
        return "";
      } else if (obj == 2) {
        if (length2 == 1) {
          //第一层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key].name;
        }
      } else if (obj == 3) {
        if (length3 == 1) {
          //第二层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key].name;
        }
      } else if (obj == 4) {
        if (length4 == 1 || key == this.hasChildNode.length - 1) {
          //第三层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key].name;
        }
      } else if (obj == 5) {
        if (
          length5 == 1 ||
          key == this.hasChildNode.length + this.childLength[3] - 1 ||
          key ==
            this.hasChildNode.length +
              this.childLength[3] +
              this.childLength[4] -
              1
        ) {
          //第四层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key].name;
        }
      }
    },
    //左右连接线的目标函数
    targetLR(obj, key) {
      let length1 = this.parentList.length; //第一层的节点个数
      let length2 = this.children1.length; //第二层的节点个数
      let length3 = this.children2.length; //第三层的节点个数
      let length4 = this.children3.length; //第四层的节点个数
      let length5 = this.children5.length; //第五层的节点个数
      if (obj == 1) {
        return "";
      } else if (obj == 2) {
        if (length2 == 1) {
          //第一层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key + 1].name;
        }
      } else if (obj == 3) {
        if (length3 == 1) {
          //第二层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key + 1].name;
        }
      } else if (obj == 4) {
        if (length4 == 1 || key == this.hasChildNode.lenth - 1) {
          //第三层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key + 1].name;
        }
      } else if (obj == 5) {
        if (
          length5 == 1 ||
          key == this.name.length - 1 ||
          key == this.hasChildNode.length + this.childLength[3] - 1 ||
          key ==
            this.hasChildNode.length +
              this.childLength[3] +
              this.childLength[4] -
              1
        ) {
          //第四层下面横向连接线源
          return "";
        } else {
          return this.allPoint[key + 1].name;
        }
      }
    },
    //上下连接线的源函数
    sourceUD(sign, level, key) {
      //sign标记是有孩子的节点还是所有节点   sign=1为有孩子节点,sign=2为所有节点
      if (sign == 1) {
        //有孩子节点的下连接点的源
        return this.hasChildNode[key];
      } else {
        //所有节点的上连接线的源
        if (level == 1) {
          return "";
        } else {
          return this.allPoint[key].name;
        }
      }
    },
    //上下连接线的目标函数
    targetUD(sign, level, key) {
      if (sign == 1) {
        //有孩子节点的下连接线目标
        return this.hasChildPoint[key].name;
      } else {
        //所有节点的上连接线目标
        if (level == 1) {
          return "";
        } else {
          return this.name[key];
        }
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
            this.node1 = item.name
            this.hasChildNode.push(item.name);
            this.childLength.push(item.children.length); //第一层的孩子数据长度
            this.childLevel.push(item.level);
          }
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
              this.node2 = key.name
              this.hasChildNode.push(key.name);
              this.childLength.push(key.children.length); //第二层的孩子数据长度
              this.childLevel.push(key.level);
            }
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
              this.node3 = key.name
              this.hasChildNode.push(key.name);
              this.childLength.push(key.children.length); //第三层的孩子数据长度
              this.childLevel.push(key.level);
            }
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
              this.node4.push(key.name)
              this.hasChildNode.push(key.name);
              this.childLength.push(key.children.length); //第四层的孩子数据长度
              this.childLevel.push(key.level);
            }
            this.name.push(key.name);
            this.level.push(key.level);
            this.status.push(2);
            this.children4.push(key.children); //井
          });
        });
        for (let i = 0; i < this.children4.length; i++) {
          this.children4[i].map(item => {
            this.noChildNode.push(item.well_name);
            this.name.push(item.well_name);
            this.level.push(item.level);
            this.status.push(item.status);
            this.children5.push(item);
          });
        }
        this.children4[0].map(item =>{
          this.node5.push(item.well_name)
        })
        this.children4[1].map(item =>{
          this.node6.push(item.well_name)
        })
        this.children4[2].map(item =>{
          this.node7.push(item.well_name)
        })
        console.log(this.node3)
        console.log(this.node4)
        for (j = 0; j < this.name.length; j++) {
          let size = 0
          let length = 0
          let arr = {}
          if(this.level[j] == 1){  //第一层
            size = 40
            arr = {
              source:this.node1,
              target:this.node2,
              name:""
            }
            this.linkList.push(arr)
          }else if(this.level[j] == 2){
            size = 35
            arr = {
              source:this.node2,
              target:this.node3,
              name:""
            }
            this.linkList.push(arr)
          }else if(this.level[j] == 3){
            size = 30
          }else if(this.level[j] == 4){
            size = 25
            arr = {
              source:this.node3,
              target:this.node4[j - 3],
              name:""
            }
            this.linkList.push(arr)
          }else if(this.level[j] == 5){
            size = 20
            if(j < 6 + this.node5.length){
              arr = {
                source:this.node4[0],
                target:this.noChildNode[j - 6],
                name:""
              }
              this.linkList.push(arr)
            }else if(j < 6 + this.node5.length + this.node6.length){
              arr = {
                source:this.node4[1],
                target:this.noChildNode[j - 6 ],
                name:""
              }
              this.linkList.push(arr)
            }else if(j < 6 + this.node5.length + this.node6.length + this.node7.length){
              arr = {
                source:this.node4[2],
                target:this.noChildNode[j - 6],
                name:""
              }
              this.linkList.push(arr)
            }
          }
          //标记所有节点
          let array1 = {
            //标记所有的节点
            name: this.name[j], //节点名字
            symbolSize:size,
            category:this.level[j],
            itemStyle: {
              normal: {
                color: this.colorFunction(this.status[j])
              }
            } //节点的背景色
          };
          let array2 = {
            //标记所有节点上方的连接点
            name: "",
            x: this.xCoordPoint(this.name[j], this.level[j], j),
            y: this.yCoordPoint(2, this.level[j]),
            symbolSize: 0
          };
          this.nodeList.push(array1); //节点的坐标位置
          this.allPoint.push(array2); //除了第一层节点，其它各层节点上方对应一个连接点
        }
        for (let j = 0; j < this.name.length; j++) {
          let array3 = {
            //标记节点间的左右连接线
            source: this.sourceLR(this.level[j], j),
            target: this.targetLR(this.level[j], j),
            symbol: "none"
          };
          let array4 = {
            //标记所有节点的上连接线
            source: this.sourceUD(2, this.level[j], j),
            target: this.targetUD(2, this.level[j], j)
          };
          this.linkLR.push(array3); //节点间的左右连接线
          this.allLinkUD.push(array4); //所有节点的上连接线
        }
        for (let i = 0; i < this.hasChildNode.length; i++) {
          //标记有孩子节点
          let array5 = {
            //标记有孩子节点下方的连接点
            name: this.lineName(1, this.hasChildNode, i),
            x: this.xCoordPoint(this.hasChildNode[i], this.childLevel[i], i),
            y: this.yCoordPoint(1, this.childLevel[i]),
            symbolSize: 0
          };
          this.hasChildPoint.push(array5); //标记有孩子的节点下方对应的连接点
        }
        for (let i = 0; i < this.hasChildNode.length; i++) {
          let array6 = {
            //标记有孩子节点的下连接线
            source: this.sourceUD(1, this.childLevel[i], i),
            target: this.targetUD(1, this.childLevel[i], i)
          };
          this.hasChildUD.push(array6); //标记有孩子的节点的下连接线
        }
        this.dataList = this.nodeList.concat(this.hasChildPoint);
        this.dataList = this.dataList.concat(this.allPoint);
        // this.linkList = this.linkLR.concat(this.hasChildUD);
        // this.linkList = this.linkList.concat(this.allLinkUD);

        var categories = [];
        for (var i = 0; i < 2; i++) {
          categories[i] = {
            name: "类目" + i
          };
        }
        let dept = {
          // 图的标题
          title: {
            text: "ECharts 关系图"
          },
          // 提示框的配置
          tooltip: {
            trigger: 'item',
            formatter: function(para) {
              if (para.name != 'x' || para.name != 'y') {
                return para.name;
              } else {
                  //其他的都正式显示，自己是什么就显示什么。
                return '';
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
              // links: this.linkList,
              categories: categories
            }
          ]
        };
        this.$nextTick(() => {
          this.$refs["well-graph"].initChart(dept);
        });
      });
    },
    //根据时间搜索平衡率和有功曲线图
    getChart() {
      var date1 = new Date();
      var list = this.getDateRange(date1, 7, true);
      let date = "";
      if (this.click == true) {
        date = this.time[0] + "-" + this.time[1];
      } else {
        date = list[0] + "-" + list[1];
      }
      let data = {
        daterange: date
      };
      ApiGetBalance(data).then(({ data }) => {
        let dataList = [];
        let wellName = [];
        let series = [];
        let time_list = [];
        let balance_list = [];
        let name = "";
        data.msg.forEach(item => {
          dataList.push(item.list);
          wellName.push(item.well_name);
        });
        if (dataList == "") {
          this.length = dataList.length + 1;
        } else {
          this.length = dataList.length;
        }
        for (let i = 0; i < this.length; i++) {
          if (dataList == "") {
            time_list = [];
            balance_list = [];
            name = "";
          } else {
            this.balanceList = dataList[i];
            time_list = dataList[0].map(item => {
              return item.date;
            });
            balance_list = this.balanceList.map(item => {
              return item.balance;
            });
            name = wellName[i];
          }
          time_list.reverse();
          balance_list.reverse();
          let item = {
            name: name,
            smooth: true, //光滑
            data: balance_list,
            type: "line"
          };
          series.push(item);
          //平衡率曲线图
          let option3 = {
            title: {
              text: "平衡率"
            },
            grid: {
              left: "8%"
            },
            // legend: {//图例
            //   data: wellName,// 名字
            //   tooltip: {
            //     show: true,
            //   },
            // },
            tooltip: {
              trigger: "axis",
              position: function(point, params, dom, rect, size) {
                //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize
                var x = point[0]; //
                var y = point[1];
                var viewWidth = size.viewSize[0];
                var viewHeight = size.viewSize[1];
                var boxWidth = size.contentSize[0];
                var boxHeight = size.contentSize[1];
                var posX = 0; //x坐标位置
                var posY = 0; //y坐标位置
                if (x < boxWidth) {
                  //左边放不开
                  posX = x + 10;
                } else {
                  //左边放的下
                  posX = x - boxWidth;
                }
                if (y < boxHeight) {
                  //上边放不开
                  posY = 5;
                } else {
                  //上边放得下
                  posY = y - boxHeight;
                }
                return [posX, posY];
              }
            },
            xAxis: {
              type: "category",
              name: "时间",
              data: time_list
            },
            yAxis: {
              type: "value",
              name: "米",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          this.$refs["balance-rate"].initChart(option3);
        }
      });
      let data1 = {};
      if (this.click == true) {
        data1 = {
          active: "",
          daterange: this.time[0] + "-" + this.time[1]
        };
      } else {
        data1 = { active: "" };
      }
      ApiGetPower(data1).then(({ data }) => {
        //时间戳转换函数
        function dateFormat(date) {
          if (date) {
            date *= 1000;
            return dayjs(date).format("YYYY/MM/DD HH:mm");
          } else {
            return "";
          }
        }
        let dataList = data.msg;
        let wellName = [];
        let series = [];
        let active_list = [];
        let dates_list = [];
        if (dataList == "") {
          this.length = dataList.length + 1;
        } else {
          this.length = dataList.length;
        }
        for (let i = 0; i < this.length; i++) {
          if (dataList == "") {
            active_list = [];
            wellName = [];
            dates_list = [];
          } else {
            for (let j = 0; j < dataList[i].length; j++) {
              if (dataList !== "") {
                active_list.push(dataList[i][j].active);
                wellName.push(dataList[i][j].well_name);
                dates_list.push(dateFormat(dataList[i][j].time));
              }
            }
          }
          active_list.reverse();
          dates_list.reverse();
          let item = {
            name: wellName[0],
            smooth: true, //光滑
            data: active_list,
            type: "line"
          };
          series.push(item);
          active_list = [];
          wellName = [];
          let option4 = {
            title: {
              text: "有功"
            },
            grid: {
              left: "8%"
            },
            tooltip: {
              trigger: "axis"
            },
            xAxis: {
              type: "category",
              name: "时间",
              data: dates_list
            },
            yAxis: {
              type: "value",
              name: "千瓦",
              axisLabel: {
                fontSize: 14
              }
            },
            series: series
          };
          dates_list = [];
          this.$refs["power"].initChart(option4);
        }
      });
    },
    //判断曲线图是否是根据时间搜索
    search() {
      this.click = true;
      this.getChart();
    },
    //获取首页告警
    getAlarm() {
      ApiGetAlarm().then(({ data }) => {
        let alarmList = [];
        alarmList = data.msg;
        this.processedAlarm =
          alarmList[1].num +
          alarmList[2].num +
          alarmList[3].num +
          alarmList[4].num;
        this.totalAlarm =
          alarmList[0].num +
          alarmList[1].num +
          alarmList[2].num +
          alarmList[3].num +
          alarmList[4].num;
        this.processedPer = Number(
          (this.processedAlarm / this.totalAlarm).toFixed(2)
        );
        //告警汇总
        let chart2 = [
          {
            name: "新增",
            value: alarmList[0].num
          },
          {
            name: "忽略",
            value: alarmList[1].num
          },
          {
            name: "关闭",
            value: alarmList[2].num
          },
          {
            name: "误报",
            value: alarmList[3].num
          },
          {
            name: "已处置",
            value: alarmList[4].num
          },
        ];
        let colorList = ["#c23531","#d0c5c5","#2f4554","#ffcd39","#28a745"]
        this.$nextTick(() => {
          this.$refs["alarm-summary"].initChart("", chart2, colorList);
        });
      });
    },
    //点击柱状图
    handleClickChart(params) {
      this.wellid = this.wellId[params.dataIndex];
      this.$router.push({
        name: "well-detail",
        params: { id: this.wellid },
        query: { type: params.pro_type }
      });
    },
    //点击饼图
    ClickChart(params) {
      this.alarmStatus = params.name;
      this.$router.push({
        name: "deviceAlarm",
        params: { name: this.alarmStatus },
        query: { type: params.pro_type }
      });
    },
    //点击油井关联图中的某一项
    clickGraph(params) {
      console.log(params);
    },
    //获取近一周时间的函数
    getDateRange(dateNow, intervalDays, bolPastTime) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let list = [];
      let lastDay;
      if (bolPastTime == true) {
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
        list.push(this.formateDate(lastDay));
        list.push(this.formateDate(dateNow));
      } else {
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
        list.push(this.formateDate(dateNow));
        list.push(this.formateDate(lastDay));
      }
      return list;
    },
    //格式化时间
    formateDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return year + "/" + month + "/" + day + "";
    }
  },
  created() {
    this.homeData(1);
    this.getWellGraph();
    this.getChart();
    this.getAlarm();
    var date1 = new Date();
    var list = this.getDateRange(date1, 7, true);
    this.time[0] = list[0];
    this.time[1] = list[1];
  }
};
</script>
<template>
  <div id="home-page" ref="drawer-parent">
    <el-row class="home-header-card" :gutter="15">
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item1" shadow="always">
          <router-link :to="{name:'realdata'}">
            <div class="text-light">实时数据</div>
            <img class="realDataImage" src="@/assets/realdata.png" alt />
          </router-link>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item2" shadow="always">
          <router-link :to="{name:'comprehensiveQuery'}">
            <div class="text-light">综合查询</div>
            <img class="queryImage" src="@/assets/query.png" alt />
          </router-link>
        </el-card>
      </el-col>

      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item3" shadow="always">
          <router-link :to="{name:'deviceAlarm'}">
            <div class="text-light">告警查询</div>
            <img class="queryImage" src="@/assets/warning.png" alt />
          </router-link>
        </el-card>
      </el-col>

      <el-col :sm="12" :lg="6">
        <el-card class="home-header-item4" shadow="always">
          <router-link :to="{name:'deviceStatus'}">
            <div class="text-light">设备状态</div>
            <img class="statisticsImage" src="@/assets/statistics.png" alt />
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="home-header" :gutter="15">
      <el-col :lg="12">
        <el-row class="left" :gutter="15">
          <el-col :lg="24" :sm="24">
            <el-card shadow="always">
              <div class="btn-group" data-toggle="buttons" aria-label="First group">
                <div class="btn" :class="{colorChange:1 == dynamic}" @click="chart_reload(1)">
                  <input type="radio" name="options" id="option1" />今天
                </div>
                <div class="btn" :class="{colorChange:7 == dynamic}" @click="chart_reload(7)">
                  <input type="radio" name="options" id="option2" />近一周
                </div>
                <div class="btn" :class="{colorChange:30 == dynamic}" @click="chart_reload(30)">
                  <input type="radio" name="options" id="option3" />近一月
                </div>
                <div class="btn" :class="{colorChange:90 == dynamic}" @click="chart_reload(90)">
                  <input type="radio" name="options" id="option4" />近三月
                </div>
                <div class="btn" :class="{colorChange:180 == dynamic}" @click="chart_reload(180)">
                  <input type="radio" name="options" id="option6" />近半年
                </div>
                <div class="btn" :class="{colorChange:365 == dynamic}" @click="chart_reload(365)">
                  <input type="radio" name="options" id="option5" />近一年
                </div>
              </div>
              <div>
                <BarChart
                  @click-item="handleClickChart"
                  ref="ouput"
                  chart-id="output"
                  style="height:420px"
                />
              </div>
              <div style="margin-top:20px">
                <BarChart
                  @click-item="handleClickChart"
                  ref="level"
                  chart-id="level"
                  style="height:420px"
                />
              </div>
            </el-card>
            <el-col style="height:15px"></el-col>
            <!-- <el-card shadow="always" style="height:500px">
              <div style="font-weight: bold;font-size:15px">
                油井架构图
              </div>
              <div>
                <GraphChart  @click-item="clickGraph" ref="well-graph" chart-id="well-graph" style="height:420px;width:500px"/>
              </div>
            </el-card>-->
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12">
        <el-row class="right" :gutter="15">
          <el-col :lg="24">
            <el-row :gutter="15">
              <el-col :lg="12">
                <el-row class="left-item">
                  <el-col :lg="24">
                    <el-card shadow="always">
                      <chart ref="well-status" chart-id="well-status" />
                      <div
                        style="color: #6c757d;font-size: 15px;"
                      >开井: {{this.openCount}} 关井: {{this.stopCount}} 总计: {{this.stopCount+this.openCount}}</div>
                      <el-progress
                        style="margin-top:10px"
                        color="#28a745"
                        :stroke-width="10"
                        :percentage="openPercentage"
                      ></el-progress>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:255px">
                      <div>
                        <div style="color: #6c757d;font-size: 15px;">告警</div>
                        <strong
                          style="color:black;font-size:15px"
                        >已处理: {{this.processedAlarm}} 总计: {{this.totalAlarm}}</strong>
                        <el-progress
                          style="margin-top:10px;"
                          color="#28a745"
                          :stroke-width="10"
                          :percentage="processedPer"
                        ></el-progress>
                      </div>
                      <div style="margin-top:10px">
                        <chart
                          @click-item="ClickChart"
                          ref="alarm-summary"
                          chart-id="alarm-summary"
                        />
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :lg="12">
                <el-row class="right-item">
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <div style="display:flex">
                        <img
                          style="width: 76px;height: 74px;margin-top:25px"
                          src="@/assets/output.jpg"
                          alt
                        />
                        <div style="margin-left:20px;margin-top:25px">
                          <div class="prompt-text">总产油量：(吨)</div>
                          <div style="font-size:25px;margin-top:8px;">{{this.total}}</div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <router-link :to="{name:'power'}">
                        <div style="display:flex">
                          <img
                            style="width: 80px;height: 82px;margin-top:25px"
                            src="@/assets/work.jpg"
                            alt
                          />
                          <div class="prompt-text" style="margin-left:20px;margin-top:50px">能耗管理</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col>
                  <el-col style="height:15px"></el-col>
                  <el-col :lg="24">
                    <el-card shadow="always" style="height:160px">
                      <router-link :to="{name:'wellList'}">
                        <div style="display:flex">
                          <img
                            style="width: 82px;height: 78px;margin-top:25px"
                            src="@/assets/info.jpg"
                            alt
                          />
                          <div class="prompt-text" style="margin-left:20px;margin-top:50px">基础信息</div>
                        </div>
                      </router-link>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :lg="24" style="height:15px" />
          <el-col :lg="24">
            <el-card shadow="always">
              <el-row>
                <el-col :sm="10" :lg="10" style="margin-top:5px">
                  <span style="font-size:15px">时间：</span>
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    style="width:200px"
                    :picker-options="pickerOptions"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    size="mini"
                    value-format="yyyy/MM/dd"
                  ></el-date-picker>
                </el-col>
                <el-col :sm="4" :lg="4">
                  <el-button
                    @click="search()"
                    icon="el-icon-search"
                    style="height:27.99px;margin-top:5px"
                    type="primary"
                  />
                </el-col>
              </el-row>
              <LineChart
                ref="balance-rate"
                chart-id="balance-rate"
                style="height: 350px;margin-top:20px"
              />
              <LineChart ref="power" chart-id="power" style="height: 350px" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row calss="home-header">
      <el-scrollbar style="height:100%">
        <el-card shadow="always" style="height:700px;">
          <div style="font-weight: bold;font-size:15px">油井架构图</div>
          <div>
            <GraphChart
              @click-item="clickGraph"
              ref="well-graph"
              chart-id="well-graph"
              style="height:700px;margin-left:-250px"
            />
          </div>
        </el-card>
      </el-scrollbar>
    </el-row>
  </div>
</template>
<style lang="scss">
#home-page {
  font-size: 12px;
  background-color: #f4f5f5;
  /* height: calc(100vh - 84px); */
  position: relative;
  @mixin scrollStyle {
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 6px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0px;
      box-shadow: inset 0 0 0 #fff;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 0 #fff;
      border-radius: 0;
      background: #fff;
    }
  }
  $border: 1px solid #dcdfe6;
  $linkColor: #2d8cf0;
  .el-card__body {
    @include scrollStyle;
  }
  .home-header {
    margin-bottom: 15px;
    .left {
      .el-card {
        height: 950px;
      }
      .btn-group {
        display: flex;
        font-size: 15px;
        margin-bottom: 15px;
        .btn {
          border: 1px solid #212529;
          padding: 8px 15px;
          height: 35px;
          margin-left: 8px;
        }
        .colorChange {
          background: #262d37;
          color: #fff;
        }
      }
    }
    .middle {
      .el-card {
        height: 615px;
      }
    }
    .right {
      height: 70%;
      .prompt-text {
        display: flex;
        color: #6c757d;
        font-size: 20px;
      }
      .left-item {
        .el-card {
          height: 240px;
        }
      }
      .right-item {
        .el-card {
          height: 140px;
        }
      }
    }
  }
  .home-header-card {
    margin-bottom: 15px;
    .el-card {
      height: 140px;
    }
    .home-header-item1 {
      background: #63c2de;
    }
    .home-header-item2 {
      background: #20a8d8;
    }
    .home-header-item3 {
      background: #ffc107;
    }
    .home-header-item4 {
      background: #f86c6b;
    }
    .realDataImage {
      width: 290px;
      height: 60px;
      margin-top: 20px;
    }
    .queryImage {
      width: 290px;
      height: 50px;
      margin-top: 30px;
    }
    .warnImage {
      width: 300px;
      height: 60px;
      margin-top: 28px;
    }
    .statisticsImage {
      width: 290px;
      height: 60px;
      margin-top: 28px;
    }
    .text-light {
      color: #f8f9fa;
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
    }
  }
  .card-header {
    font-size: 14px;
    font-weight: 600;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

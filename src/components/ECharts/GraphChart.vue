<template>
  <div :id="chartId" :style="{height:height,width:width}" />
</template>
<script>
import echarts from "echarts";
import resize from "./mixins/resize";
//具体的绘制流程图的方法
let DefaultOption = {
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
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    textStyle: {
        color: '#000'
    },
    series: [{
        type: 'graph',
        tooltip: {
            backgroundColor: 'skyblue',
            //formatter: "{b} <br/>{a} : {c} h "
        },
        layout: 'none',
        symbolSize: 70,
        roam: false,
        label: {
            normal: {
                show: true,
                position: 'inside',
                //offset: [0,-60],//居上 20
                textStyle: {
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 'BOLD',
                },
            }
        },
        edgeLabel: {
            normal: {
                textStyle: {
                    fontSize: 18
                }
            }
        },
        //注意，所有节点的位置都是根据自己设置的x, y坐标来设置的
        data: [   // 首先是节点，其次是连接线(竖线)
            // 零层节点
            {
                name: 'root',  //节点名字
                x: 300,
                y: 0,     //x,y为节点位置
                symbolSize: [80, 40],  //节点大小
                symbol : 'Rect',     //节点形状
                itemStyle: {
                    normal: {
                        color:'#FFC125',
                    }
                }               //节点的背景色
            },
            // 一层
            {
                name: 'leaf11',
                x: 0,
                y: 200,
                symbolSize: [80, 40],
                symbol : 'Rect',
                itemStyle: {
                    normal: {
                        color:'#FFC125',
                    }
                }
            },
            {
                name: 'leaf12',
                x: 150,
                y: 200,
                symbolSize:[80, 40],
                symbol : 'Rect',
                itemStyle: {
                    normal: {
                        color:'#FFC125',
                    }
                }
            },
            {
                name: 'leaf13',
                x: 300,
                y: 200,
                symbolSize: [80, 40],
                symbol : 'Rect',
                itemStyle: {
                    normal: {
                        color:'#FFC125',
                    }
                }
            },
            {
                name: 'leaf14',
                x: 600,
                y: 200,
                symbolSize: [80, 40],
                symbol : 'Rect',
                itemStyle: {
                    normal: {
                        color:'#FFC125',
                    }
                }
            },
            // 一层线条(竖线)
            {
                name: '1',
                x:0,
                y: 100,
                symbolSize: 0,
            },
            {
                name: '2',
                x:150,
                y: 100,
                symbolSize: 0,
            },
            {
                name: '3',
                x:300,
                y: 100,
                symbolSize: 0,
            },
            {
                name: '4',
                x: 300,
                y: 100,
                symbolSize: 0,
            },
            {
                name: '5',
                x: 600,
                y: 100,
                symbolSize: 0,
            },
        ],
        // links: [],
        //这是点与点之间的连接关系,首先是竖线，其次是横线
        links: [
            // 零层
            {
                source: 'root',
                target: '3'
            },
            // 一层
            {
                source: '1',
                target: 'leaf11',
            },
            {
                source: '2',
                target: 'leaf12',
            },
            {
                source: '4',
                target: 'leaf13',
            },
            {
                source: '5',
                target: 'leaf14',
            },
            // 一层
            {
                source: '1',
                target: '2',
                symbol: 'none',
            },
            {
                source: '2',
                target: '3',
                symbol: 'none',
            },
            {
                source: '3',
                target: '4',
                symbol: 'none',
            },
            {
                source: '4',
                target: '5',
                symbol: 'none',
            }
        ],
        //线条的颜色
        lineStyle: {
            normal: {
                opacity: 0.9,
                color: '#53B5EA',
                type: 'solid',
                width: 1
            }
        }
    }]
};
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    chartId: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "480px"
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartId));
    this.chart.on("click", (params)=> {
      this.$emit('click-item',params)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 父组件调用,开启加载动画
    openLoading() {
      this.chart.showLoading()
    },
    /**
     * 父组件直接调用该方法即可渲染，但是父组件必须在其 mounted() 钩子中调用
     *
     * @param {Object} customOption 参考上面DefaultOption里面配置
     *
     */
    initChart(customOption = {}) {
      let option = Object.assign({}, DefaultOption, customOption);
      this.chart.setOption(option,true);
      this.chart.hideLoading()
    }
  }
};
</script>
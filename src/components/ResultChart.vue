<template>
  <div>
    <el-row>
      <div id="chart1" style="width: 800px;height: 300px"></div>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button type="primary">图像导出</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ResultChart',
  data() {
    return {
      temp: '',
    };
  },
  methods: {
    initializeChart() {
      const chart1 = echarts.init(document.getElementById('chart1'));
      const initializeOption = {
        xAxis: {
          type: 'category',
          data: ['类比1', '类比2', '类比3', '类比4', '类比5', '类比6', '类比7'],
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
        }],
      };
      chart1.setOption(initializeOption);
    },
  },
  mounted() {
    this.initializeChart();
  },
};
</script>

<style scoped>

</style>

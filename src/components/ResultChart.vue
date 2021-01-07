<template>
  <div>
    <el-row>
      <div id="chart1" style="width: 680px;height: 300px"></div>
    </el-row>
    <el-row>
      <el-col :span="2">
        <el-button type="primary" v-on:click="exportImage">图像导出</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { saveAs } from 'file-saver';

function base64ToBlob(code) {
  const parts = code.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export default {
  name: 'ResultChart',
  data() {
    return {
      temp: '',
      currentChart: undefined,
    };
  },
  methods: {
    initializeChart() {
      const chart1 = echarts.init(document.getElementById('chart1'));
      this.currentChart = chart1;
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
    exportImage() {
      if (!this.currentChart) {
        return;
      }
      const content = this.currentChart.getDataURL();
      const blob = base64ToBlob(content);
      saveAs(blob, 'chart.png');
    },
  },
  mounted() {
    this.initializeChart();
  },
};
</script>

<style scoped>

</style>

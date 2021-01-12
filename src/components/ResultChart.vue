<template>
  <div>
    <el-row>
      <div id="chart1" style="width: 680px;height: 300px"></div>
    </el-row>
    <el-row>
      <el-form>
        <el-form-item>
          <el-button v-on:click="exportImage">导出图像</el-button>
        </el-form-item>
        <el-form-item label="显示方式：">
          <el-select placeholder="请选择" v-model="currentDisplayMethod">
            <el-option
              v-for="item in displayMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
  data() {
    return {
      temp: '',
      currentChart: undefined,
      graphData: [],
      displayMethods: [
        {
          label: '折线图',
          value: 'line',
        },
        {
          label: '柱状图',
          value: 'bar',
        },
        {
          label: '散点图',
          value: 'scatter',
        },
      ],
      currentDisplayMethod: 'line',
    };
  },
  methods: {
    refreshChart() {
      console.log('called refreshChart');
      const xData = [];
      const yData = [];

      this.$data.graphData.forEach((elem) => {
        xData.push(elem.xName);
        yData.push(elem.yValue);
      });

      const initializeOption = {
        xAxis: {
          type: 'category',
          data: xData,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          data: yData,
          type: this.$data.currentDisplayMethod,
        }],
      };
      this.currentChart.setOption(initializeOption);
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
  watch: {
    currentDisplayMethod() {
      this.refreshChart();
    },
  },
  mounted() {
    this.currentChart = echarts.init(document.getElementById('chart1'));
  },
};
</script>

<style scoped>

</style>

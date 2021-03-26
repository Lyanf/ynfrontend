<template>
  <div style="margin-left: 20px" v-show="graphData.length !== 0 || graphData.yData !== undefined">
    <el-row>
      <div :id="uniqueId" style="width: 680px;height: 300px"></div>
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
      currentChart: undefined,
      graphData: [],
      params1st: {
        xTag: 'xName',
        yTag: 'yValue',
        xName: '',
        yName: '',
      },
      params2nd: {
        xTag: '',
        yTag1st: '',
        yTag2nd: '',
        xName: '',
        yName: '',
        yName1st: '',
        yName2nd: '',
      },
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
    refreshChartDirty() {
      const param = this.$data.params1st;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById(this.uniqueId));
      }

      const xD = this.graphData.xData;
      const yData = this.graphData.yData[0].data;

      const initializeOption = {
        xAxis: {
          type: 'category',
          name: param.xName,
          data: xD,
        },
        yAxis: {
          type: 'value',
          name: param.yName,
        },
        series: [{
          data: yData,
          name: param.yName,
          type: this.$data.currentDisplayMethod,
        }],
        legend: {
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: 'horizontal',
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
        },
      };
      this.currentChart.setOption(initializeOption, true);
    },
    refreshChart() {
      const param = this.$data.params1st;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById(this.uniqueId));
      }
      const xData = [];
      const yData = [];

      this.graphData.forEach((elem) => {
        if (elem.year) {
          xData.push(elem.year);
        } else if (elem.time) {
          xData.push(elem.time);
        }
        if (elem.predict) {
          yData.push(elem.predict);
        } else if (elem.payload) {
          yData.push(elem.payload);
        }
      });

      const initializeOption = {
        xAxis: {
          type: 'category',
          name: param.xName,
          data: xData,
        },
        yAxis: {
          type: 'value',
          name: param.yName,
        },
        series: [{
          data: yData,
          name: param.yName,
          type: this.$data.currentDisplayMethod,
        }],
        legend: {
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: 'horizontal',
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
        },
      };
      this.currentChart.setOption(initializeOption, true);
    },
    refreshChart2nd() {
      const param = this.$data.params2nd;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById(this.uniqueId));
      }
      const xData = [];
      const yData1st = [];
      const yData2nd = [];

      this.$data.graphData.forEach((elem) => {
        xData.push(elem[param.xTag]);
        yData1st.push(elem[param.yTag1st]);
        yData2nd.push(elem[param.yTag2nd]);
      });

      const initializeOption = {
        xAxis: {
          type: 'category',
          name: param.xName,
          data: xData,
        },
        yAxis: {
          type: 'value',
          name: param.yName,
        },
        series: [
          {
            data: yData1st,
            name: param.yName1st,
            type: this.$data.currentDisplayMethod,
          },
          {
            data: yData2nd,
            name: param.yName2nd,
            type: this.$data.currentDisplayMethod,
          },
        ],
        legend: {
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: 'horizontal',
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
        },
      };
      this.currentChart.setOption(initializeOption, true);
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
      if (this.typee === '2nd') {
        this.refreshChart2nd();
      } else if (this.typee === 'dirty') {
        this.refreshChartDirty();
      } else {
        this.refreshChart();
      }
    },
  },
  computed: {
    uniqueId() {
      if (this.uid !== undefined) {
        return this.uid;
      }
      return 'globalChart';
    },
  },
  props: ['typee', 'uid'],
};
</script>

<style scoped>

</style>

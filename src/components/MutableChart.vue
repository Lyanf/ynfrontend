<template>
  <div style="margin-left: 20px" v-show="xData.length !== 0">
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
      xName: '',
      xData: [],
      yName: '',
      yData: [],
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
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById(this.uniqueId));
      }

      const ySeries = [];
      this.$data.yData.forEach((elem) => {
        ySeries.push({
          data: elem.data,
          name: elem.name,
          type: this.$data.currentDisplayMethod,
        });
      });

      const initializeOption = {
        // color: ['#DBDA39'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter(dataa) {
            let returnData = '';
            // console.log(dataa);
            for (let i = 0; i < dataa.length; i += 1) {
              if (dataa[i].seriesName !== '' && dataa[i].value !== undefined) {
                const indexColor = dataa[i].color;
                returnData += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background:${indexColor}"></span>`;
                returnData += `${dataa[i].seriesName} - ${parseFloat(dataa[i].value).toFixed(2)}</br>`;
              }
            }
            return returnData;
          },
        },
        xAxis: {
          type: 'category',
          name: this.$data.xName,
          data: this.$data.xData,
          axisTick: {
            alignWithLabel: true,
          },
          boundaryGap: this.$data.currentDisplayMethod === 'bar',
          onZero: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',
              fontSize: 14,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: this.$data.yName,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#ffffff',
              fontSize: 14,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff',
            },
          },
        },
        series: ySeries,
        legend: {
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: 'horizontal',
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
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
      saveAs(blob, '预测图像.png');
    },
  },
  watch: {
    currentDisplayMethod() {
      this.refreshChart();
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
  props: ['uid'],
};
</script>

<style scoped>

</style>

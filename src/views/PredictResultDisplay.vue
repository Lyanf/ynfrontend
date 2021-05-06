<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="5" :offset="1">
        <el-form label-position="right" label-width="auto">
          <el-form-item label="对比方案标签：">
            <el-select v-model="postParams.tags" multiple>
              <el-option v-for="item in knownTags"
                         :key="item.id"
                         :value="item.id">
                <span style="float: left">{{ item.id }}</span>
                <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对比特征：">
            <el-select v-model="postParams.trait">
              <el-option v-for="item in knownTraits"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="performCompare"
                       type="primary"
                       :disabled="!canCommitQuery">对比</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="17" :offset="1">
        <el-row>
          <div id="compareChart" style="height: 500px"></div>
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
  name: 'PredictResultDisplay',
  data() {
    return {
      postParams: {
        tags: [],
        trait: null,
      },
      currentChart: undefined,
      displayData: [],
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
      knownTags: [],
      knownTraits: [
        {
          label: 'R2 值',
          value: 'R2',
        },
        {
          label: 'MAPE 值',
          value: 'MAPE',
        },
        {
          label: 'RMSE 值',
          value: 'RMSE',
        },
        {
          label: '预测功率值（MW）',
          value: 'predictMVW',
        },
      ],
      typeName: {
        MINING: '数据挖掘方案',
        STATIC_REGIONAL: '地区单预测方案',
        DYNAMIC_INDUSTRIAL: '行业单预测方案',
        MIX: '组合预测方案',
        LONGTERM: '远期规划预测方案',
        BIGUSER: '大用户预测方案',
        SOKU: '负荷特性预测方案',
        CLAMP: '负荷特性预测方案',
        INTERP: '负荷特性预测方案',
        YEARCONT: '负荷特性预测方案',
      },
      currentDisplayMethod: 'line',
    };
  },
  mounted() {
    this.loadTags();
  },
  computed: {
    canCommitQuery() {
      const params = this.$data.postParams;
      return !(params.tags.length < 2 || params.trait === null);
    },
  },
  methods: {
    exportImage() {
      if (!this.currentChart) {
        return;
      }
      const content = this.currentChart.getDataURL();
      const blob = base64ToBlob(content);
      saveAs(blob, '预测图像.png');
    },
    loadTags() {
      this.$axios.get('/predict/results/query').then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    refreshChart() {
      const data = this.$data.displayData;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById('compareChart'));
        window.onresize = this.currentChart.resize;
      }
      const series = [];
      data.yData.forEach((elem) => {
        series.push({
          data: elem.data,
          name: elem.tag,
          type: this.$data.currentDisplayMethod,
        });
      });
      const initializeOption = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          name: data.xName,
          data: data.xData,
          axisTick: {
            alignWithLabel: true,
          },
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
          boundaryGap: this.$data.currentDisplayMethod === 'bar',
          onZero: true,
        },
        yAxis: {
          type: 'value',
          name: data.yName,
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
        series,
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
      this.currentChart.style.width = `${document.body.clientWidth * 0.6}px`;
    },
    performCompare() {
      this.$axios.post('/predict/results/compare', this.$data.postParams).then((response) => {
        this.$data.displayData = response.data.data;
        this.refreshChart();
      });
    },
  },
  watch: {
    currentDisplayMethod() {
      this.refreshChart();
    },
  },
};
</script>

<style scoped>

</style>

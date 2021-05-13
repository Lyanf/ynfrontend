<template>
  <div>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-form inline>
          <el-form-item label="方案标签：">
            <el-select v-model="selectedTag">
              <el-option v-for="item in knownTags"
                         :key="item.tag"
                         :value="item.tag">
                <span style="float: left">{{ item.tag }}</span>
                <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="selectedTag === null"
                       @click="preformQuery">查询</el-button>
          </el-form-item>
        </el-form>
<!--        <el-form inline v-if="predictTokens !== undefined">-->
<!--          <el-form-item label="MAPE：">{{ predictTokens.mape }}</el-form-item>-->
<!--          <el-form-item label="RMSE：">{{ predictTokens.rmse }}</el-form-item>-->
<!--        </el-form>-->
        <el-row>
          <div id="predictChart" style="height: 500px"></div>
        </el-row>
        <el-row v-if="currentChart !== undefined">
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
        <ResultTable ref="resultTable"></ResultTable>
        <el-form>
          <el-form-item label="方案参数：" v-if="jsonContent !== undefined" />
          <json-viewer v-if="jsonContent !== undefined" :value="jsonContent" copyable></json-viewer>
          <el-form-item label="预测结果：" v-if="predictContent !== undefined" />
          <json-viewer v-if="predictContent !== undefined"
                       :value="predictContent" copyable></json-viewer>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer';
import * as echarts from 'echarts';
import { saveAs } from 'file-saver';
import ResultTable from '@/components/ResultTable.vue';

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
  name: 'PredictResultQuery',
  components: { JsonViewer, ResultTable },
  data() {
    return {
      knownTags: [],
      selectedTag: null,
      jsonContent: undefined,
      predictContent: undefined,
      predictTokens: undefined,
      predictPayloads: [],
      currentChart: undefined,
      chartData: [],
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
    };
  },
  mounted() {
    this.loadTags();
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
    preformQuery() {
      this.$axios.get('/predict/results/detail', {
        params: {
          tag: this.$data.selectedTag,
        },
      }).then((response) => {
        const content = response.data.data;
        this.$data.jsonContent = content.arg;
        this.$data.predictContent = content.result;
        this.$data.predictTokens = {
          mape: content.result.MAPE,
          rmse: content.result.RMSE,
        };
        const years = [];
        for (let i = parseInt(content.arg.PreStartYear, 10);
          i <= parseInt(content.arg.PreEndYear, 10);
          i += 1) {
          years.push(i);
        }
        this.$data.chartData = {
          xName: '年份',
          xData: years,
          yName: '预测值（MW）',
          yData: [
            {
              data: content.result.preresult,
              tag: content.arg.tag,
            }],
        };
        this.refreshChart();
        const takeTwoData = [];
        for (let i = parseInt(content.arg.PreStartYear, 10);
          i <= parseInt(content.arg.PreEndYear, 10); i += 1) {
          takeTwoData.push({
            year: i,
            predict: content.result.preresult[i - parseInt(content.arg.PreStartYear, 10)],
          });
        }
        this.$refs.resultTable.tableOneData = [this.$data.predictTokens];
        this.$refs.resultTable.tableTwoData = takeTwoData;
      });
    },
    refreshChart() {
      const data = this.$data.chartData;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById('predictChart'));
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
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
      };
      console.log(initializeOption);
      this.currentChart.setOption(initializeOption, true);
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

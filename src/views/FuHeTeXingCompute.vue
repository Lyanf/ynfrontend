<template>
  <div>
    <el-tabs tab-position="left" label-width="100px">
      <el-tab-pane label="日负荷特性指标计算">
        <!--      日负荷特性指标计算-->
        <el-form>
          <el-form-item>
            <el-date-picker type="daterange"
                            range-separator="至"
                            start-placeholder="起始日期"
                            end-placeholder="终止日期"
                            v-model="dayParams.dayRange"
                            style="width: 300px"
            ></el-date-picker>
            <el-button type="primary"
                       style="margin-left: 20px"
                      :disabled="dayParams.dayRange === null"
                      @click="dayDataRequest">计算</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-table title='日负荷特性指标表' :data="dayTableData" @current-change="clickChange">
            <el-table-column label="选择" width="55">
              <template slot-scope="scope">
                <el-radio v-model="selectedDayEntry" :label="scope.row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="day" label="日期"></el-table-column>
            <el-table-column prop="dayMaxPayload" label="日最大负荷"></el-table-column>
            <el-table-column prop="dayAveragePayload" label="日平均负荷"></el-table-column>
            <el-table-column prop="dayPayloadRate" label="日负荷率"></el-table-column>
            <el-table-column prop="dayMinPayloadRate" label="日最小负荷率"></el-table-column>
            <el-table-column prop="dayPeekValleyDiff" label="日峰谷差"></el-table-column>
            <el-table-column prop="dayPeekValleyDiffRate" label="日峰谷差率"></el-table-column>
          </el-table>
        </el-row>
        <el-form>
          <el-form-item>
            <el-button :disabled="selectedDayEntry === null || dayTableData.length === 0"
                       @click="clickDailyChart">日负荷曲线</el-button>
            <el-button @click="dailyTypicalChartVisible = true;
                       dailyTypicalChart = undefined"
                       :disabled="dayTableData.length === 0">典型日负荷曲线</el-button>
            <el-button v-print>打印</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          :visible="false"
          width="50%">
          <ResultChart></ResultChart>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="月负荷特性指标计算">
        <el-form>
          <el-form-item>
            <el-date-picker type="monthrange"
                            range-separator="至"
                            start-placeholder="起始月份"
                            end-placeholder="终止月份"
                            v-model="monthParams.monthRange"
                            style="width: 300px"
            ></el-date-picker>
            <el-button type="primary"
                       style="margin-left: 20px"
                       :disabled="monthParams.monthRange === null"
                       @click="monthDataRequest">计算</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-table title='月负荷特性指标表' :data="monthTableData">
            <el-table-column prop="month" label="月份"></el-table-column>
            <el-table-column prop="monthAverageDailyPayload" label="月平均日负荷"></el-table-column>
            <el-table-column prop="monthMaxPeekValleyDiff" label="月最大峰谷差"></el-table-column>
            <el-table-column prop="monthAverageDailyPayloadRate" label="月平均日负荷率"></el-table-column>
            <el-table-column prop="monthImbaRate" label="月不均衡率系数"></el-table-column>
            <el-table-column prop="monthMinPayloadRate" label="月最小负荷率"></el-table-column>
            <el-table-column prop="monthMaxPeekValleyDiffRate" label="月平均峰谷差率"></el-table-column>
          </el-table>
        </el-row>
        <el-form>
          <el-form-item>
            <el-button @click="monthlyChartVisible = true;
                       monthlyChart = undefined"
                       :disabled="monthTableData.length === 0">月负荷曲线</el-button>
            <el-button v-print>打印</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="年负荷特性指标计算">
        <el-form>
          <el-form-item>
            <el-date-picker
              v-model="yearParams.beginYear"
              type="year"
              placeholder="起始年份"
              style="width: 122px"/>
            <el-badge style="margin-left: 20px; margin-right: 20px">至</el-badge>
            <el-date-picker
              v-model="yearParams.endYear"
              type="year"
              placeholder="终止年份"
              style="width: 124px"/>
            <el-button type="primary"
                       style="margin-left: 20px"
                      :disabled="yearParams.beginYear === null
                      || yearParams.endYear === null"
                      @click="yearDataRequest">计算</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-table title='年负荷特性指标表' :data="yearTableData">
            <el-table-column prop="year" label="年份"></el-table-column>
            <el-table-column prop="yearMaxPayload" label="年最大负荷"></el-table-column>
            <el-table-column prop="yearAverageDailyPayloadRate" label="年平均日负荷率"></el-table-column>
            <el-table-column prop="seasonImbaRate" label="季不均衡系数"></el-table-column>
            <el-table-column prop="yearMaxPeekValleyDiff" label="年最大峰谷差"></el-table-column>
            <el-table-column prop="yearMaxPeekValleyDiffRate" label="年最大峰谷差率"></el-table-column>
            <el-table-column prop="yearMaxPayloadUsageHours" label="年最大负载小时数"></el-table-column>
          </el-table>
        </el-row>
        <el-form>
          <el-form-item>
            <el-button @click="yearlyChartVisible = true;
                       yearlyChart = undefined"
                       :disabled="yearTableData.length === 0">年负荷曲线</el-button>
            <el-button v-print>打印</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="日负荷曲线" :visible.sync="dailyChartVisible">
      <el-form>
        <el-form-item v-show="dailyChart !== undefined">
          <div id="dailyChart" style="width: 680px; height: 300px"></div>
        </el-form-item>
        <el-form-item>
          <el-date-picker type="date"
                          format="yyyy 年 MM 月 dd 日" value-format="yyyy/MM/dd"
                          v-model="dailyChartParams.day"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showDailyChart"
                     :disabled="dailyChartParams.day === null">显示</el-button>
          <el-button @click="exportImage(dailyChart)"
                     :disabled="dailyChart === undefined">导出图像</el-button>
        </el-form-item>
      </el-form>
      <el-form inline>
        <el-form-item v-for="pair in dailyChartMetaData" :label="pair.key + '：'" :key="pair.key">
          <a>{{pair.value}}</a>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="典型日负荷曲线" :visible.sync="dailyTypicalChartVisible">
      <el-form>
        <el-form-item v-show="dailyTypicalChart !== undefined">
          <div id="dailyTypicalChart" style="width: 680px; height: 300px"></div>
        </el-form-item>
        <el-form-item label="年份：">
          <el-date-picker type="year"
                          format="yyyy 年" value-format="yyyy"
                          v-model="dailyTypicalChartParams.year"></el-date-picker>
        </el-form-item>
        <el-form-item label="时期：">
          <el-select v-model="dailyTypicalChartParams.period">
            <el-option v-for="item in knownPeriods"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="dailyTypicalChartParams.category">
            <el-option v-for="item in knownCategories"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showDailyTypicalChart"
                     :disabled="dailyTypicalChartParams.category === null
                      || dailyTypicalChartParams.period === null
                      || dailyTypicalChartParams.year === null">显示</el-button>
          <el-button @click="exportImage(dailyTypicalChart)"
                     :disabled="dailyTypicalChart === undefined">导出图像</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="月负荷曲线" :visible.sync="monthlyChartVisible">
      <el-form>
        <el-form-item v-show="monthlyChart !== undefined">
          <div id="monthlyChart" style="width: 680px; height: 300px"></div>
        </el-form-item>
        <el-form-item label="年份：">
          <el-date-picker type="date"
                          format="yyyy 年" value-format="yyyy"
                          v-model="monthlyChartParams.year"></el-date-picker>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="monthlyChartParams.category">
            <el-option v-for="item in knownMonthCategories"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showMonthlyChart"
                     :disabled="monthlyChartParams.category === null
                      || monthlyChartParams.year === null">显示</el-button>
          <el-button @click="exportImage(monthlyChart)"
                     :disabled="monthlyChart === undefined">导出图像</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="年负荷曲线" :visible.sync="yearlyChartVisible">
      <el-form>
        <el-form-item v-show="yearlyChart !== undefined">
          <div id="yearlyChart" style="width: 680px; height: 300px"></div>
        </el-form-item>
        <el-form-item label="年份：">
          <year-range-selector
            :begin-year.sync='yearlyChartParams.beginYear'
            :end-year.sync="yearlyChartParams.endYear"></year-range-selector>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="yearlyChartParams.category">
            <el-option v-for="item in knownYearCategories"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showYearlyChart"
                     :disabled="yearlyChartParams.category === null
                      || yearlyChartParams.beginYear === null
                      || yearlyChartParams.endYear === null">显示</el-button>
          <el-button @click="exportImage(yearlyChart)"
                     :disabled="yearlyChart === undefined">导出图像</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ResultChart from '@/components/ResultChart.vue';
import * as echarts from 'echarts';
import { saveAs } from 'file-saver';
import YearRangeSelector from '@/components/YearRangeSelector.vue';

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
  name: 'FuHeTeXingCompute',
  components: { YearRangeSelector, ResultChart },
  data() {
    return {
      dailyChartVisible: false,
      dailyChart: undefined,
      dailyChartParams: {
        day: null,
      },
      dailyChartMetaData: [],
      dailyTypicalChartVisible: false,
      dailyTypicalChart: undefined,
      dailyTypicalChartParams: {
        year: null,
        period: null,
        category: null,
      },
      knownPeriods: ['丰水期', '汛前枯期', '汛后枯期'],
      knownCategories: ['最大负荷', '最小负荷', '中位负荷'],
      monthlyChartVisible: false,
      monthlyChart: undefined,
      monthlyChartParams: {
        year: null,
        category: null,
      },
      knownMonthCategories: ['年负荷曲线', '年连续负荷曲线', '月平均日负荷曲线', '月平均日负荷率曲线', '月最大峰谷差曲线', '月最大峰谷差率曲线', '月不均衡系数曲线'],
      yearlyChartVisible: false,
      yearlyChart: undefined,
      yearlyChartParams: {
        beginYear: null,
        endYear: null,
        category: null,
      },
      knownYearCategories: ['历年最大负荷曲线', '历年平均日负荷率曲线', '历年最大峰谷差曲线', '历年最大峰谷差率曲线', '历年季不平衡系数曲线'],
      selectedDayEntry: null,
      dayParams: {
        dayRange: null,
      },
      dayTableData: [],
      monthParams: {
        monthRange: null,
      },
      monthTableData: [],
      yearParams: {
        beginYear: null,
        endYear: null,
      },
      yearTableData: [],
    };
  },
  methods: {
    clickChange(item) {
      this.selectedDayEntry = item;
    },
    clickDailyChart() {
      this.$data.dailyChartVisible = true;
      if (this.$data.dailyChartParams.day !== this.$data.selectedDayEntry.day) {
        this.$data.dailyChartParams.day = this.$data.selectedDayEntry.day;
        this.$data.dailyChart = undefined;
        this.$data.dailyChartMetaData = [];
      }
    },
    showDailyChart() {
      if (this.$data.dailyChart === undefined) {
        this.$data.dailyChart = echarts.init(document.getElementById('dailyChart'));
      }
      this.$axios.get('/payload/charts/daily', {
        params: this.$data.dailyChartParams,
      }).then((response) => {
        this.refreshChart(response.data.data, this.$data.dailyChart);
        this.$data.dailyChartMetaData = response.data.data.metaData;
      });
    },
    showDailyTypicalChart() {
      if (this.$data.dailyTypicalChart === undefined) {
        this.$data.dailyTypicalChart = echarts.init(document.getElementById('dailyTypicalChart'));
      }
      this.$axios.get('/payload/charts/daily/typical', {
        params: this.$data.dailyTypicalChartParams,
      }).then((response) => {
        this.refreshChart(response.data.data, this.$data.dailyTypicalChart);
      });
    },
    showMonthlyChart() {
      if (this.$data.monthlyChart === undefined) {
        this.$data.monthlyChart = echarts.init(document.getElementById('monthlyChart'));
      }
      this.$axios.get('/payload/charts/monthly', {
        params: this.$data.monthlyChartParams,
      }).then((response) => {
        this.refreshChart(response.data.data, this.$data.monthlyChart);
      });
    },
    showYearlyChart() {
      if (this.$data.yearlyChart === undefined) {
        this.$data.yearlyChart = echarts.init(document.getElementById('yearlyChart'));
      }
      this.$axios.get('/payload/charts/yearly', {
        params: this.$data.yearlyChartParams,
      }).then((response) => {
        this.refreshChart(response.data.data, this.$data.yearlyChart);
      });
    },
    dayDataRequest() {
      const params = this.$data.dayParams;
      const beginDay = params.dayRange[0];
      const endDay = params.dayRange[1];
      this.$axios.get('/payload/traits/daily', {
        params: {
          beginDay: beginDay.format('yyyy/MM/dd'),
          endDay: endDay.format('yyyy/MM/dd'),
        },
      }).then((response) => {
        this.dayTableData = response.data.data;
      });
    },
    monthDataRequest() {
      const params = this.$data.monthParams;
      const beginDay = params.monthRange[0];
      const endDay = params.monthRange[1];
      this.$axios.get('/payload/traits/monthly', {
        params: {
          beginMonth: beginDay.format('yyyy/MM'),
          endMonth: endDay.format('yyyy/MM'),
        },
      }).then((response) => {
        this.monthTableData = response.data.data;
      });
    },
    yearDataRequest() {
      const params = this.$data.yearParams;
      this.$axios.get('/payload/traits/yearly', {
        params: {
          beginYear: params.beginYear.getFullYear(),
          endYear: params.endYear.getFullYear(),
        },
      }).then((response) => {
        this.yearTableData = response.data.data;
      });
    },
    refreshChart(data, chart) {
      console.log(data);
      console.log(chart);
      const series = [];
      data.yData.forEach((elem) => {
        series.push({
          data: elem.data,
          name: elem.tag,
          type: 'line',
        });
      });
      const initializeOption = {
        xAxis: {
          type: 'category',
          name: data.xName,
          data: data.xData,
        },
        yAxis: {
          type: 'value',
          name: data.yName,
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
      chart.setOption(initializeOption, true);
    },
    exportImage(chart) {
      const content = chart.getDataURL();
      const blob = base64ToBlob(content);
      saveAs(blob, 'chart.png');
    },
  },
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 3em;
  }
  .el-input, .el-select {
    width: 60%;
  }
</style>

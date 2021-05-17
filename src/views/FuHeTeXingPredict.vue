<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="搜库法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-form-item label="历史年份：">
              <year-range-selector
                :begin-year.sync="sokuParams.beginYear"
                :end-year.sync="sokuParams.endYear"
                :expand="true">
              </year-range-selector>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="loadSokuDefault"
              :disabled="sokuParams.beginYear === null || sokuParams.endYear === null">
                加载默认参数
              </el-button>
            </el-form-item>
            <el-form-item label="季节：">
              <el-select v-model="sokuParams.season">
                <el-option
                  v-for="item in seasons"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型：">
              <el-select v-model="sokuParams.type">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预测最大负荷：">
              <el-input :step="1"
                clearable type="number" placeholder="请输入" v-model="sokuParams.maxPayload"/>
            </el-form-item>
            <el-form-item label="预测日电量：">
              <el-input :step="1"
                clearable type="number" placeholder="请输入" v-model="sokuParams.dailyAmount"/>
            </el-form-item>
            <el-form-item label="Gamma 值：">
              <el-input :step="0.001"
                clearable type="number" placeholder="请输入" v-model="sokuParams.gamma"/>
            </el-form-item>
            <el-form-item label="Beta 值：">
              <el-input :step="0.001"
                clearable type="number" placeholder="请输入" v-model="sokuParams.beta"/>
            </el-form-item>
            <el-form-item label="方案标签：">
              <el-input clearable placeholder="可留空" v-model="sokuParams.tag">
              </el-input>
            </el-form-item>
            <el-form-item label="加载方案：">
              <el-select placeholder="选择标签"
                         v-model="currentSokuTag" size="small" style="width: 100%">
                <el-option
                  v-for="item in knownSokuTags"
                  :key="item.tag"
                  :label="item.tag"
                  :value="item.tag">
                </el-option>
              </el-select>
              <el-button size="small" @click="loadSokuParameters"
                         :disabled="currentSokuTag === null">加载</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="!sokuSubmittable" @click="sokuPredict">计算</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="sokuResultChart" typee="dirty" uid="sokuChart"></ResultChart>
        </el-col>
      </el-row>
      <el-form>
        <el-form-item>
          <el-button
            :disabled="sokuTableData.length === 0"
            @click="exportTableSheet(sokuTableData, '搜库法预测结果.csv')">
            导出表格
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="sokuTableData">
            <el-table-column prop="time" label="时间"/>
            <el-table-column prop="payload" label="负荷"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="双向夹逼法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="历史年份：">
                <year-range-selector
                  :begin-year.sync="clampParams.beginYear"
                  :end-year.sync="clampParams.endYear"
                  :expand="true">
              </year-range-selector>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="loadClampDefault"
                           :disabled="clampParams.beginYear === null ||
                            clampParams.endYear === null">
                  加载默认参数
                </el-button>
              </el-form-item>
              <el-form-item label="季节：">
                <el-select v-model="clampParams.season">
                  <el-option
                    v-for="item in seasons"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型：">
                <el-select v-model="clampParams.type">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number" :step="1"
                          placeholder="请输入" v-model="clampParams.maxPayload"></el-input>
              </el-form-item>
              <el-form-item label="预测日电量：">
                <el-input clearable type="number" :step="1"
                          placeholder="请输入" v-model="clampParams.dailyAmount"></el-input>
              </el-form-item>
              <el-form-item label="方案标签：">
                <el-input clearable placeholder="可留空" v-model="clampParams.tag">
                </el-input>
              </el-form-item>
              <el-form-item label="加载方案：">
                <el-select placeholder="选择标签"
                           v-model="currentClampTag" size="small">
                  <el-option
                    v-for="item in knownClampTags"
                    :key="item.tag"
                    :label="item.tag"
                    :value="item.tag">
                  </el-option>
                </el-select>
                <el-button size="small" @click="loadClampParameters"
                           :disabled="currentClampTag === null">加载</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!clampSubmittable" @click="clampPredict">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="clampResultChart" typee="dirty" uid="clampChart"></ResultChart>
        </el-col>
      </el-row>
      <el-form>
        <el-form-item>
          <el-button
            :disabled="clampTableData.length === 0"
            @click="exportTableSheet(clampTableData, '夹逼法预测结果.csv')">
            导出表格
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="clampTableData">
            <el-table-column prop="time" label="时间"/>
            <el-table-column prop="payload" label="负荷"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="分形插值法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="历史年份：">
                <year-range-selector
                  :begin-year.sync="interpParams.beginYear"
                  :end-year.sync="interpParams.endYear"
                  :expand="true">
                </year-range-selector>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="loadInterpDefault"
                           :disabled="interpParams.beginYear === null ||
                            interpParams.endYear === null">
                  加载默认参数
                </el-button>
              </el-form-item>
              <el-form-item label="季节：">
                <el-select v-model="interpParams.season">
                  <el-option
                    v-for="item in seasons"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型：">
                <el-select v-model="interpParams.type">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number" :step="1"
                          placeholder="请输入" v-model="interpParams.maxPayload"></el-input>
              </el-form-item>
              <el-form-item label="预测日电量：">
                <el-input clearable type="number" :step="1"
                          placeholder="请输入" v-model="interpParams.dailyAmount"></el-input>
              </el-form-item>
              <el-form-item label="方案标签：">
                <el-input clearable placeholder="可留空" v-model="interpParams.tag">
                </el-input>
              </el-form-item>
              <el-form-item label="加载方案：">
                <el-select placeholder="选择标签"
                           v-model="currentInterpTag" size="small">
                  <el-option
                    v-for="item in knownInterpTags"
                    :key="item.tag"
                    :label="item.tag"
                    :value="item.tag">
                  </el-option>
                </el-select>
                <el-button size="small" @click="loadInterpParameters"
                           :disabled="currentInterpTag === null">加载</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!interpSubmittable" @click="interpPredict">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="interpResultChart" typee="dirty" uid="interpChart"></ResultChart>
        </el-col>
      </el-row>
      <el-form>
        <el-form-item>
          <el-button
            :disabled="interpTableData.length === 0"
            @click="exportTableSheet(interpTableData, '分形插值法预测结果.csv')">
            导出表格
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="interpTableData">
            <el-table-column prop="time" label="时间"/>
            <el-table-column prop="payload" label="负荷"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="年持续负荷曲线预测">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="历史年份：">
                <year-range-selector
                  :begin-year.sync="yearContParams.beginYear"
                  :end-year.sync="yearContParams.endYear"
                  :expand="true">
                </year-range-selector>
              </el-form-item>
<!--              <el-form-item>-->
<!--                <el-button size="mini" @click="loadYearContDefault"-->
<!--                           :disabled="yearContParams.beginYear === null ||-->
<!--                            yearContParams.endYear === null">-->
<!--                  加载默认参数-->
<!--                </el-button>-->
<!--              </el-form-item>-->
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number" :step="1"
                          placeholder="请输入" v-model="yearContParams.maxPayload"></el-input>
              </el-form-item>
              <el-form-item label="方案标签：">
                <el-input clearable placeholder="可留空" v-model="yearContParams.tag">
                </el-input>
              </el-form-item>
              <el-form-item label="加载方案：">
                <el-select placeholder="选择标签"
                           v-model="currentYearContTag" size="small">
                  <el-option
                    v-for="item in knownYearContTags"
                    :key="item.tag"
                    :label="item.tag"
                    :value="item.tag">
                  </el-option>
                </el-select>
                <el-button size="small" @click="loadYearContParameters"
                           :disabled="currentYearContTag === null">加载</el-button>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!yearContSubmittable" @click="yearContPredict">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="yearContResultChart" uid="yearContChart"></ResultChart>
        </el-col>
      </el-row>
      <el-form>
        <el-form-item>
          <el-button
            :disabled="yearContTableData.length === 0"
            @click="exportTableSheet(yearContTableData, '年持续负荷预测结果.csv')">
            导出表格
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="yearContTableData">
            <el-table-column prop="time" label="时间"/>
            <el-table-column prop="payload" label="负荷"/>
          </el-table>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import ResultChart from '@/components/ResultChart.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';
import YearRangeSelector from '../components/YearRangeSelector.vue';

export default {
  name: 'FuHeTeXingPredict',
  components: { ResultChart, YearRangeSelector },
  data() {
    return {
      seasons: [
        {
          label: '丰水期',
          value: '丰水期',
        },
        {
          label: '汛前枯期',
          value: '汛前枯期',
        },
        {
          label: '汛后枯期',
          value: '汛后枯期',
        },
      ],
      types: [
        {
          label: '最大值',
          value: '最大值',
        },
        {
          label: '最小值',
          value: '最小值',
        },
        {
          label: '中位值',
          value: '中位值',
        },
      ],
      sokuParams: {
        beginYear: null,
        endYear: null,
        season: null,
        type: null,
        maxPayload: null,
        dailyAmount: null,
        gamma: null,
        beta: null,
        tag: null,
        tagType: 'SOKU',
      },
      sokuTableData: [],
      knownSokuTags: [],
      currentSokuTag: null,
      clampParams: {
        beginYear: null,
        endYear: null,
        season: null,
        type: null,
        maxPayload: null,
        dailyAmount: null,
        tag: null,
        tagType: 'CLAMP',
      },
      clampTableData: [],
      knownClampTags: [],
      currentClampTag: null,
      interpParams: {
        beginYear: null,
        endYear: null,
        season: null,
        type: null,
        maxPayload: null,
        dailyAmount: null,
        tag: null,
        tagType: 'INTERP',
      },
      interpTableData: [],
      knownInterpTags: [],
      currentInterpTag: null,
      yearContParams: {
        beginYear: null,
        endYear: null,
        maxPayload: null,
        tag: null,
        tagType: 'YEARCONT',
      },
      yearContTableData: [],
      knownYearContTags: [],
      currentYearContTag: null,
    };
  },
  mounted() {
    this.loadSokuTags();
    this.loadClampTags();
    this.loadInterpTags();
    this.loadYearContTags();
  },
  methods: {
    loadSokuTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'SOKU',
        },
      }).then((response) => {
        this.$data.knownSokuTags = response.data.data;
      });
    },
    loadSokuParameters() {
      this.$axios.get('/params/predict/soku', {
        params: {
          tag: this.$data.currentSokuTag,
        },
      }).then((response) => {
        this.$data.sokuParams = response.data.data;
      });
    },
    sokuPredict() {
      this.$axios.post('/payload/predict/dbquery', this.$data.sokuParams).then((response) => {
        this.$data.sokuTableData = this.parseToTable(response.data.data);
        this.$refs.sokuResultChart.graphData = response.data.data;
        this.$refs.sokuResultChart.params1st = {
          xTag: 'xData',
          yTag: 'yData',
          xName: '时间',
          yName: '负载（单位：MW）',
        };
        this.$refs.sokuResultChart.refreshChartDirty();
      });
    },
    loadClampTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'CLAMP',
        },
      }).then((response) => {
        this.$data.knownClampTags = response.data.data;
      });
    },
    loadClampParameters() {
      this.$axios.get('/params/predict/clamping', {
        params: {
          tag: this.$data.currentClampTag,
        },
      }).then((response) => {
        this.$data.clampParams = response.data.data;
      });
    },
    clampPredict() {
      this.$axios.post('/payload/predict/clamping', this.$data.clampParams).then((response) => {
        this.$data.clampTableData = this.parseToTable(response.data.data);
        this.$refs.clampResultChart.graphData = response.data.data;
        this.$refs.clampResultChart.params1st = {
          xTag: 'time',
          yTag: 'payload',
          xName: '时间',
          yName: '负载（单位：MW）',
        };
        this.$refs.clampResultChart.refreshChartDirty();
      });
    },
    loadInterpTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'INTERP',
        },
      }).then((response) => {
        this.$data.knownInterpTags = response.data.data;
      });
    },
    loadInterpParameters() {
      this.$axios.get('/params/predict/interp', {
        params: {
          tag: this.$data.currentInterpTag,
        },
      }).then((response) => {
        this.$data.interpParams = response.data.data;
      });
    },
    interpPredict() {
      this.$axios.post('/payload/predict/interp', this.$data.interpParams).then((response) => {
        this.$data.interpTableData = this.parseToTable(response.data.data);
        this.$refs.interpResultChart.graphData = response.data.data;
        this.$refs.interpResultChart.params1st = {
          xTag: 'time',
          yTag: 'payload',
          xName: '时间',
          yName: '负载（单位：MW）',
        };
        this.$refs.interpResultChart.refreshChartDirty();
      });
    },
    loadYearContTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'YEARCONT',
        },
      }).then((response) => {
        this.$data.knownYearContTags = response.data.data;
      });
    },
    loadYearContParameters() {
      this.$axios.get('/params/predict/yearcont', {
        params: {
          tag: this.$data.currentYearContTag,
        },
      }).then((response) => {
        this.$data.yearContParams = response.data.data;
      });
    },
    yearContPredict() {
      this.$axios.post('/payload/predict/yearly', this.$data.yearContParams).then((response) => {
        const tableData = [];
        for (let i = 0; i < response.data.data.xData.length; i += 1) {
          tableData.push({
            time: response.data.data.xData[i],
            payload: response.data.data.yData[0].data[i],
          });
        }
        this.$data.yearContTableData = tableData;
        this.$refs.yearContResultChart.graphData = tableData;
        this.$refs.yearContResultChart.params1st = {
          xTag: 'time',
          yTag: 'payload',
          xName: '时间',
          yName: '负载（单位：MW）',
        };
        this.$refs.yearContResultChart.refreshChart();
      });
    },
    parseToTable(data) {
      const tableSheet = [];
      for (let i = 0; i < data.xData.length; i += 1) {
        tableSheet.push({
          time: data.xData[i],
          payload: data.yData[0].data[i],
        });
      }
      return tableSheet;
    },
    loadSokuDefault() {
      this.$axios.get('/get/default', {
        params: {
          start: this.$data.sokuParams.beginYear,
          end: this.$data.sokuParams.endYear,
        },
      }).then((response) => {
        Object.keys(response.data.data.souku).forEach((key) => {
          this.$data.sokuParams[key] = response.data.data.souku[key];
        });
      });
    },
    loadClampDefault() {
      this.$axios.get('/get/default', {
        params: {
          start: this.$data.clampParams.beginYear,
          end: this.$data.clampParams.endYear,
        },
      }).then((response) => {
        Object.keys(response.data.data.jiabi).forEach((key) => {
          this.$data.clampParams[key] = response.data.data.jiabi[key];
        });
      });
    },
    loadInterpDefault() {
      this.$axios.get('/get/default', {
        params: {
          start: this.$data.interpParams.beginYear,
          end: this.$data.interpParams.endYear,
        },
      }).then((response) => {
        Object.keys(response.data.data.fenxing).forEach((key) => {
          this.$data.interpParams[key] = response.data.data.fenxing[key];
        });
      });
    },
    loadYearContDefault() {
      // not exist
    },
    exportTableSheet(rawData, name = 'database.csv') {
      const data = json2csv.parse(rawData, {
        fields: ['time', 'payload'],
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, name);
    },
  },
  computed: {
    sokuSubmittable() {
      const param = this.$data.sokuParams;
      let isOk = true;
      [param.beginYear,
        param.endYear,
        // param.season,
        param.maxPayload,
        param.dailyAmount,
        param.gamma,
        param.beta].forEach((elem) => {
        if (elem === null) {
          isOk = false;
        }
      });
      return isOk;
    },
    clampSubmittable() {
      const param = this.$data.clampParams;
      let isOk = true;
      [param.beginYear,
        param.endYear,
        param.season,
        param.type,
        param.maxPayload,
        param.dailyAmount].forEach((elem) => {
        if (elem === null) {
          isOk = false;
        }
      });
      return isOk;
    },
    interpSubmittable() {
      const param = this.$data.interpParams;
      let isOk = true;
      [param.beginYear,
        param.endYear,
        param.season,
        param.type,
        param.maxPayload,
        param.dailyAmount].forEach((elem) => {
        if (elem === null) {
          isOk = false;
        }
      });
      return isOk;
    },
    yearContSubmittable() {
      const param = this.$data.yearContParams;
      let isOk = true;
      [param.beginYear,
        param.endYear,
        param.maxPayload].forEach((elem) => {
        if (elem === null) {
          isOk = false;
        }
      });
      return isOk;
    },
  },
};
</script>

<style scoped>
.el-input, .el-select {
  width: 100%
}
</style>

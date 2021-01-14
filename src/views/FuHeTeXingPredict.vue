<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="搜库法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-form-item label="年份：">
              <year-range-selector
                :begin-year.sync="sokuParams.beginYear"
                :end-year.sync="sokuParams.endYear"
                :expand="true">
              </year-range-selector>
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
            <el-form-item label="预测最大负荷：">
              <el-input clearable type="number" placeholder="请输入" v-model="sokuParams.maxPayload"/>
            </el-form-item>
            <el-form-item label="预测日电量：">
              <el-input clearable type="number" placeholder="请输入" v-model="sokuParams.dailyAmount"/>
            </el-form-item>
            <el-form-item label="Gamma 值：">
              <el-input clearable type="number" placeholder="请输入" v-model="sokuParams.gamma"/>
            </el-form-item>
            <el-form-item label="Beta 值：">
              <el-input clearable type="number" placeholder="请输入" v-model="sokuParams.beta"/>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="!sokuSubmittable" @click="sokuPredict">计算</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="sokuResultChart" typee="2nd" uid="sokuChart"></ResultChart>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="sokuTableData">
          <el-table-column prop="time" label="时间"/>
          <el-table-column prop="predictPayload" label="预期负荷"/>
          <el-table-column prop="actualPayload" label="实际负荷"/>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="双向夹逼法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="年份：">
                <year-range-selector
                  :begin-year.sync="clampParams.beginYear"
                  :end-year.sync="clampParams.endYear"
                  :expand="true">
              </year-range-selector>
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
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number"
                          placeholder="请输入" v-model="clampParams.maxPayload"></el-input>
              </el-form-item>
              <el-form-item label="预测日电量：">
                <el-input clearable type="number"
                          placeholder="请输入" v-model="clampParams.dailyAmount"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!clampSubmittable" @click="clampPredict">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="clampResultChart" typee="2nd" uid="clampChart"></ResultChart>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="clampTableData">
          <el-table-column prop="time" label="时间"/>
          <el-table-column prop="predictPayload" label="预期负荷"/>
          <el-table-column prop="actualPayload" label="实际负荷"/>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="分型插值法">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="年份：">
                <year-range-selector
                  :begin-year.sync="interpParams.beginYear"
                  :end-year.sync="interpParams.endYear"
                  :expand="true">
                </year-range-selector>
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
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number"
                          placeholder="请输入" v-model="interpParams.maxPayload"></el-input>
              </el-form-item>
              <el-form-item label="预测日电量：">
                <el-input clearable type="number"
                          placeholder="请输入" v-model="interpParams.dailyAmount"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!interpSubmittable" @click="interpPredict">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="1">
          <ResultChart ref="interpResultChart" typee="2nd" uid="interpChart"></ResultChart>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="interpTableData">
          <el-table-column prop="time" label="时间"/>
          <el-table-column prop="predictPayload" label="预期负荷"/>
          <el-table-column prop="actualPayload" label="实际负荷"/>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="年持续负荷曲线预测">
      <el-row>
        <el-col :span="8" :offset="1">
          <el-form label-width="124px">
            <el-row>
              <el-form-item label="年份：">
                <year-range-selector
                  :begin-year.sync="yearContParams.beginYear"
                  :end-year.sync="yearContParams.endYear"
                  :expand="true">
                </year-range-selector>
              </el-form-item>
              <el-form-item label="预测最大负荷：">
                <el-input clearable type="number"
                          placeholder="请输入" v-model="yearContParams.maxPayload"></el-input>
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
      <el-row>
        <el-table :data="yearContTableData">
          <el-table-column prop="time" label="时间"/>
          <el-table-column prop="payload" label="负荷"/>
        </el-table>
      </el-row>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import ResultChart from '@/components/ResultChart.vue';
import YearRangeSelector from '../components/YearRangeSelector.vue';

export default {
  name: 'FuHeTeXingPredict',
  components: { ResultChart, YearRangeSelector },
  data() {
    return {
      seasons: [
        {
          label: '春',
          value: 1,
        },
        {
          label: '夏',
          value: 2,
        },
        {
          label: '秋',
          value: 3,
        },
        {
          label: '冬',
          value: 4,
        },
      ],
      sokuParams: {
        beginYear: null,
        endYear: null,
        season: null,
        maxPayload: null,
        dailyAmount: null,
        gamma: null,
        beta: null,
      },
      sokuTableData: [],
      clampParams: {
        beginYear: null,
        endYear: null,
        season: null,
        maxPayload: null,
        dailyAmount: null,
      },
      clampTableData: [],
      interpParams: {
        beginYear: null,
        endYear: null,
        season: null,
        maxPayload: null,
        dailyAmount: null,
      },
      interpTableData: [],
      yearContParams: {
        beginYear: null,
        endYear: null,
        maxPayload: null,
      },
      yearContTableData: [],
    };
  },
  methods: {
    sokuPredict() {
      this.$axios.post('/payload/predict/dbquery', this.$data.sokuParams).then((response) => {
        this.$data.sokuTableData = response.data.data;
        this.$refs.sokuResultChart.graphData = response.data.data;
        this.$refs.sokuResultChart.params2nd = {
          xTag: 'time',
          yTag1st: 'actualPayload',
          yTag2nd: 'predictPayload',
          xName: '时间',
          yName: '负载',
          yName1st: '实际负载',
          yName2nd: '预期负载',
        };
        this.$refs.sokuResultChart.refreshChart2nd();
      });
    },
    clampPredict() {
      this.$axios.post('/payload/predict/clamping', this.$data.clampParams).then((response) => {
        this.$data.clampTableData = response.data.data;
        this.$refs.clampResultChart.graphData = response.data.data;
        this.$refs.clampResultChart.params2nd = {
          xTag: 'time',
          yTag1st: 'actualPayload',
          yTag2nd: 'predictPayload',
          xName: '时间',
          yName: '负载',
          yName1st: '实际负载',
          yName2nd: '预期负载',
        };
        this.$refs.clampResultChart.refreshChart2nd();
      });
    },
    interpPredict() {
      this.$axios.post('/payload/predict/interp', this.$data.interpParams).then((response) => {
        this.$data.interpTableData = response.data.data;
        this.$refs.interpResultChart.graphData = response.data.data;
        this.$refs.interpResultChart.params2nd = {
          xTag: 'time',
          yTag1st: 'actualPayload',
          yTag2nd: 'predictPayload',
          xName: '时间',
          yName: '负载',
          yName1st: '实际负载',
          yName2nd: '预期负载',
        };
        this.$refs.interpResultChart.refreshChart2nd();
      });
    },
    yearContPredict() {
      this.$axios.post('/payload/predict/yearly', this.$data.yearContParams).then((response) => {
        this.$data.yearContTableData = response.data.data;
        this.$refs.yearContResultChart.graphData = response.data.data;
        this.$refs.yearContResultChart.params1st = {
          xTag: 'time',
          yTag: 'payload',
          xName: '时间',
          yName: '负载',
        };
        this.$refs.yearContResultChart.refreshChart();
      });
    },
  },
  computed: {
    sokuSubmittable() {
      const param = this.$data.sokuParams;
      let isOk = true;
      [param.beginYear,
        param.endYear,
        param.season,
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

</style>

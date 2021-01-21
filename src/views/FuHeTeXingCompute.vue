<template>
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
        <el-table title='日负荷特性指标表' :data="dayTableData">
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
          <el-button>日负荷曲线</el-button>
          <el-button>典型日负荷曲线</el-button>
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
          <el-button>负荷特性曲线</el-button>
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
          <el-button>负荷曲线</el-button>
          <el-button v-print>打印</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ResultChart from '@/components/ResultChart.vue';

export default {
  name: 'FuHeTeXingCompute',
  components: { ResultChart },
  data() {
    return {
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
    dayDataRequest() {
      const params = this.$data.dayParams;
      const beginDay = params.dayRange[0];
      const endDay = params.dayRange[1];
      this.$axios.get('/payload/traits/daily', {
        params: {
          beginDay: beginDay.format('yyyyMMdd'),
          endDay: endDay.format('yyyyMMdd'),
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
          beginMonth: beginDay.format('yyyyMM'),
          endMonth: endDay.format('yyyyMM'),
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
  },
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 3em;
  }
</style>

<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11" :offset="1">
        <MutableForm wired-method="行业组合预测模型"
                     tag-type="MIX"
                     :graph-data.sync="graphData"
                     :table-one-data.sync="tableOneData"
                     :table-two-data.sync="tableTwoData"
                     :unit.sync="unit">
        </MutableForm>
      </el-col>
      <el-col :span="12">
        <el-row>
          <ResultChart ref="resultChart"></ResultChart>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <ResultTable ref="resultTable"></ResultTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MutableForm from '@/components/SelectForm/UglyNoHistoryMutableForm.vue';
import ResultChart from '@/components/MutableChart.vue';
import ResultTable from '@/components/MultipleResultTable.vue';

export default {
  name: 'IndustryMixPrediction',
  components: { ResultTable, ResultChart, MutableForm },
  data() {
    return {
      graphData: [],
      tableOneData: [],
      tableTwoData: [],
      unit: '',
    };
  },
  watch: {
    graphData(value) {
      console.log(value);
      this.$refs.resultChart.xName = '年份';
      this.$refs.resultChart.yName = '预测值';
      this.$refs.resultChart.xData = value.xData;
      this.$refs.resultChart.yData = value.yData;
      this.$refs.resultChart.refreshChart();
    },
    tableOneData(value) {
      this.$refs.resultTable.tableOneData = value;
    },
    tableTwoData(value) {
      const oldStyleTable = [];

      for (let i = 0; i < value.yData.length; i += 1) {
        let j = 0;
        value.yData[i].data.forEach((elem) => {
          oldStyleTable.push({
            year: value.xData[j],
            tag: value.yData[i].name,
            predict: elem,
          });
          j += 1;
        });
      }

      this.$refs.resultTable.tableTwoData = oldStyleTable;
    },
    unit(value) {
      this.$refs.resultChart.unit = value;
      this.$refs.resultTable.unit = value;
    },
  },
};
</script>

<style scoped>

</style>

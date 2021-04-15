<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11" :offset="1">
        <MutableForm wired-method="地区组合预测模型"
                              tag-type="MIX"
                              :graph-data.sync="graphData"
                              :table-one-data.sync="tableOneData"
                              :table-two-data.sync="tableTwoData">
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
import MutableForm from '@/components/SelectForm/NoHistoryMutableForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'PlaceMixPrediction',
  components: { ResultTable, ResultChart, MutableForm },
  data() {
    return {
      graphData: [],
      tableOneData: [],
      tableTwoData: [],
    };
  },
  watch: {
    graphData(value) {
      this.$refs.resultChart.graphData = value;
      this.$refs.resultChart.refreshChart();
    },
    tableOneData(value) {
      this.$refs.resultTable.tableOneData = value;
    },
    tableTwoData(value) {
      this.$refs.resultTable.tableTwoData = value;
    },
  },
};
</script>

<style scoped>

</style>

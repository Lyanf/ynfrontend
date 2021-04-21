<template>
  <div>
    <el-row>
      <el-col :span="11" :offset="1">
        <MutableForm
          :graph-data.sync="graphData"
          :table-one-data.sync="tableOneData"
          :table-two-data.sync="tableTwoData"
           wired-method="大用户法"
           tag-type="BIGUSER">
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
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';
import MutableForm from '@/components/SelectForm/MutableForm.vue';

export default {
  name: 'BigUserPrediction',
  components: { MutableForm, ResultTable, ResultChart },
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

<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11" :offset="1">
        <DynamicSelectForm type="payload" placeOrIndustry="place" longTerm
                           :graph-data.sync="graphData"
                           :table-one-data.sync="tableOneData"
                           :table-two-data.sync="tableTwoData"></DynamicSelectForm>
      </el-col>
      <el-col :span="12" >
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
import DynamicSelectForm from '@/components/SelectForm/DynamicRegionSelectForm.vue';

export default {
  name: 'LongTermMiduPredict',
  components: {
    ResultTable,
    ResultChart,
    DynamicSelectForm,
  },
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

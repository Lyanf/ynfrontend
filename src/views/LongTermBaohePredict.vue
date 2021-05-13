<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11" :offset="1">
        <MutableForm        tag-type="LONGTERM"
                           :graph-data.sync="graphData"
                           :table-one-data.sync="tableOneData"
                           :table-two-data.sync="tableTwoData"
                           :unit.sync="unit"
                            wired-method="饱和曲线法"></MutableForm>
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
  name: 'LongTermBaohePredict',
  components: {
    MutableForm,
    ResultTable,
    ResultChart,
  },
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
      this.$refs.resultChart.graphData = value;
      this.$refs.resultChart.refreshChart();
    },
    tableOneData(value) {
      this.$refs.resultTable.tableOneData = value;
    },
    tableTwoData(value) {
      this.$refs.resultTable.tableTwoData = value;
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

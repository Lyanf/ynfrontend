<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <PredictSelectForm placeOrIndustry="industry" ></PredictSelectForm>
      </el-col>
      <el-col :span="16">
        <el-row>
          <ResultChart></ResultChart>
        </el-row>
        <el-row>
          <ResultTable></ResultTable>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PredictSelectForm from '@/components/SelectForm/SinglePredictSelectForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'IndustrySinglePrediction',
  components: {
    ResultTable,
    ResultChart,
    PredictSelectForm,
  },
};
</script>

<style scoped>

</style>

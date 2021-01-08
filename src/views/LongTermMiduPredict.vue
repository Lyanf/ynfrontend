<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11">
        <PredictSelectForm placeOrIndustry="place" longTerm></PredictSelectForm>
      </el-col>
      <el-col :span="12" :offset="1">
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
  name: 'LongTermMiduPredict',
  components: {
    ResultTable,
    ResultChart,
    PredictSelectForm,
  },
};
</script>

<style scoped>

</style>

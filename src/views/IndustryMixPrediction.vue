<template>
  <div>
    <el-row>
      <el-col :span="11" :offset="1">
        <MixPredictSelectForm placeOrIndustry="industry"></MixPredictSelectForm>
      </el-col>
      <el-col :span="11" :offset="1">
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
import MixPredictSelectForm from '@/components/SelectForm/MixPredictSelectForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'IndustryMixPrediction',
  components: { ResultTable, ResultChart, MixPredictSelectForm },
};
</script>

<style scoped>

</style>

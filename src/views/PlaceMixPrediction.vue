<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11">
        <MixPredictSelectForm placeOrIndustry="place"></MixPredictSelectForm>
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
import MixPredictSelectForm from '@/components/SelectForm/MixPredictSelectForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'PlaceMixPrediction',
  components: { ResultTable, ResultChart, MixPredictSelectForm },
};
</script>

<style scoped>

</style>

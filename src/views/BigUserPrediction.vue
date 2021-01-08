<template>
  <el-row>
    <el-col :span="10">
      <BigUserPredictSelectForm/>
    </el-col>
    <el-col :span="10" :offset="1">
      <el-row>
        <ResultChart></ResultChart>
      </el-row>
      <el-row>
        <ResultTable></ResultTable>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import BigUserPredictSelectForm from '@/components/SelectForm/BigUserPredictSelectForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'BigUserPrediction',
  components: { ResultTable, ResultChart, BigUserPredictSelectForm },
};
</script>

<style scoped>

</style>

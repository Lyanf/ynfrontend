<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="11">
        <DynamicSelectForm></DynamicSelectForm>
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
import DynamicSelectForm from '@/components/SelectForm/DynamicSelectForm.vue';
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'IndustrySinglePrediction',
  components: {
    ResultTable,
    ResultChart,
    DynamicSelectForm,
  },
};
</script>

<style scoped>

</style>

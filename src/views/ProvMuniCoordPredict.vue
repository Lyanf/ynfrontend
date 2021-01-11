<template>
  <div>
    <el-row>
      <el-col :span="7">
        <ProvMuniPredictSelectForm></ProvMuniPredictSelectForm>
      </el-col>
      <el-col :span="16" :offset="1">
        <el-form>
          <el-form-item>
            <el-table title="历史年份协调预测误差校核">
              <el-table-column label="时间"></el-table-column>
              <el-table-column label="地区"></el-table-column>
              <el-table-column label="协调前预测值（MW）"></el-table-column>
              <el-table-column label="协调前预测误差"></el-table-column>
              <el-table-column label="协调后预测值"></el-table-column>
              <el-table-column label="协调后预测误差"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button v-on:click="exportErrorSheet">误差表格导出</el-button>
          </el-form-item>
          <el-form-item>
            <el-table title="预测年份的协调预测结果">
              <el-table-column label="时间"></el-table-column>
              <el-table-column label="地区"></el-table-column>
              <el-table-column label="协调前预测值（MW）"></el-table-column>
              <el-table-column label="协调后预测值"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button v-on:click="exportResultSheet">结果表格导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProvMuniPredictSelectForm from '@/components/SelectForm/ProvMuniPredictSelectForm.vue';

export default {
  name: 'ProvMuniCoordPredict',
  components: { ProvMuniPredictSelectForm },
};
</script>

<style scoped>

</style>

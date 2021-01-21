<template>
  <div>
    <el-row>
      <el-col :span="8">
        <ProvMuniPredictSelectForm
        :table-three-data.sync="tableThreeData"
        :table-four-data.sync="tableFourData">
        </ProvMuniPredictSelectForm>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-form>
          <el-form-item label="历史年份协调预测误差校核：">
            <el-table :data="tableThreeData">
              <el-table-column label="年份" prop="year"></el-table-column>
              <el-table-column label="地区" prop="region"></el-table-column>
              <el-table-column label="协调前预测值" prop="predictValueBefore"></el-table-column>
              <el-table-column label="协调前预测误差" prop="predictErrorBefore"></el-table-column>
              <el-table-column label="协调后预测值" prop="predictValueAfter"></el-table-column>
              <el-table-column label="协调后预测误差" prop="predictErrorAfter"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button @click="exportErrorSheet">导出历史误差表</el-button>
          </el-form-item>
          <el-form-item label="预测年份的协调预测结果：">
            <el-table :data="tableFourData">
              <el-table-column label="年份" prop="year"></el-table-column>
              <el-table-column label="地区" prop="region"></el-table-column>
              <el-table-column label="协调前预测值" prop="predictBefore"></el-table-column>
              <el-table-column label="协调后预测值" prop="predictAfter"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button @click="exportResultSheet">导出预测结果表</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProvMuniPredictSelectForm from '@/components/SelectForm/ProvMuniPredictSelectForm.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'ProvMuniCoordPredict',
  data() {
    return {
      tableThreeData: [],
      tableFourData: [],
    };
  },
  methods: {
    exportTableSheet(rawData, fields) {
      const data = json2csv.parse(rawData, {
        fields,
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, 'database.csv');
    },
    exportErrorSheet() {
      this.exportTableSheet(this.$data.tableThreeData,
        [
          'year',
          'region',
          'predictValueBefore',
          'predictErrorBefore',
          'predictValueAfter',
          'predictErrorAfter',
        ]);
    },
    exportResultSheet() {
      this.exportTableSheet(this.$data.tableFourData,
        [
          'year',
          'region',
          'predictBefore',
          'predictAfter',
        ]);
    },
  },
  components: { ProvMuniPredictSelectForm },
};
</script>

<style scoped>

</style>

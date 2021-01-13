<template>
  <el-form>
    <el-form-item label="评价指标表：">
      <el-table :data="tableOneData">
        <el-table-column prop="index" label="评价指标"></el-table-column>
        <el-table-column prop="r2" label="R2"></el-table-column>
        <el-table-column prop="mape" label="MAPE"></el-table-column>
        <el-table-column prop="rmse" label="RMSE"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="exportTableOneSheet"
                 :disabled="tableOneData.length === 0">导出评价指标表</el-button>
    </el-form-item>
    <el-form-item label="年份 − 预测值表：">
      <el-table :data="tableTwoData">
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="predict" label="预测值（MVW）"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="exportTableTwoSheet"
                 :disabled="tableTwoData.length === 0">导出预测结果表</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'ResultTable',
  data() {
    return {
      tableOneData: [],
      tableTwoData: [],
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
    exportTableOneSheet() {
      this.exportTableSheet(this.$data.tableOneData, ['index', 'r2', 'mape', 'rmse']);
    },
    exportTableTwoSheet() {
      this.exportTableSheet(this.$data.tableTwoData, ['year', 'predict']);
    },
  },
};
</script>

<style scoped>

</style>

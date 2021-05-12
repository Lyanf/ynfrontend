<template>
  <el-form>
    <el-form-item label="评价指标表："
                  v-if="nomapermse === undefined && tableOneData.length !== 0">
      <el-table :data="tableOneData">
<!--        <el-table-column prop="index" label="评价指标"></el-table-column>-->
<!--        <el-table-column prop="r2" label="R2"></el-table-column>-->
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="mape" label="MAPE（%）">
          <template slot-scope="scope">
            {{scope.row.mape.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="rmse" label="RMSE">
          <template slot-scope="scope">
            {{scope.row.rmse.toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="nomapermse === undefined && tableOneData.length !== 0">
      <el-button @click="exportTableOneSheet">导出评价指标表</el-button>
    </el-form-item>
    <el-form-item label="年份 − 预测值表：" v-if="tableTwoData.length !== 0">
      <el-table :data="tableTwoData">
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="tag" label="方案"></el-table-column>
        <el-table-column prop="predict" label="预测值（MW）">
          <template slot-scope="scope">
            {{scope.row.predict.toFixed(0) }}
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item v-if="tableTwoData.length !== 0">
      <el-button @click="exportTableTwoSheet">导出预测结果表</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'ResultTable',
  props: ['nomapermse'],
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
      saveAs(blob, '预测结果表.csv');
    },
    exportTableOneSheet() {
      this.exportTableSheet(this.$data.tableOneData, ['name', 'mape', 'rmse']);
    },
    exportTableTwoSheet() {
      this.exportTableSheet(this.$data.tableTwoData, ['year', 'tag', 'predict']);
    },
  },
};
</script>

<style scoped>

</style>

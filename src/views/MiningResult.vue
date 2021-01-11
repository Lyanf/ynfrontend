<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-form>
          <el-form-item label="方案选择：">
            <el-select multiple v-model="selectedPlans" placeholder="请选择">
              <el-option
                v-for="item in miningResults"
                :key="item.plan"
                :label="item.plan"
                :value="item.plan">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateTableDisplay"
            :disabled="selectedPlans.length === 0">确定</el-button>
            <el-button v-on:click="exportTableSheet"
                       :disabled="displayTable.length === 0">表格导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-table :data="displayTable">
          <el-table-column prop="planName" label="方案"></el-table-column>
          <el-table-column prop="factors" label="挖掘结果"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'MiningResult',
  data() {
    return {
      selectedPlans: [],
      miningResults: [],
      displayTable: [],
    };
  },
  mounted() {
    this.loadMiningResults();
  },
  methods: {
    loadMiningResults() {
      this.$axios.get('/mining/results').then((response) => {
        this.$data.miningResults = response.data.data;
      });
    },
    updateTableDisplay() {
      this.$data.displayTable = [];
      this.$data.selectedPlans.forEach((planName) => {
        console.log(planName);
        this.$data.miningResults.forEach((line) => {
          console.log(line);
          if (line.plan === planName) {
            this.$data.displayTable.push({
              planName,
              factors: line.results.join('、'),
            });
          }
        });
      });
    },
    exportTableSheet() {
      const data = json2csv.parse(this.$data.tableData, {
        fields: ['method', 'miningResult'],
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, 'mining_result.csv');
    },
  },
};
</script>

<style scoped>

</style>

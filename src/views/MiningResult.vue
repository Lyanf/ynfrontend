<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="3">
        <el-form>
          <el-form-item label="方案选择">
            <el-select value=""></el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">确定</el-button>
            <el-button v-on:click="exportTableSheet">表格导出</el-button>
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-table :data="tableData">
          <el-table-column prop="method" label="方案"></el-table-column>
          <el-table-column prop="miningResult" label="挖掘结果"></el-table-column>
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
      tableData: [
        {
          method: '方法一',
          miningResult: '挖掘结果一',
        },
        {
          method: '方法二',
          miningResult: '挖掘结果二',
        },
        {
          method: '方法三',
          miningResult: '挖掘结果三',
        },
      ],
    };
  },
  methods: {
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

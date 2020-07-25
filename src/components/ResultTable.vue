<template>
  <div>
    <el-row>
      <el-table>
        <el-table-column label="评价指标"></el-table-column>
        <el-table-column label="R2"></el-table-column>
        <el-table-column label="MAPE"></el-table-column>
        <el-table-column label="RMSE"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-table>
        <el-table-column label="年份"></el-table-column>
        <el-table-column label="预测值(MVW)"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ResultTable',
};
</script>

<style scoped>

</style>

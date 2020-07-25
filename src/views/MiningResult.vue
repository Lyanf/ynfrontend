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
            <el-button>表格导出</el-button>
          </el-form-item>

        </el-form>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-table>
          <el-table-column prop="method" label="方案"></el-table-column>
          <el-table-column prop="miningResult" label="挖掘结果"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MiningResult',
};
</script>

<style scoped>

</style>

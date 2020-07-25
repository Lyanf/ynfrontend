<template>
  <el-form label-position="left" label-width="10%">
    <el-form-item label="已有方案:">
      <el-select value=""></el-select>
    </el-form-item>
    <el-form-item label="新名称:">
      <el-input value=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UpdateSchema',
};
</script>

<style scoped>
  .el-select,.el-input{
    width: 50%;
  }
</style>

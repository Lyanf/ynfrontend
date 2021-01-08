<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="已有方案">
      <el-select value=""></el-select>
    </el-form-item>
    <el-form-item label="新建方案">
      <el-input value=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">新建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CreateNewSchema',
};
</script>

<style scoped>
  .el-select,.el-input{
    width: 60%;
  }
</style>

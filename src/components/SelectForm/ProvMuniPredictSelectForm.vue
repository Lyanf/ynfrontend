<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="省级负荷预测方案选择：">
      <el-select placeholder="请选择"></el-select>
    </el-form-item>
    <el-form-item label="地级市负荷预测方案选择：">
      <el-button>批量导入</el-button>
    </el-form-item>

    <el-form-item v-for='item in $data.municipals' :key="item.key" :label="(item.key + '：')">
      <el-select placeholder="请选择"></el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ProvMuniPredictSelectForm',
  data() {
    return {
      municipals: [{
        key: '昆明市',
        value: undefined,
      }, {
        key: '保山市',
        value: undefined,
      }, {
        key: '楚雄州',
        value: undefined,
      }, {
        key: '迪庆州',
        value: undefined,
      }, {
        key: '玉溪市',
        value: undefined,
      }, {
        key: '怒江州',
        value: undefined,
      }, {
        key: '曲靖市',
        value: undefined,
      }, {
        key: '丽江市',
        value: undefined,
      }, {
        key: '昭通市',
        value: undefined,
      }, {
        key: '德宏州',
        value: undefined,
      }, {
        key: '红河州',
        value: undefined,
      }, {
        key: '普洱州',
        value: undefined,
      }, {
        key: '文山州',
        value: undefined,
      }, {
        key: '临沧市',
        value: undefined,
      }, {
        key: '大理州',
        value: undefined,
      }, {
        key: '西双版纳州',
        value: undefined,
      }],
    };
  },
};
</script>

<style scoped>

</style>

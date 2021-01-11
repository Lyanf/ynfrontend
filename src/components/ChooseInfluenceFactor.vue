<template>
  <el-transfer
    filterable
    filter-placeholder="输入以查找"
    v-model="chosenFactors"
    :data="originalFactors"
    :titles="['待选择影响因素', '已选择影响因素']"
    @change="show" style="height: 100%"
  >
  </el-transfer>
</template>

<script>
export default {
  name: 'ChooseInfluenceFactor',
  data() {
    return {
      chosenFactors: [],
      originalFactors: [],
      // [
      //   {
      //     label: '人均GDP',
      //     key: '人均GDP',
      //   }, ...
      // ],
    };
  },
  methods: {
  },
};
</script>

<style scoped>

</style>

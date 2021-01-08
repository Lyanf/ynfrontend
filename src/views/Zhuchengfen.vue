<template>
  <el-row>
    <el-col :span="3">
      <el-form label-position="top">
        <el-form-item label="系数绝对值阈值：">
          <el-input></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary">挖掘</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :offset="2" :span="12">
      <ChooseInfluenceFactor></ChooseInfluenceFactor>
    </el-col>
  </el-row>
</template>

<script>
import ChooseInfluenceFactor from '@/components/ChooseInfluenceFactor.vue';

export default {
  name: 'Zhuchengfen',
  components: { ChooseInfluenceFactor },
};
</script>

<style scoped>

</style>

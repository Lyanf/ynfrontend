<template>
  <el-row >
    <el-col style="height: 100%" :offset="4" :span="12">
      <el-row>
      <ChooseInfluenceFactor></ChooseInfluenceFactor>
      </el-row>
      <el-row style="margin-top: 5em">
        <span >挖掘结果</span>
      </el-row>
      <el-row style="margin-top: 2em" >
        <el-tag >第一产业产值</el-tag>
        <el-divider direction="vertical"></el-divider>

        <el-tag >GDP</el-tag>
        <el-divider direction="vertical"></el-divider>

        <el-tag>第二产业产值</el-tag>
      </el-row>
    </el-col>
    <el-col :span="6">
      <SelectMiningMethod>
      </SelectMiningMethod>
    </el-col>
  </el-row>
</template>

<script>
import ChooseInfluenceFactor from '@/components/ChooseInfluenceFactor.vue';
import SelectMiningMethod from '@/components/SelectMiningMethod.vue';

export default {
  name: 'DataMining',
  components: {
    SelectMiningMethod,
    ChooseInfluenceFactor,
  },
};
</script>

<style scoped>

</style>

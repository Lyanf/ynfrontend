<template>
  <el-row>
    <el-col :span="8">
      <BigUserPredictSelectForm/>
    </el-col>
  </el-row>
</template>

<script>
import BigUserPredictSelectForm from '@/components/SelectForm/BigUserPredictSelectForm.vue';

export default {
  name: 'BigUserPrediction',
  components: { BigUserPredictSelectForm },
};
</script>

<style scoped>

</style>

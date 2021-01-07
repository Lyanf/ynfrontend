<template>
  <el-dialog :visible="displayLoading"
             width="30%" title="正在加载" :show-close=false>请稍等片刻。</el-dialog>
</template>

<script>
export default {
  name: 'LoadingView',
  computed: {
    displayLoading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>

<style scoped>
</style>

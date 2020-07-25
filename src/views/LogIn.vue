<template>
  <el-row type="flex" justify="center" style="margin-top: 10%">
    <LogInDialog></LogInDialog>
  </el-row>
</template>

<script>
import LogInDialog from '@/components/LogInDialog.vue';

export default {
  name: 'LogIn',
  components: { LogInDialog },
};
</script>

<style scoped>

</style>

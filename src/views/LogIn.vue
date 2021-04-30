<template>
  <div class="wrapper" style="margin: 0px">
    <div class="section" style="text-align: center">
      <img src="../assets/title.png" style="width: 70%; margin: 0px">
    </div>
    <el-row class="section" type="flex" justify="center">
      <LogInDialog></LogInDialog>
    </el-row>
    <div class="footer" style="text-align: center; margin: 0px">
      上海交通大学大数据工程技术研究中心 © 2021
    </div>
  </div>
</template>

<script>
import LogInDialog from '@/components/LogInDialog.vue';

export default {
  name: 'LogIn',
  components: { LogInDialog },
};
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 80%;
}

.section {
  flex: 1;
}

.footer {
  flex: 0;
  height: 10%;
  background-color: #71c0fa;
  color: black;
}
</style>

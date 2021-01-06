<template>
  <div style="width: 600px">
    <el-card>
      <span slot="header">
        <span>登录状态</span>
      </span>
      <el-row type="flex" justify="center">
        <span :style=loginStateStyle>{{loginStateText}}</span>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-button v-on:click="dialogVisible=true">登录</el-button>
        <el-button v-on:click="$store.commit('logout')">注销</el-button>
      </el-row>
    </el-card>
    <el-dialog
      title="登录"
      :visible.sync="dialogVisible"
      width="30%">
      <span>用户名</span>
      <el-input v-model="username">
      </el-input>
      <span>密码</span>
      <el-input v-model="password" type="password">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="realLogInClicked">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LogInDialog',
  data() {
    return {
      dialogVisible: false,
      username: '',
      password: '',
    };
  },
  computed: {
    loginStateText() {
      return this.$store.state.isLogin ? '已登录' : '未登录';
    },
    loginStateStyle() {
      return `color: ${this.$store.state.isLogin ? 'green' : 'red'}`;
    },
  },
  methods: {
    realLogInClicked() {
      this.dialogVisible = false;
      // TEST: always login success
      this.$store.commit('login');
    },
  },
};
</script>

<style scoped>
.el-row{
  margin-top: 40px;
}
</style>

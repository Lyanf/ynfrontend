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
        <el-button type="primary" v-on:click="dialogVisible=true">{{loginButtonText}}</el-button>
        <el-button type="danger" v-on:click="logOut"
                   :disabled="logoutButtonDisabled">注销</el-button>
      </el-row>
    </el-card>
    <el-dialog @close="clearInput"
      title="登录"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form>
        <el-form-item label="用户名">
          <el-input clearable v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            clearable v-model="password" type="password" @keyup.enter.native="realLogInClicked">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="realLogInClicked"
               :disabled="username.length === 0 || password.length === 0">确定</el-button>
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
    logoutButtonDisabled() {
      return !this.$store.state.isLogin;
    },
    loginButtonText() {
      return this.$store.state.isLogin ? '切换用户' : '登录';
    },
  },
  methods: {
    logOut() {
      this.$store.commit('switchVersion', null);
      this.$store.commit('logout');
      this.$axios.post('/logout').then((response) => {
        console.log(response);
        this.$messenger.success('注销成功。');
      });
    },
    realLogInClicked() {
      if (this.$data.username.length === 0 || this.$data.password.length === 0) {
        return;
      }
      this.dialogVisible = false;
      this.$axios.post('login', {
        username: this.$data.username,
        password: this.$data.password,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('登录成功。');
        this.$store.commit('login');
      }).catch((error) => {
        console.log(error);
        this.$store.commit('logout');
      });
    },
    clearInput() {
      this.$data.username = '';
      this.$data.password = '';
    },
  },
};
</script>

<style scoped>
.el-row {
  margin-top: 40px;
}
</style>

<template>
  <div style="width: 600px">
    <el-card>
      <span slot="header">
        <span>登录状态</span>
      </span>
      <el-row type="flex" justify="center">
        <span style="color: red">{{logInStatus}}</span>
      </el-row>
      <el-row type="flex" justify="space-around">
        <el-button v-on:click="dialogVisible=true">登录</el-button>
        <el-button>注销</el-button>
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
      logInStatus: '未登录',
    };
  },
  methods: {
    realLogInClicked() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-row{
  margin-top: 40px;
}
</style>

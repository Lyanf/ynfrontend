<template>
  <div class="about">
    <h1>这里是关于页面。</h1>
    <h2>有一些很危险的操作。</h2>
    <el-form>
      <el-form-item>
        <el-button type="danger" @click="removeAllData">删除所有数据</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="removeWenHonglinData">删除「温洪林博士」的数据</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="initializeDatabase">初始化数据库</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    refreshPage() {
      this.$router.go(0);
    },
    removeAllData() {
      this.$confirm('删除数据之后无法恢复。确定要删除所有数据，但保留元数据吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.post('/danger/remove/all/data').then(() => {
          this.refreshPage();
          this.$messenger.success('清除所有数据成功。');
        });
      });
    },
    removeWenHonglinData() {
      this.$confirm('删除这部分数据之后无法恢复。确定要删除「温洪林博士」的数据吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.post('/danger/remove/whl/data').then(() => {
          this.refreshPage();
          this.$messenger.success('清除「温洪林博士」的数据成功。');
        });
      });
    },
    initializeDatabase() {
      this.$confirm('这将删除数据库中所有数据及二级元数据。确定要这样做吗？', '严重警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.post('/danger/init/db').then(() => {
          this.refreshPage();
          this.$messenger.success('数据库初始化成功。');
        });
      });
    },
  },
};
</script>

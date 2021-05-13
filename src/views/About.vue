<template>
  <div class="about">
    <h1>这里是关于页面。</h1>
    <h2>有一些很危险的操作。</h2>
    <el-form inline label-position="right" label-width="auto">
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
    <el-form inline label-position="right" label-width="auto">
      <el-form-item v-for="item in algorithms" :key="item" :label="item + '：'">
        <el-checkbox></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      algorithms: ['逐步回归模型', '灰色滑动平均模型', '分数阶灰色模型',
        '改进的滚动机理灰色预测', '高斯混合回归模型', '模糊线性回归模型',
        '模糊指数平滑模型', '梯度提升模型', '支持向量机模型', '循环神经网络模型',
        '长短期神经网络模型', '扩展索洛模型', '分位数回归模型', '分行业典型日负荷曲线叠加法',
        '负荷最大利用小时数模型', '季节趋势模型', '考虑温度和节假日分布影响的电量预测模型',
        '一元线性函数', '一元二次函数', '幂函数', '生长函数', '指数函数', '对数函数', '二元一次函数'],
    };
  },
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

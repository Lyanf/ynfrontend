<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="已有版本">
      <el-select placeholder="请选择" v-model="currentSchema">
        <el-option v-for="item in schemas"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
        @click="switchSchema"
        :disabled="currentSchema === undefined">
        切换
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ReadSchema',
  data() {
    return {
      schemas: [],
      currentSchema: undefined,
    };
  },
  mounted() {
    this.loadSchema();
  },
  methods: {
    loadSchema() {
      this.$axios.get('/schema/query').then((response) => {
        this.$data.schemas = response.data.data;
      });
    },
    switchSchema() {
      this.$store.commit('switchVersion', this.$data.currentSchema);
      this.$messenger.success(`已切换到 ${this.$data.currentSchema} 版本。`);
    },
  },
};
</script>

<style scoped>
  .el-select,.el-input{
    width: 60%;
  }
</style>

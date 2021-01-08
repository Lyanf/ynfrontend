<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="已有方案">
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
        @click="viewSchema"
        :disabled="currentSchema === undefined">
        查看
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
    this.loadSchemas();
  },
  methods: {
    loadSchemas() {
      this.$axios.get('/schema/query').then((response) => {
        this.$data.schemas = response.data.data;
      });
    },
    viewSchema() {
      console.log('view it');
    },
  },
};
</script>

<style scoped>
  .el-select,.el-input{
    width: 60%;
  }
</style>

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
      <el-button type="danger"
         @click="deleteSchema"
        :disabled="currentSchema === undefined">
        删除
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DeleteSchema',
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
    deleteSchema() {
      if (this.$data.currentSchema === undefined) {
        return;
      }
      this.$axios.post('/schema/delete', {
        DeleteSchema: this.$data.currentSchema,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('删除版本成功。');
        if (this.$store.state.currentVersion === this.$data.currentSchema) {
          this.$store.commit('switchVersion', undefined);
        }
        this.$data.currentSchema = undefined;
        this.loadSchemas();
      });
    },
  },
};
</script>

<style scoped>
  .el-select,.el-input{
    width: 60%;
  }
</style>

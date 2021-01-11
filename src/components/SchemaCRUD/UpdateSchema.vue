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
    <el-form-item label="新名称">
      <el-input v-model="newSchemaName"
                @keyup.enter.native="renameSchema"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="currentSchema === undefined || newSchemaName.length === 0"
                 @click="renameSchema">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UpdateSchema',
  data() {
    return {
      schemas: [],
      currentSchema: undefined,
      newSchemaName: '',
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
    renameSchema() {
      if (this.$data.currentSchema === undefined || this.$data.newSchemaName.length === 0) {
        return;
      }
      this.$axios.post('/schema/rename', {
        currentSchema: this.$data.currentSchema,
        newSchemaName: this.$data.newSchemaName,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('修改版本成功。');
        if (this.$store.state.currentVersion === this.$data.currentSchema) {
          this.$store.commit('switchVersion', this.$data.newSchemaName);
        }
        this.$data.currentSchema = this.$data.newSchemaName;
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

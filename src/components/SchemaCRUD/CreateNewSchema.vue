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
    <el-form-item label="新建版本">
      <el-input v-model="newSchemaName"
                @keyup.enter.native="createNewSchema"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
      :disabled="currentSchema === undefined || newSchemaName.length === 0"
      @click="createNewSchema">
        新建
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CreateNewSchema',
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
    createNewSchema() {
      if (this.$data.currentSchema === undefined || this.$data.newSchemaName.length === 0) {
        return;
      }
      this.$axios.post('/schema/create', {
        CurrentSchema: this.$data.currentSchema,
        NewSchemaName: this.$data.newSchemaName,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('创建版本成功。');
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

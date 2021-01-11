<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="新建版本">
      <el-input v-model="newSchemaName"
                @keyup.enter.native="createNewSchema"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
      :disabled="newSchemaName.length === 0"
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
      newSchemaName: '',
    };
  },
  methods: {
    createNewSchema() {
      if (this.$data.newSchemaName.length === 0) {
        return;
      }
      this.$axios.post('/schema/create', {
        newSchemaName: this.$data.newSchemaName,
      }).then((response) => {
        console.log(response);
        this.$store.commit('switchVersion', this.$data.newSchemaName);
        this.$messenger.success(`已创建并切换到版本 ${this.$data.newSchemaName}`);
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

<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="上传文件">
      <el-upload
        :show-file-list="true"
        :multiple="true"
        :on-success="onSuccess"
        :on-error="onFailure"
        :action="uploadURL"
      >
        <el-button type="primary">上传</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="autoCreate">自动创建不存在的元数据节点</el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UploadDataBase',
  data() {
    return {
      autoCreate: false,
    };
  },
  computed: {
    uploadURL() {
      if (this.$data.autoCreate) {
        return `${this.$axios.defaults.baseURL}/db/upload/autocreate`;
      }
      return `${this.$axios.defaults.baseURL}/db/upload`;
    },
  },
  methods: {
    onSuccess(_, file) {
      this.$messenger.success(`上传「${file.name}」成功。`);
    },
    onFailure(_, file) {
      this.$messenger.error(`上传「${file.name}」失败。`);
    },
  },
};
</script>

<style scoped>

</style>

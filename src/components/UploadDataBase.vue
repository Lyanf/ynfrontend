<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="上传文件">
      <el-upload
        style="display: inline"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onFailure"
        :before-upload="beforeUpload"
        :action="uploadURL"
      >
        <el-button type="primary" :disabled="!enabledUploadButton">上传</el-button>
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
      enabledUploadButton: true,
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
    onSuccess() {
      this.$data.enabledUploadButton = true;
      this.$messenger.success('上传成功。');
    },
    onFailure() {
      this.$data.enabledUploadButton = true;
      this.$messenger.error('上传失败。');
    },
    beforeUpload() {
      this.$data.enabledUploadButton = false;
    },
  },
};
</script>

<style scoped>

</style>

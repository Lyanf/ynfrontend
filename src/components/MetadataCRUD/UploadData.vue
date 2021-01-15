<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="上传文件">
      <el-upload
        style="display: inline"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onFailure"
        :before-upload="beforeUpload"
        :action="baseURL + '/db/metadata/upload'"
      >
        <el-button type="primary" :disabled="!enabledUploadButton">上传</el-button>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'UploadData',
  data() {
    return {
      enabledUploadButton: true,
    };
  },
  computed: {
    baseURL() {
      return this.$axios.defaults.baseURL;
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

<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="节点路径">
      <el-cascader v-model="path"
                   change-on-select
                   :options="metaDataTree"
                   @keyup.enter.native="deleteNode"
                   placeholder="请选择"></el-cascader>
    </el-form-item>
    <el-form-item>
      <div style="font-size: 12px">
        {{promptText}}
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="danger"
                 :disabled="path.length < 2"
                 @click="deleteNode">
        删除
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DeleteNode',
  data() {
    return {
      metaDataTree: [],
      path: [],
      name: '',
    };
  },
  mounted() {
    this.loadMetadata();
  },
  computed: {
    promptText() {
      if (this.$data.path.length === 0) {
        return '请指定要删除的节点。';
      }
      if (this.$data.path.length === 1) {
        return '不可以删除根节点。';
      }
      return `节点「${this.$data.path.join(' → ')}」将被删除。`;
    },
  },
  methods: {
    deleteNode() {
      if (this.$data.path.length < 2) {
        return;
      }
      this.$axios.post('/db/metadata/delete', {
        path: this.$data.path,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('元数据节点删除成功。');
        this.loadMetadata();
      });
    },
    loadMetadata() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.metaDataTree = response.data.data;
      });
    },
  },
};
</script>

<style scoped>
.el-select, .el-input, .el-cascader {
  width: 60%;
}
</style>

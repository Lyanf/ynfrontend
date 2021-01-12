<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="节点路径">
      <el-cascader v-model="path"
                   change-on-select
                   :options="metaDataTree"
                   @keyup.enter.native="renameNode"
                   placeholder="请选择"></el-cascader>
    </el-form-item>
    <el-form-item label="新名称">
      <el-input v-model="name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <div style="font-size: 12px">
        {{promptText}}
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="name.length === 0 || path.length < 2"
                 @click="renameNode">
        重命名
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'RenameNode',
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
        return '请指定要重新命名的节点。';
      }
      if (this.$data.path.length === 1) {
        return '不可以对根节点更名。';
      }
      if (this.$data.name.length === 0) {
        return '请填写新节点名称。';
      }
      const newList = [...this.$data.path];
      newList.pop();
      newList.push(this.$data.name);
      return `节点将被重新命名为「${newList.join(' → ')}」。`;
    },
  },
  methods: {
    renameNode() {
      if (this.$data.path.length < 2 || this.$data.name.length === 0) {
        return;
      }
      this.$axios.post('/db/metadata/rename', {
        path: this.$data.path,
        name: this.$data.name,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('元数据节点更名成功。');
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

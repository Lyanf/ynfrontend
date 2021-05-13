<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="父节点">
      <el-cascader v-model="path"
                   :options="metaDataTree"
                   change-on-select
                @keyup.enter.native="createNewNode"
                placeholder="请选择"></el-cascader>
    </el-form-item>
    <el-form-item label="节点名称">
      <el-input clearable v-model="name" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="数据单位" v-if="path.length === 2">
      <el-input clearable v-model="unit" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <div style="font-size: 12px">
        {{promptText}}
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="name.length === 0 || path.length > 2"
                 @click="createNewNode">
        新建
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CreateNewNode',
  data() {
    return {
      metaDataTree: [],
      path: [],
      name: '',
      unit: '',
    };
  },
  mounted() {
    this.loadMetadata();
  },
  computed: {
    promptText() {
      if (this.$data.path.length === 0) {
        return '请指定要插入节点的父节点。';
      }
      if (this.$data.path.length > 2) {
        return '只能插入一级或二级节点。';
      }
      if (this.$data.name.length === 0) {
        return '请填写新节点名称。';
      }
      return `新节点将被插入到「${this.$data.path.join(' → ')} → ${this.$data.name}」。`;
    },
  },
  methods: {
    createNewNode() {
      if (this.$data.path.length === 0 || this.$data.name.length === 0) {
        return;
      }
      this.$axios.post('/db/metadata/create', {
        path: this.$data.path,
        name: this.$data.name,
        unit: this.$data.unit,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('元数据节点添加成功。');
        this.loadMetadata();
      });
    },
    loadMetadata() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.metaDataTree = [{
          value: '根节点',
          label: '根节点',
          children: response.data.data,
        }];
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

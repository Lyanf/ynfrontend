<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="已有版本">
      <el-select placeholder="请选择" v-model="currentSchema">
        <el-option v-for="item in schemas"
                   :key="item.tag"
                   :value="item.tag">
          <span style="float: left">{{ item.tag }}</span>
          <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新名称">
      <el-input clearable v-model="newSchemaName"
                @keyup.enter.native="renameSchema"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="currentSchema === null || newSchemaName.length === 0"
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
      currentSchema: null,
      newSchemaName: '',
      typeName: {
        MINING: '数据挖掘方案',
        STATIC_REGIONAL: '地区单预测方案',
        DYNAMIC_INDUSTRIAL: '行业单预测方案',
        MIX: '组合预测方案',
        LONGTERM: '远期规划预测方案',
        BIGUSER: '大用户预测方案',
        SOKU: '负荷特性预测方案',
        CLAMP: '负荷特性预测方案',
        INTERP: '负荷特性预测方案',
        YEARCONT: '负荷特性预测方案',
      },
    };
  },
  mounted() {
    this.loadSchema();
  },
  methods: {
    loadSchema() {
      this.$axios.get('/tags/query').then((response) => {
        this.$data.schemas = response.data.data;
      });
    },
    renameSchema() {
      if (this.$data.currentSchema === null || this.$data.newSchemaName.length === 0) {
        return;
      }
      this.$axios.post('/tags/rename', {
        tag: this.$data.currentSchema,
        newTag: this.$data.newSchemaName,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('修改方案标签成功。');
        this.$data.currentSchema = this.$data.newSchemaName;
        this.loadSchema();
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

<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="已有版本">
      <el-select placeholder="请选择" v-model="currentSchema">
        <el-option v-for="item in schemas"
                   :key="item.id"
                   :value="item.id">
          <span style="float: left">{{ item.id }}</span>
          <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="danger"
         @click="deleteSchema"
        :disabled="currentSchema === null">
        删除
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DeleteSchema',
  data() {
    return {
      schemas: [],
      currentSchema: null,
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
    deleteSchema() {
      if (this.$data.currentSchema === null) {
        return;
      }
      this.$axios.post('/tags/delete', {
        tag: this.$data.currentSchema,
      }).then((response) => {
        console.log(response);
        this.$messenger.success('删除方案标签成功。');
        this.$data.currentSchema = null;
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

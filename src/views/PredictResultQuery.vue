<template>
  <div>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-form>
          <el-form-item label="方案标签：">
            <el-select v-model="selectedTag">
              <el-option v-for="item in knownTags"
                         :key="item.tag"
                         :value="item.tag">
                <span style="float: left">{{ item.tag }}</span>
                <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="selectedTag === null"
                       @click="preformQuery">查询</el-button>
          </el-form-item>
          <el-form-item label="方案参数：" v-if="jsonContent !== undefined" />
          <json-viewer v-if="jsonContent !== undefined" :value="jsonContent" copyable></json-viewer>

          <el-form-item label="预测结果：" v-if="predictContent !== undefined" />
          <json-viewer v-if="predictContent !== undefined"
                       :value="predictContent" copyable></json-viewer>
        </el-form>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'PredictResultQuery',
  components: { JsonViewer },
  data() {
    return {
      knownTags: [],
      selectedTag: null,
      jsonContent: undefined,
      predictContent: undefined,
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
    this.loadTags();
  },
  methods: {
    loadTags() {
      this.$axios.get('/predict/results/query').then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    preformQuery() {
      this.$axios.get('/predict/results/detail', {
        params: {
          tag: this.$data.selectedTag,
        },
      }).then((response) => {
        this.$data.jsonContent = response.data.data.arg;
        this.$data.predictContent = response.data.data.result;
      });
    },
  },
};
</script>

<style scoped>

</style>

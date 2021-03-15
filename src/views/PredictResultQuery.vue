<template>
  <div>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-form inline>
          <el-form-item label="方案标签：">
            <el-select v-model="selectedTag">
              <el-option v-for="item in knownTags"
                         :key="item.id"
                         :value="item.id">
                <span style="float: left">{{ item.id }}</span>
                <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="selectedTag === null"
                       @click="preformQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form label-position="right" label-width="auto">
          <el-col :span="8">
            <el-form-item v-for="pair in knownKVs" :label="pair.key + '：'" :key="pair.key">
              <a>{{pair.value}}</a>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-row>
          <ResultChart ref="resultChart"></ResultChart>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <ResultTable ref="resultTable"></ResultTable>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ResultChart from '@/components/ResultChart.vue';
import ResultTable from '@/components/ResultTable.vue';

export default {
  name: 'PredictResultQuery',
  components: { ResultTable, ResultChart },
  data() {
    return {
      knownTags: [],
      selectedTag: null,
      knownKVs: [],
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
        this.$data.knownKVs = [];
        Object.keys(response.data.data.parameters).forEach((key) => {
          if (response.data.data.parameters[key]) {
            this.$data.knownKVs.push({
              key,
              value: response.data.data.parameters[key],
            });
          }
        });
        this.$refs.resultChart.graphData = response.data.data.graphData;
        this.$refs.resultChart.refreshChart();
        this.$refs.resultTable.tableOneData = response.data.data.tableOneData;
        this.$refs.resultTable.tableTwoData = response.data.data.tableTwoData;
      });
    },
  },
};
</script>

<style scoped>

</style>

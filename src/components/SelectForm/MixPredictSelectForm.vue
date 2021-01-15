<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item v-if="placeOrIndustry === 'industry'" label="预测行业：">
      <el-select placeholder="请选择" v-model="postParams.industry">
        <el-option
          v-for="item in predictIndustries"
          :key="item"
          :value="item"
          :label="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="placeOrIndustry === 'place'" label="预测地区：">
      <el-select placeholder="请选择" v-model="postParams.region">
        <el-option
          v-for="item in predictRegions"
          :key="item"
          :value="item"
          :label="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="历史年份：">
      <year-range-selector
        :begin-year.sync='postParams.historyBeginYear'
        :end-year.sync="postParams.historyEndYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="预测年份：">
      <year-range-selector
        :begin-year.sync='postParams.beginYear'
        :end-year.sync="postParams.endYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="选择组合模型：">
      <el-select v-model="postParams.selectedMethods" multiple placeholder="请选择">
        <el-option
          v-for="item in allMethods"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="validate"
                 :disabled="postParams.selectedMethods.length === 0">检测</el-button>
      <el-button @click="performQuery"
                  type="primary"
                 :disabled="!canCommitQuery">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { generateLabelAndValueObjsByArray } from '@/tool';
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'MixPredictSelectForm',
  props: [
    'placeOrIndustry',
    'graphData',
    'tableOneData',
    'tableTwoData',
  ],
  components: { YearRangeSelector },
  data() {
    return {
      postParams: {
        historyBeginYear: null,
        historyEndYear: null,
        beginYear: null,
        endYear: null,
        region: '',
        industry: '',
        selectedMethods: [],
      },
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      predictRegions: [],
      predictIndustries: [],
      originalAllMethodsForPlace: ['逐步回归模型', '灰色滑动平均模型', '分数阶灰色模型',
        '改进的滚动机理灰色预测', '高斯混合回归模型', '模糊线性回归模型',
        '模糊指数平滑模型', '梯度提升模型', '支持向量机模型', '循环神经网络模型',
        '长短期神经网络模型', '扩展索洛模型', '分位数回归模型', '分行业典型日负荷曲线叠加法',
        '负荷最大利用小时数模型', '季节趋势模型', '考虑温度和节假日分布影响的电量预测模型'],
      originalAllMethodsForIndustry: ['基于ARIMA季节分解的行业电量预测', '基于EEMD的行业用电量预测', '基于主成分因子的行业用电量预测', '基于随机森林的行业用电量预测', '基于神经网络的行业用电量预测'],
    };
  },
  mounted() {
    this.loadParameters();
    if (this.placeOrIndustry === 'place') {
      this.loadRegions();
    } else {
      this.loadIndustries();
    }
  },
  methods: {
    loadParameters() {
      this.$axios.get('/params/predict/mix').then((response) => {
        this.$data.postParams = response.data.data;
      });
    },
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.predictRegions = response.data.data;
      });
    },
    loadIndustries() {
      this.$axios.get('/industry/query').then((response) => {
        this.$data.predictIndustries = response.data.data;
      });
    },
    validate() {
      this.$axios.post(this.validateUrl, {
        methods: this.$data.postParams.selectedMethods,
      }).then((response) => {
        const isOk = response.data.data.ok;
        if (isOk) {
          this.$messenger.success('这组组合模型符合要求。');
        } else {
          this.$messenger.warning('这组组合模型不符合要求。');
        }
      });
    },
    performQuery() {
      this.$axios.post(this.commitUrl, this.$data.postParams).then((response) => {
        this.$data.graphDataInternal = response.data.data.graphData;
        this.$data.tableOneDataInternal = response.data.data.tableOneData;
        this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
      });
    },
  },
  computed: {
    allMethods() {
      if (this.placeOrIndustry === 'place') {
        return generateLabelAndValueObjsByArray(this.originalAllMethodsForPlace);
      }
      return generateLabelAndValueObjsByArray(this.originalAllMethodsForIndustry);
    },
    commitUrl() {
      if (this.placeOrIndustry === 'place') {
        return '/predict/region/mix';
      }
      return '/predict/industry/mix';
    },
    validateUrl() {
      return `${this.commitUrl}/validate`;
    },
    canCommitQuery() {
      const params = this.$data.postParams;
      if (params.beginYear === null || params.endYear === null) {
        return false;
      }
      if (params.historyBeginYear === null || params.historyEndYear === null) {
        return false;
      }
      if (this.placeOrIndustry === 'industry') {
        if (params.industry.length === 0) {
          return false;
        }
      } else if (this.placeOrIndustry === 'place') {
        if (params.region.length === 0) {
          return false;
        }
      }
      if (params.selectedMethods.length === 0) {
        return false;
      }
      return true;
    },
  },
  watch: {
    graphDataInternal(value) {
      this.$emit('update:graphData', value);
    },
    tableOneDataInternal(value) {
      this.$emit('update:tableOneData', value);
    },
    tableTwoDataInternal(value) {
      this.$emit('update:tableTwoData', value);
    },
  },
};
</script>

<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

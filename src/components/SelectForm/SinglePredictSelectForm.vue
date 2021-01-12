<template>
     <el-form label-position="right" label-width="auto">
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
        <el-form-item v-if="!longTerm" label="预测方法：">
          <el-select placeholder="请选择" v-model="postParams.method">
            <el-option
              v-for="item in allMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="年份范围：">
        <year-range-selector
          :begin-year.sync='postParams.beginYear'
          :end-year.sync="postParams.endYear">
      </year-range-selector>
      </el-form-item>
      <el-form-item label="自变量：">
        <el-select placeholder="请选择" v-model="postParams.factor1.name">
          <el-option
            v-for="item in variadicFactors"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量是否有规划值：">
        <el-checkbox v-model="postParams.factor1.hasValue">
          {{ postParams.factor1.hasValue ? '有' : '无' }}
        </el-checkbox>
      </el-form-item>
       <el-form-item label="自变量规划值：" v-if="postParams.factor1.hasValue">
         <el-slider
           v-model="postParams.factor1.value"
           show-input
           :step="0.01"
           :max="1"
           :min="0">
         </el-slider>
       </el-form-item>

       <el-form-item label="第二自变量：" v-if="shouldDisplaySecondFactor">
         <el-select placeholder="请选择" v-model="postParams.factor2.name">
           <el-option
             v-for="item in variadicFactors"
             :key="item"
             :label="item"
             :value="item">
           </el-option>
         </el-select>
       </el-form-item>
       <el-form-item>
         <div v-if="shouldDisplaySecondFactor
         &&
         postParams.factor1.name.length > 0
         &&
         postParams.factor1.name === postParams.factor2.name"
         style="color: darkred; font-size: 12px">
           第二自变量不能和第一自变量相同。
         </div>
       </el-form-item>
       <el-form-item label="第二自变量是否有规划值：" v-if="shouldDisplaySecondFactor">
         <el-checkbox v-model="postParams.factor2.hasValue">
           {{ postParams.factor2.hasValue ? '有' : '无' }}
         </el-checkbox>
       </el-form-item>

       <el-form-item label="第二自变量规划值："
                     v-if="postParams.factor2.hasValue && shouldDisplaySecondFactor">
         <el-slider
           v-model="postParams.factor2.value"
           show-input
           :step="0.01"
           :max="1"
           :min="0">
         </el-slider>
       </el-form-item>
      <el-form-item >
        <el-button type="primary" :disabled="!canCommitQuery"
        @click="performPrediction">预测</el-button>
      </el-form-item>
     </el-form>

</template>

<script>
import { generateLabelAndValueObjsByArray } from '@/tool';
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'SinglePredictSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      test: '123',
      selectItems: '',
      predictRegions: [],
      predictIndustries: [],
      variadicFactors: [],
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      postParams: {
        beginYear: undefined,
        endYear: undefined,
        region: '',
        industry: '',
        method: '',
        factor1: {
          name: '',
          hasValue: true,
          value: 0.5,
        },
        factor2: {
          name: '',
          hasValue: true,
          value: 0.5,
        },
      },
      originalAllMethodsForPlace: ['逐步回归模型', '灰色滑动平均模型', '分数阶灰色模型',
        '改进的滚动机理灰色预测', '高斯混合回归模型', '模糊线性回归模型',
        '模糊指数平滑模型', '梯度提升模型', '支持向量机模型', '循环神经网络模型',
        '长短期神经网络模型', '扩展索洛模型', '分位数回归模型', '分行业典型日负荷曲线叠加法',
        '负荷最大利用小时数模型', '季节趋势模型', '考虑温度和节假日分布影响的电量预测模型',
        '一元线性函数', '一元二次函数', '幂函数', '生长函数', '指数函数', '对数函数', '二元一次函数'],
      originalAllMethodsForIndustry: ['基于ARIMA季节分解的行业电量预测', '基于EEMD的行业用电量预测', '基于主成分因子的行业用电量预测', '基于随机森林的行业用电量预测', '基于神经网络的行业用电量预测'],
    };
  },
  computed: {
    allMethods() {
      if (this.placeOrIndustry === 'place') {
        return generateLabelAndValueObjsByArray(this.originalAllMethodsForPlace);
      }
      if (this.placeOrIndustry === 'industry') {
        return generateLabelAndValueObjsByArray(this.originalAllMethodsForIndustry);
      }
      return [];
    },
    canCommitQuery() {
      const params = this.$data.postParams;
      if (params.beginYear === undefined || params.endYear === undefined) {
        return false;
      }
      if (params.region.length === 0) {
        return false;
      }
      if (!this.longTerm) {
        if (params.method === undefined) {
          return false;
        }
      }
      if (!this.validateFactor(params.factor1)) {
        return false;
      }
      if (this.shouldDisplaySecondFactor) {
        if (params.factor1.name === params.factor2.name) {
          return false;
        }
        return this.validateFactor(params.factor2);
      }
      return true;
    },
    shouldDisplaySecondFactor() {
      return this.$data.postParams.method === '二元一次函数';
    },
  },
  mounted() {
    if (this.placeOrIndustry === 'place') {
      this.loadRegions();
    } else {
      this.loadIndustries();
    }
    this.loadFactors();
  },
  methods: {
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
    loadFactors() {
      this.$axios.get('/factor/query').then((response) => {
        this.$data.variadicFactors = response.data.data;
      });
    },
    validateFactor(factor) {
      return factor.name.length !== 0;
    },
    performPrediction() {
      this.$axios.post('/predict/place/single/query', this.$data.postParams).then((response) => {
        this.$data.graphDataInternal = response.data.data.graphData;
        this.$data.tableOneDataInternal = response.data.data.tableOneData;
        this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
      });
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
  props: [
    'placeOrIndustry',
    'longTerm',
    'graphData',
    'tableOneData',
    'tableTwoData',
  ],
};
</script>
<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

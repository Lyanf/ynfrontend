<template>
  <el-form label-position="right" v-model="formData" label-width="auto">
    <el-form-item v-if="placeOrIndustry === 'place'" label="预测地区：">
      <el-select value="" placeholder="请选择">
      </el-select>
    </el-form-item>
    <el-form-item label="预测地区：">
    <el-select placeholder="请选择" value="">
      <el-option
        v-for="item in selectItems"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="历史年份：">
      <year-range-selector :begin-year.sync='historyYear.begin' :end-year.sync="historyYear.end">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="预测年份：">
      <year-range-selector :begin-year.sync='predictYear.begin' :end-year.sync="predictYear.end">
      </year-range-selector>
    </el-form-item>
    <el-form-item v-if="longTerm === false" label="预测模型：">
      <el-select placeholder="请选择" v-model="selectedMethod">
        <el-option
          v-for="item in allMethods"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="修改数据类型：">
      <el-select placeholder="数据类型"></el-select>
    </el-form-item>
    <el-form-item>
      <el-input placeholder="数据值"></el-input>
      <el-button size="mini" type="primary">保存修改「数据项」</el-button>
    </el-form-item>
    <el-form-item>
      <el-table title='预定修改'>
        <el-table-column label="修改数据类型"></el-table-column>
        <el-table-column label="修改值"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="展示曲线类型：">
      <el-select placeholder="请选择" value="">
        <el-option
          v-for="item in selectItems"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item >
      <el-button type="primary">预测</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { generateLabelAndValueObjsByArray } from '@/tool';
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'BigUserPredictSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      test: '123',
      selectItems: '',
      historyYear: {
        begin: undefined,
        end: undefined,
      },
      predictYear: {
        begin: undefined,
        end: undefined,
      },
      formData: '',
      originalAllMethodsForPlace: ['逐步回归模型', '灰色滑动平均模型', '分数阶灰色模型',
        '改进的滚动机理灰色预测', '高斯混合回归模型', '模糊线性回归模型',
        '模糊指数平滑模型', '梯度提升模型', '支持向量机模型', '循环神经网络模型',
        '长短期神经网络模型', '扩展索洛模型', '分位数回归模型', '分行业典型日负荷曲线叠加法',
        '负荷最大利用小时数模型', '季节趋势模型', '考虑温度和节假日分布影响的电量预测模型',
        '一元线性函数', '一元二次函数', '幂函数', '生长函数', '指数函数', '对数函数', '二元一次函数'],
      originalAllMethodsForIndustry: ['基于ARIMA季节分解的行业电量预测', '基于EEMD的行业用电量预测', '基于主成分因子的行业用电量预测', '基于随机森林的行业用电量预测', '基于神经网络的行业用电量预测'],
      selectedMethod: '',
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
  },
  mounted() {
    console.log(this.allMethods);
  },
  props: {
    placeOrIndustry: {
      type: String,
    },
    longTerm: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
  .el-form-item .el-select,.el-input{
    width: 80%;
  }
</style>

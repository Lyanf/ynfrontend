<template>
  <el-form>
    <el-form-item v-if="placeOrIndustry === 'industry'" label="预测行业">
      <el-select value=""></el-select>
    </el-form-item>
    <el-form-item v-if="placeOrIndustry === 'place'" label="预测地区">
      <el-select value=""></el-select>
    </el-form-item>
    <el-form-item label="历史年份">
      <el-date-picker
        v-model="historyYear"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始年份"
        end-placeholder="结束年份"
        format="yyyy"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="预测年份">
      <el-date-picker
        v-model="predictYear"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始年份"
        end-placeholder="结束年份"
        format="yyyy"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="选择组合模型（必选）">
      <el-select v-model="selectedMethods" multiple placeholder="请选择">
        <el-option
          v-for="item in allMethods"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button>检测</el-button>
    </el-form-item>
    <el-form-item label="展示曲线类型">
      <el-select v-model="showChartType"></el-select>
    </el-form-item>
    <el-form-item>
      <el-button>预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { generateLabelAndValueObjsByArray } from '@/tool';

export default {
  name: 'MixPredictSelectForm',
  props: ['placeOrIndustry'],
  data() {
    return {
      historyYear: '',
      predictYear: '',
      selectedMethods: '',
      showChartType: '',
      originalAllMethodsForPlace: ['逐步回归模型', '灰色滑动平均模型', '分数阶灰色模型',
        '改进的滚动机理灰色预测', '高斯混合回归模型', '模糊线性回归模型',
        '模糊指数平滑模型', '梯度提升模型', '支持向量机模型', '循环神经网络模型',
        '长短期神经网络模型', '扩展索洛模型', '分位数回归模型', '分行业典型日负荷曲线叠加法',
        '负荷最大利用小时数模型', '季节趋势模型', '考虑温度和节假日分布影响的电量预测模型'],
      originalAllMethodsForIndustry: ['基于ARIMA季节分解的行业电量预测', '基于EEMD的行业用电量预测', '基于主成分因子的行业用电量预测', '基于随机森林的行业用电量预测', '基于神经网络的行业用电量预测'],
    };
  },
  computed: {
    allMethods() {
      if (this.placeOrIndustry === 'place') {
        return generateLabelAndValueObjsByArray(this.originalAllMethodsForPlace);
      }

      return generateLabelAndValueObjsByArray(this.originalAllMethodsForIndustry);
    },
  },

};
</script>

<style scoped>

</style>

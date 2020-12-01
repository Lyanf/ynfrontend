<template>
     <el-form label-position="right" v-model="formData" label-width="auto">
        <el-form-item v-if="placeOrIndustry === 'place'" label="预测地区:">
          <el-select value="" placeholder="请选择">
          </el-select>
        </el-form-item>
       <el-form-item v-if="placeOrIndustry === 'industry'" label="预测行业:">
         <el-select value="" placeholder="请选择">
         </el-select>
       </el-form-item>
        <el-form-item v-if="longTerm === false" label="预测方法:">
          <el-select placeholder="请选择" v-model="selectedMethod">
            <el-option
              v-for="item in allMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="数据起始年份:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据中止年份:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预测年限:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量1:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量是否有规划值:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量2:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量2是否有规划值:">
        <el-select placeholder="请选择" value="">
          <el-option
            v-for="item in selectItems"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自变量2规划值:">
        <el-input placeholder="请输入" value=""></el-input>
      </el-form-item>
      <el-form-item label="展示曲线类型:">
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
        <el-button type="primary" >预测</el-button>
      </el-form-item>
     </el-form>

</template>

<script>
import { generateLabelAndValueObjsByArray } from '@/tool';

export default {
  name: 'SinglePredictSelectForm',
  data() {
    return {
      test: '123',
      selectItems: '',
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

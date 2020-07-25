<template>
  <el-form v-model="formData" label-position="top">
    <el-form-item label="选择地区">
      <el-select placeholder="请选择" value="">
<!--        <el-option-->
<!--          v-for="item in selectItems"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
      </el-select>
    </el-form-item>
    <el-form-item label="挖掘方法">
      <el-select placeholder="请选择" v-model="selectedMethod">
        <el-option
          v-for="item in allMethods"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='皮尔逊相关系数算法'" label="皮尔逊系数阈值">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='K均值算法'" label="推荐最佳分类数">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='K均值算法'" label="分类数">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='主成分分析算法'" label="系数绝对值阈值">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='关联规则分析算法'" label="最小支持度">
      <el-input></el-input>
    </el-form-item>
    <el-form-item v-if="selectedMethod==='关联规则分析算法'" label="最小置信度">
      <el-input></el-input>
    </el-form-item>
    <el-form-item label="数据起始年份">
      <el-select placeholder="请选择" value="">
<!--        <el-option-->
<!--          v-for="item in selectItems"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
      </el-select>
    </el-form-item>
    <el-form-item label="数据终止年份">
      <el-select placeholder="请选择" value="">
<!--        <el-option-->
<!--          v-for="item in selectItems"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button>确定</el-button>
      <el-button @click="goToResultPage">挖掘结果展示</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SelectMiningMethod',
  data() {
    return {
      formData: {},
      allMethods: [{
        label: '皮尔逊相关系数算法',
        value: '皮尔逊相关系数算法',
      }, {
        label: 'K均值算法',
        value: 'K均值算法',
      }, {
        label: '主成分分析算法',
        value: '主成分分析算法',
      }, {
        label: '关联规则分析算法',
        value: '关联规则分析算法',
      }],
      selectedMethod: '',
    };
  },
  props() {
    return {};
  },
  methods: {
    goToResultPage() {
      console.log(123);
      window.location = '/#/miningResult';
    },
  },
};
</script>

<style scoped>

</style>

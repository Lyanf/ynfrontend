<template>
  <el-form label-position="right" v-model="formData" label-width="auto">
    <el-form-item label="预测行业：">
      <el-select value="" placeholder="请选择">
      </el-select>
    </el-form-item>
    <el-form-item label="预测方法：">
      <el-select placeholder="请选择" v-model="selectedMethod">
        <el-option
          v-for="item in allMethods"
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
    <el-form-item label="预测年限：">
      <el-select placeholder="请选择" value="">
        <el-option
          v-for="item in selectItems"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-for="(item, index) in parameters"
                  :key="index"
                  :label="'自变量' + (index + 1) + (index > 2 ? '（可选）' : '（必选）')">
      <el-input placeholder="请输入" v-model="parameters[index]"></el-input>
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
    <el-form-item>
      <el-button type="primary" >预测</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'DynamicSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      historyYear: {
        begin: undefined,
        end: undefined,
      },
      parameters: [
        undefined,
        undefined,
        undefined,
      ],
    };
  },
};
</script>

<style scoped>

</style>

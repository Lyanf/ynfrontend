<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="预测区域：">
      <el-select placeholder="请选择" v-model="postParams.region">
        <el-option
          v-for="item in knownRegions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="预测方法：">
      <el-select placeholder="请选择" v-model="postParams.method">
        <el-option
          v-for="item in knownMethods"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="历史年份：">
      <year-range-selector
        :begin-year.sync="postParams.historyBeginYear"
        :end-year.sync="postParams.historyEndYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="预测年份：">
      <year-range-selector
        :begin-year.sync="postParams.beginYear"
        :end-year.sync="postParams.endYear">
      </year-range-selector>
    </el-form-item>
    <div v-for="(item, index) in postParams.parameters" :key="index">
      <el-form-item :label="`参数 ${index + 1}：`">
        <el-input clearable v-model="postParams.parameters[index]" placeholder="请输入"></el-input>
        <el-button style="margin-left: 8px"
                   type="danger"
                   @click="postParams.parameters.remove(index, index)">×</el-button>
      </el-form-item>
    </div>
    <el-form-item>
      <div v-if="postParams.parameters.length < 2" style="color: darkred; font-size: 12px">
        至少需要 2 个参数。
      </div>
      <el-form-item>
      </el-form-item>
      <el-button @click="postParams.parameters.push('')">增加参数</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="!canCommitQuery"
                 @click="performPrediction">预测</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'DynamicRegionSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      knownMethods: [],
      knownRegions: [],
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      postParams: {
        region: '',
        method: '',
        parameters: ['', ''],
        beginYear: null,
        endYear: null,
        historyBeginYear: null,
        historyEndYear: null,
      },
    };
  },
  methods: {
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.knownRegions = response.data.data;
      });
    },
    loadIndustrialMethods() {
      this.$axios.get('/method/region/query').then((response) => {
        this.$data.knownMethods = response.data.data;
      });
    },
    performPrediction() {
      this.$axios.post(this.commitUrl, this.$data.postParams).then((response) => {
        this.$data.graphDataInternal = response.data.data.graphData;
        this.$data.tableOneDataInternal = response.data.data.tableOneData;
        this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
      });
    },
  },
  mounted() {
    this.loadRegions();
    this.loadIndustrialMethods();
  },
  computed: {
    canCommitQuery() {
      const params = this.$data.postParams;
      if (params.beginYear === null || params.endYear === null) {
        return false;
      }
      if (params.historyBeginYear === null || params.historyEndYear === null) {
        return false;
      }
      if (params.region.length === 0 || params.method.length === 0) {
        return false;
      }
      if (params.parameters.length < 2) {
        return false;
      }
      for (let i = 0; i < params.parameters.length; i += 1) {
        const x = params.parameters[i];
        if (x === null || x.length === 0) {
          return false;
        }
      }
      return true;
    },
    commitUrl() {
      if (this.type === 'saturation') {
        return '/predict/saturation';
      }
      return '/predict/payload';
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
    'type',
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

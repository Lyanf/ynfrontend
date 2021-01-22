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
    <el-form-item label="方案标签：">
      <el-input clearable placeholder="可留空" v-model="postParams.tag">
      </el-input>
    </el-form-item>
    <el-form-item label="加载方案：">
      <el-select placeholder="选择标签" v-model="currentTag" size="small" style="width: 50%">
        <el-option
          v-for="item in knownTags"
          :key="item.id"
          :label="item.id"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button size="small" @click="loadParameters"
                 :disabled="currentTag === null"
                 style="margin-left: 10px">加载</el-button>
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
        tag: null,
        tagType: 'MIX',
      },
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      predictRegions: [],
      predictIndustries: [],
      originalAllMethodsForPlace: [],
      originalAllMethodsForIndustry: [],
      knownTags: [],
      currentTag: null,
    };
  },
  mounted() {
    // this.loadParameters();
    if (this.placeOrIndustry === 'place') {
      this.loadRegions();
      this.loadRegionalMethods();
    } else {
      this.loadIndustries();
      this.loadIndustrialMethods();
    }
    this.loadTags();
  },
  methods: {
    loadParameters() {
      this.$axios.get('/params/predict/mix', {
        params: {
          tag: this.$data.currentTag,
        },
      }).then((response) => {
        this.$data.postParams = response.data.data;
      });
    },
    loadTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'MIX',
        },
      }).then((response) => {
        this.$data.knownTags = response.data.data;
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
    loadIndustrialMethods() {
      this.$axios.get('/method/industry/query').then((response) => {
        this.$data.originalAllMethodsForIndustry = response.data.data;
      });
    },
    loadRegionalMethods() {
      this.$axios.get('/method/region/query').then((response) => {
        this.$data.originalAllMethodsForPlace = response.data.data;
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

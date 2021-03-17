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
      <el-select placeholder="请选择" v-model="postParams.method" :disabled="isWired">
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
    <div v-for="param in requiredParams" :key="param.key">
      <el-form-item :label="param.label + '：'">
        <el-input v-if="param.kind === 'int'" :step="1" type="number"
                  clearable v-model="postParams[param.key]"
                  placeholder="请输入整数数字"></el-input>
        <el-input v-else-if="param.kind === 'float'" :step="0.01" type="number"
                  clearable v-model="postParams[param.key]"
                  placeholder="请输入数字"></el-input>
        <el-select v-else-if="param.kind === 'option'" placeholder="请选择一项"
                  v-model="postParams[param.key]">
          <el-option
            v-for="item in param.value"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-else-if="param.kind === 'multioption'" multiple
                   placeholder="请选择数项" v-model="postParams[param.key]">
          <el-option
            v-for="item in param.value"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-input v-else placeholder="请输入" v-model="postParams[param.key]">
        </el-input>
<!--        <el-button style="margin-left: 8px"-->
<!--                   type="danger"-->
<!--        @click="postParams.parameters.remove(index, index)">×</el-button>-->
      </el-form-item>
    </div>
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
      requiredParams: [],
      knownMethods: [],
      knownRegions: [],
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      knownTags: [],
      currentTag: null,
      parameters: {},
      postParams: {
        region: '',
        method: '',
        beginYear: null,
        endYear: null,
        historyBeginYear: null,
        historyEndYear: null,
        tag: null,
        tagType: 'LONGTERM',
      },
    };
  },
  methods: {
    loadTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'LONGTERM',
        },
      }).then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    loadParameters() {
      this.$axios.get('/params/predict/dynamic/region', {
        params: {
          tag: this.$data.currentTag,
        },
      }).then((response) => {
        this.$data.postParams = response.data.data;
      });
    },
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
      const assigns = Object.assign(this.$data.postParams, this.$data.parameters);
      assigns.StartYear = assigns.historyBeginYear;
      assigns.EndYear = assigns.historyEndYear;
      assigns.PreStartYear = assigns.beginYear;
      assigns.PreEndYear = assigns.endYear;
      assigns['city*'] = assigns.region;
      this.$axios.post(this.commitUrl, assigns)
        .then((response) => {
          this.$data.graphDataInternal = response.data.data.graphData;
          this.$data.tableOneDataInternal = response.data.data.tableOneData;
          this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
        });
    },
  },
  mounted() {
    // this.loadParameters();
    this.loadRegions();
    this.loadIndustrialMethods();
    this.loadTags();
    if (this.isWired) {
      this.postParams.method = this.wiredMethod;
      this.loadParameters();
    }
  },
  computed: {
    isWired() {
      return this.wiredMethod !== undefined;
    },
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
      // if (params.parameters.length < 2) {
      //   return false;
      // }
      // for (let i = 0; i < params.parameters.length; i += 1) {
      //   const x = params.parameters[i];
      //   if (x === null || x.length === 0) {
      //     return false;
      //   }
      // }
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
    'postParams.method': function (value) {
      this.$data.requiredParams = [];
      this.$axios.get('/get/args', {
        params: {
          method: value,
        },
      }).then((response) => {
        response.data.data.para.forEach((object) => {
          if (object.key === 'StartYear' || object.key === 'EndYear'
          || object.key === 'PreStartYear' || object.key === 'PreEndYear' || object.key === 'city*') {
            // skip those rubbish parameters
          } else {
            // whatever
            this.$data.requiredParams.push(object);
          }
        });
        // Object.keys(response.data.data).forEach((key) => {
        //   if (key === 'num' || key === 'name' || key === 'StartYear' || key === 'EndYear'
        //   || key === 'PreStartYear' || key === 'EndStartYear') {
        //     // skip those rubbish parameters
        //   } else {
        //     // whatever
        //     this.$data.requiredParams.push(key);
        //   }
        // });
      });
    },
  },
  props: [
    'type',
    'graphData',
    'tableOneData',
    'tableTwoData',
    'wiredMethod',
  ],
};
</script>

<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

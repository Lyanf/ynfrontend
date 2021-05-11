<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="预测方法：">
      <el-select placeholder="请选择" v-model="postParams.method" :disabled="wiredMethod !== null">
        <el-option
          v-for="item in allMethods"
          :key="item.value"
          :label="item.label"
          :value="item.value">
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
    <div v-for="param in requiredParams" :key="param.key">
      <el-form-item :label="param.label + '：'">
        <el-input v-if="param.kind === 'int'" :step="1" type="number"
                  :min="param.limits.min_value"
                  :max="param.limits.max_value"
                  clearable v-model="postParams[param.key]"
                  placeholder="请输入整数数字"></el-input>
        <el-input v-else-if="param.kind === 'float'" :step="0.01" type="number"
                  :min="param.limits.min_value"
                  :max="param.limits.max_value"
                  clearable v-model="postParams[param.key]"
                  placeholder="请输入数字"></el-input>
        <el-select v-else-if="param.kind.startsWith('option')" placeholder="请选择一项"
                   v-model="postParams[param.key]">
          <el-option
            v-for="item in param.value"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <div v-else-if="param.kind.startsWith('multioption')">
          <el-select multiple
                     placeholder="请选择数项" v-model="postParams[param.key]"
                     :multiple-limit="param.limits.max_choice">
            <el-option
              v-for="item in param.value"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-button v-if="param.label === '要剔除的行业名单'"
                     :disabled="postParams.beginYear === null || postParams.endYear === null"
            @click="generateTemplate" style="margin-left: 20px">生成模版</el-button>
        </div>
        <el-upload v-else-if="param.kind === 'file'"
          ref="upload"
          action="/"
          :on-change="getUploader(param.key, rawFileNames, rawFiles)"
          :auto-upload="false" :multiple="false"
                   list-type="text"
          :show-file-list="false">
          <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
          <div v-if="rawFileNames[param.key]"> {{ rawFileNames[param.key] }} </div>
        </el-upload>
        <el-checkbox v-else-if="param.kind === 'bool'"
                     v-model="postParams[param.key]"
                     :true-label="1" :false-label="0">
        </el-checkbox>
        <el-input v-else placeholder="请输入" v-model="postParams[param.key]">
        </el-input>
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
          :key="item.tag"
          :label="item.tag"
          :value="item.tag">
        </el-option>
      </el-select>
      <el-button size="small" @click="loadParameters"
                 :disabled="currentTag === null"
                 style="margin-left: 10px">加载</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :disabled="!canCommitQuery"
                 @click="performPrediction">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';
import * as iconv from 'iconv-lite';

export default {
  name: 'SinglePredictSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      requiredParams: [],
      rawFiles: {},
      rawFileNames: {},
      allMethods: [],
      postParams: {
        historyBeginYear: null,
        historyEndYear: null,
        beginYear: null,
        endYear: null,
        method: '',
        tag: null,
        tagType: this.tagType,
      },
      knownTags: [],
      currentTag: null,
    };
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
      return true;
    },
  },
  mounted() {
    this.$data.postParams.method = this.wiredMethod;
    this.loadTags();
  },
  methods: {
    generateTemplate() {
      const raw = [];
      const params = this.$data.postParams;
      for (let i = params.beginYear; i <= params.endYear; i += 1) {
        const bloc = {
          year: i,
        };
        params.rejectlsit.forEach((elem) => {
          bloc[elem] = null;
        });
        raw.push(bloc);
      }
      console.log(raw);
      console.log(['year'] + params.rejectlsit);
      const data = json2csv.parse(raw, {
        fields: ['year'].concat(params.rejectlsit),
      });
      const blob = new Blob([`\ufeff${data}`], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, '剔除数据模版.csv');
    },
    getUploader(key, param, raw) {
      const vm = this;
      return function (file) {
        // eslint-disable-next-line no-param-reassign
        param[key] = file.name;
        // eslint-disable-next-line no-param-reassign
        raw[key] = file.raw;
        // eslint-disable-next-line no-underscore-dangle
        vm._watcher.update();
      };
    },
    loadTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: this.tagType,
        },
      }).then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    performPrediction() {
      const assigns = new FormData();
      Object.keys(this.$data.postParams).forEach((key) => {
        assigns.append(key, this.$data.postParams[key]);
      });

      assigns.append('StartYear', this.$data.postParams.historyBeginYear);
      assigns.append('EndYear', this.$data.postParams.historyEndYear);
      assigns.append('PreStartYear', this.$data.postParams.beginYear);
      assigns.append('PreEndYear', this.$data.postParams.endYear);

      Object.keys(this.$data.rawFiles).forEach((key) => {
        assigns.append(key, this.$data.rawFiles[key]);
      });

      this.$axios.post('/predict/region/single', assigns).then((response) => {
        this.$data.graphDataInternal = response.data.data.tableTwoData;
        this.$data.tableOneDataInternal = response.data.data.tableOneData;
        this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
      });
    },
    loadParameters() {
      this.$axios.get('/params/predict/static/region', {
        params: {
          tag: this.$data.currentTag,
        },
      }).then((response) => {
        this.$data.postParams = response.data.data;
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
    'postParams.method': function (value) {
      this.$data.requiredParams = [];
      this.$axios.get('/get/args', {
        params: {
          method: value,
        },
      }).then((response) => {
        response.data.data.para.forEach((object) => {
          if (object.key === 'StartYear' || object.key === 'EndYear'
            || object.key === 'PreStartYear' || object.key === 'PreEndYear') {
            // skip those rubbish parameters
          } else {
            // whatever
            this.$data.requiredParams.push(object);
            if (object.default !== undefined) {
              this.$set(this.postParams, object.key, object.default);
            }
          }
        });
      });
    },
  },
  props: [
    'graphData',
    'tableOneData',
    'tableTwoData',
    'wiredMethod',
    'tagType',
  ],
};
</script>
<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

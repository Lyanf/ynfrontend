<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="历史年份区间：">
      <year-range-selector
        :expand="true"
        :begin-year.sync="postParams.historyBeginYear"
        :end-year.sync="postParams.historyEndYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="预测年份：">
      <el-date-picker
        v-model="postParams.predictYear"
        type="year"
        value-format="yyyy"
        placeholder="请选择"/>
    </el-form-item>
    <el-form-item label="省级负荷预测方案选择：">
      <el-select placeholder="请选择" v-model="postParams.provPlan">
        <el-option
          v-for="item in knownTags"
          :key="item.id"
          :value="item.id">
          <span style="float: left">{{ item.id }}</span>
          <span style="float: right; color: #8492a6;">{{ typeName[item.tagType] }}</span>
        </el-option>
        <el-option :key="'__byUpload__'" label="通过文件上传" :value="'__byUpload__'"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择文件：" v-if="postParams.provPlan === '__byUpload__'">
      <el-select placeholder="请选择" v-model="postParams.provFile">
        <el-option
          v-for="subitem in knownUploadFiles"
          :key="value + subitem"
          :label="subitem"
          :value="subitem">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-upload
        multiple
        :file-list="postParams.fileList"
        :show-file-list="false"
        :auto-upload="true"
        :on-success="onSuccess"
        :on-error="onFailure"
        :before-upload="beforeUpload"
        :action="baseURL + '/predict/munidata/upload'"
      >
        <el-button size="small" :disabled="!enabledUploadButton">上传文件</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button @click="performPrediction"
                 type="primary"
                 :disabled="!canCommitQuery">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'ProvMuniPredictSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      enabledUploadButton: true,
      postParams: {
        historyBeginYear: null,
        historyEndYear: null,
        predictYear: null,
        provPlan: '',
        provFile: '',
      },
      knownTags: [],
      knownUploadFiles: [],
      tableThreeDataInternal: [],
      tableFourDataInternal: [],
      typeName: {
        MINING: '数据挖掘方案',
        STATIC_REGIONAL: '地区单预测方案',
        DYNAMIC_INDUSTRIAL: '行业单预测方案',
        MIX: '组合预测方案',
        LONGTERM: '远期规划预测方案',
        BIGUSER: '大用户预测方案',
        SOKU: '负荷特性预测方案',
        CLAMP: '负荷特性预测方案',
        INTERP: '负荷特性预测方案',
        YEARCONT: '负荷特性预测方案',
      },
    };
  },
  methods: {
    loadTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'PROVINCE',
        },
      }).then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    loadMunicipals() {
      this.$axios.get('/region/query').then((response) => {
        const municipals = response.data.data;
        this.$data.postParams.muniData = {};
        municipals.forEach((elem) => {
          this.$set(this.$data.postParams.muniData, elem, '');
        });
      });
    },
    loadUploadedFiles() {
      this.$axios.get('/predict/munidata/files').then((response) => {
        this.$data.knownUploadFiles = response.data.data;
      });
    },
    onSuccess() {
      this.$data.enabledUploadButton = true;
      this.$messenger.success('上传成功。');
      this.loadUploadedFiles();
    },
    onFailure() {
      this.$data.enabledUploadButton = true;
      this.$messenger.error('上传失败。');
    },
    beforeUpload() {
      this.$data.enabledUploadButton = false;
    },
    performPrediction() {
      this.$axios.post('/predict/provmuni', this.$data.postParams).then((response) => {
        this.$data.tableThreeDataInternal = response.data.data.tableThreeData;
        this.$data.tableFourDataInternal = response.data.data.tableFourData;
      });
    },
  },
  computed: {
    canCommitQuery() {
      const param = this.$data.postParams;
      if (param.historyBeginYear === null || param.historyEndYear === null) {
        return false;
      }
      if (param.predictYear === null) {
        return false;
      }
      if (param.provPlan.length === 0) {
        return false;
      }
      if (param.provPlan === '__byUpload__' && param.provFile.length === 0) {
        return false;
      }
      return true;
    },
    baseURL() {
      return this.$axios.defaults.baseURL;
    },
  },
  mounted() {
    this.loadTags();
    this.loadMunicipals();
    this.loadUploadedFiles();
  },
  props: [
    'tableThreeData',
    'tableFourData',
  ],
  watch: {
    tableThreeDataInternal(value) {
      this.$emit('update:tableThreeData', value);
    },
    tableFourDataInternal(value) {
      this.$emit('update:tableFourData', value);
    },
  },
};
</script>

<style scoped>

</style>

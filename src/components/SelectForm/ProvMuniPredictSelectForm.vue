<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="省级负荷预测方案选择：">
      <el-select placeholder="请选择" v-model="postParams.provPlan">
        <el-option
          v-for="item in projects"
          :key="'prov' + item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="地级市负荷预测方案选择：">

      <el-upload
        style="display: inline"
        :show-file-list="false"
        :on-success="onSuccess"
        :on-error="onFailure"
        :before-upload="beforeUpload"
        :action="baseURL + '/predict/project/upload'"
      >
        <el-button :disabled="!enabledUploadButton">批量导入</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item v-for='(value, key) in postParams.muniPlans'
                  :key="key"
                  :label="(key + '：')">
      <el-select placeholder="请选择" v-model="postParams.muniPlans[key]">
        <el-option
          v-for="subitem in projects"
          :key="value + subitem"
          :label="subitem"
          :value="subitem">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="performPrediction"
                 type="primary"
                 :disabled="!canCommitQuery">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ProvMuniPredictSelectForm',
  data() {
    return {
      projects: [],
      enabledUploadButton: true,
      postParams: {
        provPlan: '',
        muniPlans: {},
      },
      tableThreeDataInternal: [],
      tableFourDataInternal: [],
    };
  },
  methods: {
    onSuccess() {
      this.$data.enabledUploadButton = true;
      this.$messenger.success('上传成功。');
      this.loadProjects();
    },
    onFailure() {
      this.$data.enabledUploadButton = true;
      this.$messenger.error('上传失败。');
    },
    beforeUpload() {
      this.$data.enabledUploadButton = false;
    },
    loadMunicipals() {
      this.$axios.get('/region/query').then((response) => {
        const municipals = response.data.data;
        this.$data.postParams.muniPlans = {};
        municipals.forEach((elem) => {
          this.$set(this.$data.postParams.muniPlans, elem, '');
        });
      });
    },
    loadProjects() {
      this.$axios.get('/predict/project/query').then((response) => {
        this.$data.projects = response.data.data;
      });
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
      if (param.provPlan.length === 0) {
        return false;
      }
      if (param.muniPlans.length === 0) {
        return false;
      }
      let isOk = true;
      Object.keys(param.muniPlans).forEach((key) => {
        if (param.muniPlans[key].length === 0) {
          isOk = false;
        }
      });
      return isOk;
    },
    baseURL() {
      return this.$axios.defaults.baseURL;
    },
  },
  mounted() {
    this.loadProjects();
    this.loadMunicipals();
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

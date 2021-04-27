<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="数据文件：">
      <el-upload ref="upload"
                 action="/"
                 :on-change="onSelectionChanges"
                 :auto-upload="false" :multiple="false"
                 list-type="text"
                 :show-file-list="false">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <div v-if="provFileName"> {{ provFileName }} </div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :disabled="!canCommitQuery"
                 @click="performPrediction">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'ProvMuniPredictSelectForm',
  data() {
    return {
      enabledUploadButton: true,
      provFileName: '',
      rawFile: null,
      knownTags: [],
      knownUploadFiles: [],
      tableThreeDataInternal: [],
      tableFourDataInternal: [],
    };
  },
  methods: {
    onSelectionChanges(file) {
      this.$data.provFileName = file.name;
      this.$data.rawFile = file.raw;
    },
    performPrediction() {
      const assigns = new FormData();
      assigns.append('file', this.rawFile);
      assigns.append('method', '省市总分协调算法');
      this.$axios.post('/predict/provmuni', assigns).then((response) => {
        this.$data.graphDataInternal = response.data.data.tableTwoData;
        this.$data.tableThreeDataInternal = response.data.data.tableThreeData;
        this.$data.tableFourDataInternal = response.data.data.tableFourData;
      });
    },
  },
  computed: {
    canCommitQuery() {
      return this.$data.provFileName.length !== 0;
    },
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

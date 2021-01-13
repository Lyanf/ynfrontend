<template>
  <el-form label-position="right" label-width="auto">
    <el-form-item label="预测地区：">
      <el-select v-model="postParams.region" placeholder="请选择">
        <el-option
          v-for="item in knownRegions"
          :key="item"
          :label="item"
          :value="item">
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
    <el-form-item label="预测模型：">
      <el-select placeholder="请选择" v-model="postParams.method">
        <el-option
          v-for="item in knownMethods"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="修改数据节点：">
      <el-cascader placeholder="请选择"
                 :options="knownMetadata"
                 v-model="addEntryParams.metaData"></el-cascader>
    </el-form-item>
    <el-form-item label="修改年份："
                  v-if="postParams.historyBeginYear !== null
                  && postParams.historyEndYear !== null">
      <el-select placeholder="请选择" v-model="addEntryParams.year">
        <el-option v-for="i in postParams.historyEndYear - postParams.historyBeginYear + 1"
        :key="i + postParams.historyBeginYear - 1"
        :label="`${i + postParams.historyBeginYear - 1} 年`"
        :value="i + postParams.historyBeginYear - 1">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="postParams.historyBeginYear === null
                  || postParams.historyEndYear === null">
      <div style="color: darkred; font-size: 12px">
        请先指定历史数据年份范围。
      </div>
    </el-form-item>
    <el-form-item label="更新值：">
      <el-input placeholder="请输入" v-model="addEntryParams.value"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="addEntry"
                 size="mini" type="primary"
                 :disabled="!canAddEntry">加入修改项</el-button>
    </el-form-item>
    <el-form-item v-if="postParams.patches.length !== 0">
      <el-table :data="postParams.patches">
        <el-table-column label="数据节点" prop="metaData"></el-table-column>
        <el-table-column label="数据年份" prop="year"></el-table-column>
        <el-table-column label="数据粒度" prop="grain"></el-table-column>
        <el-table-column label="值" prop="value"></el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="handleDelete(scope.$index)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="!canCommitQuery"
                 type="primary"
                 @click="performPrediction">预测</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'BigUserPredictSelectForm',
  components: { YearRangeSelector },
  data() {
    return {
      knownRegions: [],
      knownMethods: [],
      knownMetadata: [],
      graphDataInternal: [],
      tableOneDataInternal: [],
      tableTwoDataInternal: [],
      addEntryParams: {
        metaData: [],
        year: '',
        grain: '年',
        value: '',
      },
      postParams: {
        historyBeginYear: null,
        historyEndYear: null,
        beginYear: null,
        endYear: null,
        method: '',
        region: '',
        patches: [],
      },
    };
  },
  methods: {
    loadMetaData() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.knownMetadata = response.data.data;
      });
    },
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.knownRegions = response.data.data;
      });
    },
    loadMethods() {
      this.$axios.get('/method/bigdata/query').then((response) => {
        this.$data.knownMethods = response.data.data;
      });
    },
    addEntry() {
      const param = this.$data.addEntryParams;
      this.$data.postParams.patches.push({
        metaData: [...param.metaData],
        grain: param.grain,
        year: param.year,
        value: param.value,
      });
    },
    performPrediction() {
      this.$axios.post('/predict/bigdata', this.$data.postParams).then((response) => {
        this.$data.graphDataInternal = response.data.data.graphData;
        this.$data.tableOneDataInternal = response.data.data.tableOneData;
        this.$data.tableTwoDataInternal = response.data.data.tableTwoData;
      });
    },
    handleDelete(index) {
      this.$data.postParams.patches.remove(index, index);
    },
  },
  mounted() {
    this.loadMetaData();
    this.loadRegions();
    this.loadMethods();
  },
  computed: {
    canCommitQuery() {
      const param = this.$data.postParams;
      if (param.historyBeginYear === null || param.historyEndYear === null) {
        return false;
      }
      if (param.beginYear === null || param.endYear === null) {
        return false;
      }
      if (param.method.length === 0 || param.region.length === 0) {
        return false;
      }
      return true;
    },
    canAddEntry() {
      const param = this.$data.addEntryParams;
      if (param.metaData.length === 0) {
        return false;
      }
      if (param.value.length === 0 || param.year.length === 0) {
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
  props: [
    'graphData',
    'tableOneData',
    'tableTwoData',
  ],
};
</script>
<style scoped>
  .el-form-item .el-select,.el-input,.el-cascader{
    width: 80%;
  }
</style>

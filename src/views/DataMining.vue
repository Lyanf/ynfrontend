<template>
  <el-row>
    <el-col style="height: 100%" :offset="1" :span="12">
      <el-row>
        <el-transfer
          filterable
          filter-placeholder="输入以查找"
          v-model="postParams.factors"
          :data="knownFactors"
          :titles="['待选择影响因素', '已选择影响因素']"
          :button-texts="['移除', '添加']"
          style="height: 100%"
        >
        </el-transfer>
      </el-row>
      <el-row style="margin-top: 5em">
        <span v-if="miningResults.length > 0">挖掘结果</span>
      </el-row>
      <el-row style="margin-top: 2em" >
        <el-tag v-for="item in miningResults"
                :key="item"
        style="margin: 5px">
          {{item}}
        </el-tag>
      </el-row>
    </el-col>
    <el-col :span="9" :offset="1" style="margin-right: 20px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="数据年份：">
          <year-range-selector :begin-year.sync="postParams.StartYear"
                               :end-year.sync="postParams.EndYear">
          </year-range-selector>
        </el-form-item>
        <el-form-item label="挖掘方法：">
          <el-select placeholder="请选择" v-model="postParams.method">
            <el-option
              v-for="item in allMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div v-for="param in requiredParams" :key="param.key">
          <el-form-item :label="param.label + '：'" v-if="param.key !== 'econamelist'">
            <el-input v-if="param.kind === 'int'" :step="1" type="number"
                      clearable v-model="postParams[param.key]"
                      placeholder="请输入整数数字"></el-input>
            <el-input v-else-if="param.kind === 'float'" :step="0.01" type="number"
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
            <el-select v-else-if="param.kind.startsWith('multioption')" multiple
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
          <el-button @click="commitMining"
                     type="primary"
                     :disabled="!isFormComplete">
            确定
          </el-button>
          <el-button @click="goToResultPage">挖掘结果展示</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :offset="1" :span="22">
      <el-form>
        <div v-if="postParams.method === 'K均值算法'">
          <el-form-item>
            <el-button @click="exportKMeansData"
                       :disabled="kMeansData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="挖掘结果表：">
            <el-table :data="kMeansData">
              <el-table-column prop="index" label="类别序号"></el-table-column>
              <el-table-column prop="members" label="成员"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="postParams.method === '主成分分析算法'">
          <el-form-item>
            <el-button @click="exportPCAData"
                       :disabled="pcaData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="挖掘结果表：">
            <el-table :data="pcaData">
              <el-table-column prop="index" label="主成分编号"></el-table-column>
              <el-table-column prop="percentage" label="所占比例"></el-table-column>
              <el-table-column prop="name" label="影响因素名称"></el-table-column>
              <el-table-column prop="factor" label="影响因素对应系数"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="postParams.method === '关联规则分析算法'">
          <el-form-item>
            <el-button @click="exportAprioriData"
                       :disabled="aprioriData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="挖掘结果表：">
            <el-table :data="aprioriData">
              <el-table-column prop="name" label="影响因素名称"></el-table-column>
              <el-table-column prop="score" label="影响因素强弱得分"></el-table-column>
              <el-table-column prop="confidence" label="置信度"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'DataMining',
  components: {
    YearRangeSelector,
  },
  mounted() {
    this.loadFactors();
    this.loadTags();
  },
  computed: {
    isFormComplete() {
      const params = this.$data.postParams;
      if (params.StartYear === null || params.EndYear === null) {
        return false;
      }
      if (params.factors.length === 0) {
        return false;
      }
      if (params.method.length === 0) {
        return false;
      }
      return true;
    },
  },
  methods: {
    loadTags() {
      this.$axios.get('/tags/query', {
        params: {
          tagType: 'MINING',
        },
      }).then((response) => {
        this.$data.knownTags = response.data.data;
      });
    },
    loadParameters() {
      this.$axios.get('/params/mining', {
        params: {
          tag: this.$data.currentTag,
        },
      }).then((response) => {
        this.$data.postParams = response.data.data;
      });
    },
    loadFactors() {
      this.$axios.get('/factor/query').then((response) => {
        response.data.data.forEach((element) => {
          this.$data.knownFactors.push({
            label: element,
            key: element,
          });
        });
      });
    },
    commitMining() {
      const params = this.$data.postParams;
      params.econamelist = this.$data.postParams.factors;
      this.$axios.post('/mining/request', params).then((response) => {
        this.$messenger.success('数据挖掘成功。');
        if (params.method === 'K均值算法') {
          this.$data.kMeansData = [];
          let index = 1;
          response.data.data.Clusters.forEach((elem) => {
            this.$data.kMeansData.push({
              index,
              members: elem.join('、'),
            });
            index += 1;
          });
        } else if (params.method === '主成分分析算法') {
          this.$data.pcaData = [];
          for (let factorIndex = 0;
            factorIndex < response.data.data.N_components.length;
            factorIndex += 1) {
            for (let innerIndex = 0;
              innerIndex < response.data.data.FactorName.length;
              innerIndex += 1) {
              this.$data.pcaData.push({
                index: factorIndex + 1,
                percentage: response.data.data.ComponetRatio[factorIndex],
                name: response.data.data.FactorName[innerIndex],
                factor: response.data.data.Vectors[factorIndex][innerIndex],
              });
            }
          }
        } else if (params.method === '关联规则分析算法') {
          this.$data.aprioriData = [];
          for (let i = 0; i < response.data.data.FactorsName.length; i += 1) {
            this.$data.aprioriData.push({
              name: response.data.data.FactorsName[i],
              score: response.data.data.Score[i],
              confidence: response.data.data.Confidence[i],
            });
          }
        }
      });
    },
    goToResultPage() {
      window.location = '/#/miningResult';
    },
    exportKMeansData() {
      this.exportTableSheet(this.$data.kMeansData, ['index', 'members']);
    },
    exportPCAData() {
      this.exportTableSheet(this.$data.pcaData, ['index', 'percentage', 'name', 'factor']);
    },
    exportAprioriData() {
      this.exportTableSheet(this.$data.aprioriData, ['name', 'score', 'confidence']);
    },
    exportTableSheet(rawData, fields) {
      const data = json2csv.parse(rawData, {
        fields,
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, 'database.csv');
    },
  },
  data() {
    return {
      allMethods: [{
        label: 'K均值算法',
        value: 'K均值算法',
      }, {
        label: '主成分分析算法',
        value: '主成分分析算法',
      }, {
        label: '关联规则分析算法',
        value: '关联规则分析算法',
      }],
      knownFactors: [],
      knownTags: [],
      requiredParams: [],
      currentTag: null,
      suggestCategoryCount: null,
      miningResults: [],
      postParams: {
        method: '',
        factors: [],
        StartYear: null,
        EndYear: null,
        tag: '',
        tagType: 'MINING',
      },
      kMeansData: [],
      pcaData: [],
      aprioriData: [],
    };
  },
  watch: {
    // eslint-disable-next-line func-names
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
};
</script>

<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

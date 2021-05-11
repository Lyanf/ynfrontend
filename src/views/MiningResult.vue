<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="5">
        <el-form>
          <el-form-item label="方案选择：">
            <el-select v-model="selectedPlans" multiple placeholder="请选择">
              <el-option
                v-for="item in miningResults"
                :key="item.tag"
                :label="item.tag"
                :value="item.tag">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateTableDisplay"
            :disabled="selectedPlans.length === 0">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="12">
        <el-form>
        <div v-if="kMeansData.length !== 0">
          <el-form-item>
            <el-button @click="exportKMeansData"
                       :disabled="kMeansData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="K 均值挖掘结果表：">
            <el-table :data="kMeansData">
              <el-table-column prop="tag" label="预测方案"></el-table-column>
              <el-table-column prop="index" label="类别序号"></el-table-column>
              <el-table-column prop="members" label="成员"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="pcaData.length !== 0">
          <el-form-item>
            <el-button @click="exportPCAData"
                       :disabled="pcaData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="主成分分析挖掘结果表：">
            <el-table :data="pcaData">
              <el-table-column prop="tag" label="预测方案"></el-table-column>
              <el-table-column prop="index" label="主成分编号"></el-table-column>
              <el-table-column prop="percentage" label="所占比例"></el-table-column>
              <el-table-column prop="name" label="影响因素名称"></el-table-column>
              <el-table-column prop="factor" label="影响因素对应系数"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div v-if="aprioriData.length !== 0">
          <el-form-item>
            <el-button @click="exportAprioriData"
                       :disabled="aprioriData.length === 0">导出表格</el-button>
          </el-form-item>
          <el-form-item label="关联规则挖掘结果表：">
            <el-table :data="aprioriData">
              <el-table-column prop="tag" label="预测方案"></el-table-column>
              <el-table-column prop="name" label="影响因素名称"></el-table-column>
              <el-table-column prop="score" label="影响因素强弱得分"></el-table-column>
              <el-table-column prop="confidence" label="置信度"></el-table-column>
            </el-table>
          </el-form-item>
        </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'MiningResult',
  data() {
    return {
      selectedPlans: [],
      miningResults: [],
      kMeansData: [],
      pcaData: [],
      aprioriData: [],
    };
  },
  mounted() {
    this.loadMiningResults();
  },
  methods: {
    loadMiningResults() {
      this.$axios.get('/mining/results').then((response) => {
        this.$data.miningResults = response.data.data;
      });
    },
    updateTableDisplay() {
      this.$data.kMeansData = [];
      this.$data.pcaData = [];
      this.$data.aprioriData = [];
      this.$data.selectedPlans.forEach((tag) => {
        this.$axios.get('/predict/results/detail', {
          params: {
            tag,
          },
        }).then((paramrp) => {
          const { result } = paramrp.data.data;
          const { arg } = paramrp.data.data;
          if (arg.method === 'K均值算法') {
            let index = 1;
            result.Clusters.forEach((elem) => {
              this.$data.kMeansData.push({
                tag,
                index,
                members: elem.join('、'),
              });
              index += 1;
            });
          } else if (arg.method === '主成分分析算法') {
            for (let factorIndex = 0;
              factorIndex < result.N_components.length;
              factorIndex += 1) {
              for (let innerIndex = 0;
                innerIndex < result.FactorName.length;
                innerIndex += 1) {
                this.$data.pcaData.push({
                  tag,
                  index: factorIndex + 1,
                  percentage: result.ComponetRatio[factorIndex],
                  name: result.FactorName[innerIndex],
                  factor: result.Vectors[factorIndex][innerIndex],
                });
              }
            }
          } else if (arg.method === '关联规则分析算法') {
            for (let i = 0; i < result.FactorsName.length; i += 1) {
              this.$data.aprioriData.push({
                tag,
                name: result.FactorsName[i],
                score: result.Score[i],
                confidence: result.Confidence[i],
              });
            }
          }
        });
      });
    },
    exportTableSheet(raw, fields) {
      const data = json2csv.parse(raw, {
        fields,
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, '挖掘结果表.csv');
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
  },
};
</script>

<style scoped>

</style>

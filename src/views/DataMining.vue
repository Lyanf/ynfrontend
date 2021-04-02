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
          <el-form-item :label="param.label + '：'">
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
  </el-row>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

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
      this.$axios.post('/mining/request', this.$data.postParams).then((response) => {
        this.$messenger.success('数据挖掘成功。');
        this.$data.miningResults = response.data.data;
      });
    },
    goToResultPage() {
      window.location = '/#/miningResult';
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
    };
  },
  watch: {
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

<template>
  <el-row>
    <el-col style="height: 100%" :offset="1" :span="11">
      <el-row>
        <el-transfer
          filterable
          filter-placeholder="输入以查找"
          v-model="postParams.factors"
          :data="knownFactors"
          :titles="['待选择影响因素', '已选择影响因素']"
          :button-texts="['移除', '添加']"
          style="height: 100%"
          @change="loadSuggestedCategoryCount"
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
    <el-col :span="10" :offset="1" style="margin-right: 20px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="选择地区：">
          <el-select placeholder="请选择" v-model="postParams.region">
            <el-option
              v-for="item in knownRegions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
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
        <el-form-item v-if="postParams.method==='Pearson'" label="皮尔逊系数阈值：">
          <el-slider
            v-model="postParams.pearson.threshold"
            show-input
            :step="0.01"
            :max="1"
            :min="0">
          </el-slider>
        </el-form-item>
        <el-form-item v-if="postParams.method==='KMeans'" label="分类数：">
          <el-slider
            v-model="postParams.kMeans.categoryCount"
            show-input
            show-stops="true"
            :max="postParams.factors.length"
            :min="0"
            :disabled="postParams.factors.length === 0">
          </el-slider>
        </el-form-item>
        <el-form-item
          v-if="postParams.method==='KMeans' && postParams.factors.length === 0">
          <div style="color: darkred; font-size: 13px">请至少先加入一个影响因素。</div>
        </el-form-item>
        <el-form-item
          v-if="postParams.method==='KMeans' && postParams.factors.length !== 0">
          <div style="font-size: 13px">
            推荐您将分类数设置为 {{suggestCategoryCount}}。
          </div>
        </el-form-item>
        <el-form-item v-if="postParams.method==='PCA'" label="系数绝对值阈值：">
          <el-slider
            v-model="postParams.PCA.absThreshold"
            show-input
            :step="0.01"
            :max="1"
            :min="0">
          </el-slider>
        </el-form-item>
        <el-form-item v-if="postParams.method==='ARL'" label="最小支持度：">
          <el-slider
            v-model="postParams.ARL.minSupport"
            show-input
            :step="0.01"
            :max="1"
            :min="0">
          </el-slider>
        </el-form-item>
        <el-form-item v-if="postParams.method==='ARL'" label="最小置信度：">
          <el-slider
            v-model="postParams.ARL.minConfidence"
            show-input
            :step="0.01"
            :max="1"
            :min="0">
          </el-slider>
        </el-form-item>
        <el-form-item label="数据年份：">
          <year-range-selector :begin-year.sync="postParams.beginYear"
                               :end-year.sync="postParams.endYear">
          </year-range-selector>
        </el-form-item>
        <el-form-item label="方案标签：">
          <el-input placeholder="请输入" v-model="postParams.tag">
          </el-input>
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
    this.loadRegions();
    this.loadSuggestedCategoryCount();
  },
  computed: {
    isFormComplete() {
      const params = this.$data.postParams;
      if (params.beginYear === '' || params.endYear === '') {
        return false;
      }
      if (params.factors.length === 0) {
        return false;
      }
      if (params.region.length === 0) {
        return false;
      }
      if (params.method.length === 0) {
        return false;
      }
      if (params.tag.length === 0) {
        return false;
      }
      if (params.method === 'Pearson') {
        return params.pearson.threshold.length !== 0;
      }
      if (params.method === 'KMeans') {
        return params.kMeans.categoryCount !== 0;
      }
      if (params.method === 'PCA') {
        return params.PCA.absThreshold.length !== 0;
      }
      if (params.method === 'ARL') {
        return params.ARL.minConfidence.length !== 0
          && params.ARL.minSupport.length !== 0;
      }
      return false;
    },
  },
  methods: {
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.knownRegions = response.data.data;
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
    loadSuggestedCategoryCount() {
      this.$axios.get('/mining/factor/kmeans/suggest', {
        params: {
          factors: this.$data.postParams.factors.join(),
        },
      }).then((response) => {
        this.$data.suggestCategoryCount = response.data.data.count;
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
        label: '皮尔逊相关系数算法',
        value: 'Pearson',
      }, {
        label: 'K均值算法',
        value: 'KMeans',
      }, {
        label: '主成分分析算法',
        value: 'PCA',
      }, {
        label: '关联规则分析算法',
        value: 'ARL',
      }],
      knownRegions: [],
      knownFactors: [],
      suggestCategoryCount: undefined,
      miningResults: [],
      postParams: {
        region: '',
        factors: [],
        method: '',
        pearson: {
          threshold: 0.5,
        },
        kMeans: {
          categoryCount: 0,
        },
        PCA: {
          absThreshold: 0.5,
        },
        ARL: {
          minSupport: 0.5,
          minConfidence: 0.5,
        },
        beginYear: '',
        endYear: '',
        tag: '',
      },
    };
  },
};
</script>

<style scoped>
.el-input, .el-select {
  width: 60%
}
</style>

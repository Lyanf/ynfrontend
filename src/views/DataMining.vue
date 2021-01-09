<template>
  <el-row>
    <el-col style="height: 100%" :offset="1" :span="11">
      <el-row>
        <el-transfer
          filterable
          filter-placeholder="输入以查找"
          v-model="postParams.Factors"
          :data="knownFactors"
          :titles="['待选择影响因素', '已选择影响因素']"
          style="height: 100%"
        >
        </el-transfer>
      </el-row>
      <el-row style="margin-top: 5em">
        <span >挖掘结果</span>
      </el-row>
      <el-row style="margin-top: 2em" >
        <el-tag >第一产业产值</el-tag>
        <el-divider direction="vertical"></el-divider>

        <el-tag >GDP</el-tag>
        <el-divider direction="vertical"></el-divider>

        <el-tag>第二产业产值</el-tag>
      </el-row>
    </el-col>
    <el-col :span="10" :offset="1" style="margin-right: 20px">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="选择地区：">
          <el-select placeholder="请选择" v-model="postParams.Region">
            <el-option
              v-for="item in knownRegions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挖掘方法：">
          <el-select placeholder="请选择" v-model="postParams.Method">
            <el-option
              v-for="item in allMethods"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="postParams.Method==='Pearson'" label="皮尔逊系数阈值：">
          <el-input placeholder="请填写 0 至 1 的小数"
                    type="number"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    v-model="postParams.Pearson.threshold"></el-input>
        </el-form-item>
        <el-form-item v-if="postParams.Method==='KMeans'" label="分类数：">
          <el-input placeholder="请填写" v-model="postParams.KMeans.categoryCount"></el-input>
        </el-form-item>
        <el-form-item v-if="postParams.Method==='KMeans'" label="推荐最佳分类数：">
          {{suggestCategoryCount}}
        </el-form-item>
        <el-form-item v-if="postParams.Method==='PCA'" label="系数绝对值阈值：">
          <el-input placeholder="请填写" v-model="postParams.PCA.absThreshold"></el-input>
        </el-form-item>
        <el-form-item v-if="postParams.Method==='ARL'" label="最小支持度：">
          <el-input placeholder="请填写" v-model="postParams.ARL.minSupport"></el-input>
        </el-form-item>
        <el-form-item v-if="postParams.Method==='ARL'" label="最小置信度：">
          <el-input placeholder="请填写" v-model="postParams.ARL.minConfidence"></el-input>
        </el-form-item>
        <el-form-item label="数据年份：">
          <year-range-selector :begin-year="postParams.beginYear"
                               :end-year="postParams.endYear">
          </year-range-selector>
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
      if (params.beginYear === undefined || params.endYear === undefined) {
        return false;
      }
      if (params.Factors.length === 0) {
        return false;
      }
      if (params.Region.length === 0) {
        return false;
      }
      if (params.Method.length === 0) {
        return false;
      }
      if (params.Method === 'Pearson') {
        return params.Pearson.threshold.length !== 0;
      }
      if (params.Method === 'KMeans') {
        return params.KMeans.categoryCount.length !== 0;
      }
      if (params.Method === 'PCA') {
        return params.PCA.absThreshold.length !== 0;
      }
      if (params.Method === 'ARL') {
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
      this.$axios.get('/mining/factor/query').then((response) => {
        response.data.data.forEach((element) => {
          this.$data.knownFactors.push({
            label: element,
            key: element,
          });
        });
      });
    },
    loadSuggestedCategoryCount() {
      this.$axios.get('/mining/factor/kmeans/suggest').then((response) => {
        this.$data.suggestCategoryCount = response.data.data.Count;
      });
    },
    commitMining() {
      this.$axios.post('/mining/request', this.$data.postParams).then((response) => {
        console.log(response);
        this.$messenger.success('数据挖掘请求提交成功。');
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
      postParams: {
        Region: '',
        Factors: [],
        Method: '',
        Pearson: {
          threshold: '',
        },
        KMeans: {
          categoryCount: '',
        },
        PCA: {
          absThreshold: '',
        },
        ARL: {
          minSupport: '',
          minConfidence: '',
        },
        beginYear: '',
        endYear: '',
      },
    };
  },
};
</script>

<style scoped>

</style>

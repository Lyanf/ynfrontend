<template>
  <div>
    Deprecated
  </div>
</template>

<script>

export default {
  name: 'SelectMiningMethod',
  data() {
    return {
      formData: {},
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
      postParams: {
        Region: undefined,
        Method: undefined,
        Pearson: {
          threshold: undefined,
        },
        KMeans: {
          suggestCategoryCount: undefined,
          categoryCount: undefined,
        },
        PCA: {
          absThreshold: undefined,
        },
        ARL: {
          minSupport: undefined,
          minConfidence: undefined,
        },
        beginYear: undefined,
        endYear: undefined,
      },
    };
  },
  props() {
    return {};
  },
  methods: {
    goToResultPage() {
      console.log(123);
      window.location = '/#/miningResult';
    },
  },
};
</script>

<style scoped>

</style>

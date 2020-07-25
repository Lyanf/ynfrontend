<template>
  <el-transfer
    filterable
    filter-placeholder="输入以查找"
    v-model="choosenFactors"
    :data="originalFactors"
    @change="show" style="height: 100%"
  >
  </el-transfer>
</template>

<script>
export default {
  name: 'ChooseInfluenceFactor',
  data() {
    function generateData() {
      const data = [];
      const cities = ['GDP', '人口', '城镇人口', '第一产业产值', '第二产业产值', '第三产业产值', '第四产业产值'];
      cities.forEach((city) => {
        data.push({
          label: city,
          key: city,
        });
      });
      return data;
    }
    return {
      choosenFactors: [],
      originalFactors: generateData(),
      // [
      //   {
      //     label: '人均GDP',
      //     index: 1,
      //   },
      //   {
      //     label: '城镇人口',
      //     index: 2,
      //   },
      //   {
      //     label: '乡村人口',
      //     index: 3,
      //   },
      //   {
      //     label: '第一产业产值',
      //     index: 4,
      //   },
      // ],
    };
  },
  methods: {
    show() {
      console.log(this.choosenFactors);
      console.log(this.originalFactors);
    },
  },
};
</script>

<style scoped>

</style>

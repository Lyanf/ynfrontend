<template>
  <div>
    <el-row style="margin-bottom: 5em">
      <el-col :span="4" :offset="8">
        <el-cascader id="cascader" :options="metaDataTree"
                     ref="cascader" v-model="selectedMetaData"></el-cascader>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button>查找</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MetaDataTree',
  data() {
    return {
      metaDataTree: [],
      selectedMetaData: '',
    };
  },
  methods: {
    loadMetaData() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.metaDataTree = response.data.data;
      });
    },
  },
  mounted() {
    this.loadMetaData();
  },
};
</script>

<style scoped>

</style>

<template>
  <div>
    <el-row style="margin-bottom: 5em">
      <el-col :span="4" :offset="8">
        <el-cascader id="cascader" :options="metaDataTree"
                     ref="cascader" v-model="selectedMetaData"></el-cascader>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button @click="performQuery"
                   :disabled="!(selectedMetaData.length > 0)"
                    type="primary">查找</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MetaDataTree',
  props: ['category', 'dataResult'],
  data() {
    return {
      metaDataTree: [],
      selectedMetaData: [],
      dataResultInternal: this.dataResult,
    };
  },
  watch: {
    dataResultInternal(value) {
      this.$emit('update:dataResult', value);
    },
  },
  methods: {
    loadMetaData() {
      this.$axios.get('/db/metadata', {
        params: {
          Category: this.category,
        },
      }).then((response) => {
        this.$data.metaDataTree = response.data.data;
      });
    },
    performQuery() {
      this.$axios.get('/db/query', {
        params: {
          Category: this.category,
          Metadata: this.selectedMetaData.join(),
        },
      }).then((response) => {
        this.$data.dataResultInternal = response.data.data;
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

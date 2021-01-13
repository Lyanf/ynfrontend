<template>
  <el-row>
    <el-col :span="8" :offset="1">
      <el-form>
        <el-form-item label="数据节点：">
          <el-cascader id="cascader" :options="metaDataTree"
                       ref="cascader" v-model="postParams.category"></el-cascader>
        </el-form-item>
        <el-form-item label="年份选择：">
          <year-range-selector
            :begin-year.sync="postParams.beginYear"
            :end-year.sync="postParams.endYear">
          </year-range-selector>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="postParams.beginYear === null ||
                        postParams.endYear  === null ||
                        postParams.category.length === 0"
            @click="loadExceptions">
            异常检测
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="15">
      <data-patch-table :display-data="tableData">
      </data-patch-table>
    </el-col>
  </el-row>
</template>

<script>
import DataPatchTable from '@/components/DataPatchTable.vue';
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'dataCheck',
  components: { YearRangeSelector, DataPatchTable },
  data() {
    return {
      tableData: [],
      metaDataTree: [],
      postParams: {
        category: [],
        beginYear: null,
        endYear: null,
      },
    };
  },
  mounted() {
    this.loadMetaData();
  },
  methods: {
    loadMetaData() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.metaDataTree = response.data.data;
      });
    },
    loadExceptions() {
      this.$axios.post('/db/except/query', this.$data.postParams).then((response) => {
        this.tableData = response.data.data;
      });
    },
  },
};
</script>

<style scoped>

</style>

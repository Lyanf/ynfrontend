<template>
  <el-row>
    <el-col :span="8" :offset="1">
      <el-form>
        <el-form-item label="数据节点：">
          <el-cascader id="cascader" :options="metaDataTree"
                       change-on-select
                       ref="cascader" v-model="postParams.category"></el-cascader>
        </el-form-item>
        <el-form-item label="地区选择：">
          <el-select placeholder="请选择" v-model="postParams.region">
            <el-option
              v-for="item in knownRegions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="粒度选择：">
          <el-select placeholder="请选择" value="年" :disabled="true">
<!--            <el-option-->
<!--              v-for="item in knownGrains"-->
<!--              :key="item"-->
<!--              :label="item"-->
<!--              :value="item">-->
<!--            </el-option>-->
          </el-select>
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
      knownRegions: [],
      knownGrains: [],
      postParams: {
        category: [],
        region: null,
        grain: '年',
        beginYear: null,
        endYear: null,
      },
    };
  },
  mounted() {
    this.loadMetaData();
    this.loadRegions();
    this.loadGrains();
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
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.knownRegions = response.data.data;
      });
    },
    loadGrains() {
      this.$axios.get('/grain/query').then((response) => {
        this.$data.knownGrains = response.data.data;
      });
    },
  },
};
</script>

<style scoped>
.el-form-item .el-select,.el-input,.el-cascader {
  width: 55%;
}
</style>

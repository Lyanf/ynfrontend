<template>
  <div>
    <el-form type="flex" justify="right">
      <el-form-item label="数据节点：">
        <el-cascader id="cascader" :options="metaDataTree"
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
        <el-select placeholder="请选择" v-model="postParams.grain">
          <el-option
            v-for="item in knownGrains"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据年份：">
        <year-range-selector :begin-year.sync="postParams.beginYear"
                             :end-year.sync="postParams.endYear">
        </year-range-selector>
      </el-form-item>
      <el-form-item>
        <el-button @click="performQuery"
                   :disabled="!canMakeQuery"
                    type="primary">查找</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';

export default {
  name: 'MetaDataTree',
  props: ['category', 'dataResult'],
  components: {
    YearRangeSelector,
  },
  data() {
    return {
      metaDataTree: [],
      knownRegions: [],
      knownGrains: [],
      dataResultInternal: this.dataResult,
      postParams: {
        category: [],
        region: '',
        grain: '',
        beginYear: null,
        endYear: null,
      },
    };
  },
  computed: {
    canMakeQuery() {
      const params = this.$data.postParams;
      if (params.region.length === 0) {
        return false;
      }
      if (params.grain.length === 0) {
        return false;
      }
      if (params.beginYear === null || params.endYear === null) {
        return false;
      }
      if (params.category === []) {
        return false;
      }
      return true;
    },
  },
  watch: {
    dataResultInternal(value) {
      this.$emit('update:dataResult', value);
    },
    'postParams.category': function (value) {
      this.$emit('update:category', value);
    },
  },
  methods: {
    loadMetaData() {
      this.$axios.get('/db/metadata').then((response) => {
        this.$data.metaDataTree = response.data.data;
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
    performQuery() {
      this.$axios.post('/db/query', this.$data.postParams).then((response) => {
        this.$data.dataResultInternal = response.data.data;
      });
    },
  },
  mounted() {
    this.loadMetaData();
    this.loadRegions();
    this.loadGrains();
  },
};
</script>

<style scoped>

</style>

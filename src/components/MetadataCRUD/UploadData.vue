<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="数据年份">
      <year-range-selector
        :begin-year.sync='beginYear'
        :end-year.sync="endYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item label="一级类型">
      <el-select v-model="currentMajorCategory">
        <el-option v-for="item in majorCategories"
                   :key="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级类型">
      <el-select multiple v-model="currentMinorCategory">
        <el-option v-for="item in minorCategories[currentMajorCategory]"
                   :key="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="地区">
      <el-select v-model="currentRegion">
        <el-option v-for="item in knownRegions"
                   :key="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="粒度">
      <el-select v-model="currentGrain">
        <el-option v-for="item in knownGrains"
                   :key="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 :disabled="!canCommitGenerate"
                 @click="generateTemplate">
        生成
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import YearRangeSelector from '@/components/YearRangeSelector.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'UploadData',
  components: { YearRangeSelector },
  data() {
    return {
      currentMajorCategory: '',
      currentMinorCategory: [],
      currentGrain: '',
      currentRegion: '',
      majorCategories: [],
      minorCategories: {},
      knownGrains: [],
      knownRegions: [],
      beginYear: null,
      endYear: null,
      zh2enGrainMapper: {
        年: 'year',
        月: 'month',
        日: 'day',
        时: 'hour',
      },
    };
  },
  methods: {
    loadMetadata() {
      this.$axios.get('/brand/new/metadata/get').then((response) => {
        this.$data.minorCategories = response.data.data;
        this.$data.majorCategories = [];
        Object.keys(this.$data.minorCategories).forEach((key) => {
          this.$data.majorCategories.push(key);
        });
      });
    },
    loadGrains() {
      this.$axios.get('/grain/query').then((response) => {
        this.$data.knownGrains = response.data.data;
      });
    },
    loadRegions() {
      this.$axios.get('/region/query').then((response) => {
        this.$data.knownRegions = response.data.data;
      });
    },
    generateTemplate() {
      const fileName = `${this.$data.currentRegion}_\
${this.$data.zh2enGrainMapper[this.$data.currentGrain]}_\
${this.$data.currentMajorCategory}`;
      const raw = [];
      for (let i = this.$data.beginYear; i <= this.$data.endYear; i += 1) {
        const bloc = {
          year: i,
        };
        this.$data.currentMinorCategory.forEach((elem) => {
          bloc[elem] = null;
        });
        raw.push(bloc);
      }
      const data = json2csv.parse(raw, {
        fields: ['year'].concat(this.$data.currentMinorCategory),
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, fileName);
    },
  },
  mounted() {
    this.loadMetadata();
    this.loadGrains();
    this.loadRegions();
  },
  computed: {
    canCommitGenerate() {
      if (this.$data.currentGrain.length === 0) {
        return false;
      }
      if (this.$data.currentRegion.length === 0) {
        return false;
      }
      if (this.$data.currentMajorCategory.length === 0) {
        return false;
      }
      if (this.$data.currentMinorCategory.length === 0) {
        return false;
      }
      if (this.$data.beginYear === null || this.$data.endYear === null) {
        return false;
      }
      return true;
    },
  },
  watch: {
    currentMajorCategory() {
      this.$data.currentMinorCategory = [];
    },
  },
};
</script>

<style scoped>
.el-select, .el-input, .el-cascader {
  width: 60%;
}
</style>

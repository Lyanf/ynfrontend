<template>
  <el-form label-position="right" label-width="14%">
    <el-form-item label="粒度">
      <el-select v-model="currentGrain">
        <el-option v-for="item in knownGrains"
                   :key="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="currentGrain === '年'" label="数据年份">
      <year-range-selector
        :begin-year.sync='beginYear'
        :end-year.sync="endYear">
      </year-range-selector>
    </el-form-item>
    <el-form-item v-if="currentGrain === '月'" label="数据月份">
      <el-date-picker type="monthrange"
                      range-separator="至"
                      start-placeholder="起始月份"
                      end-placeholder="终止月份"
                      v-model="monthRange"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-if="currentGrain === '日'" label="数据日期">
      <el-date-picker type="daterange"
                      range-separator="至"
                      start-placeholder="起始日期"
                      end-placeholder="终止日期"
                      v-model="dateRange"
      ></el-date-picker>
    </el-form-item>
    <el-form-item v-if="currentGrain === '时'" label="数据时间">
      <el-date-picker type="daterange"
                      range-separator="至"
                      start-placeholder="起始时间"
                      end-placeholder="终止时间"
                      v-model="timeRange"
      ></el-date-picker>
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
      monthRange: [],
      dateRange: [],
      timeRange: [],
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
      let data = null;
      if (this.$data.currentGrain === '年') {
        for (let i = this.$data.beginYear; i <= this.$data.endYear; i += 1) {
          const bloc = {
            year: i,
          };
          this.$data.currentMinorCategory.forEach((elem) => {
            bloc[elem] = null;
          });
          raw.push(bloc);
        }
        data = json2csv.parse(raw, {
          fields: ['year'].concat(this.$data.currentMinorCategory),
        });
      } else if (this.$data.currentGrain === '月') {
        const from = this.$data.monthRange[0];
        const to = this.$data.monthRange[1];

        for (let month = from; month <= to; month.setMonth(month.getMonth() + 1)) {
          const bloc = {
            month: month.format('yyyy-MM'),
          };
          this.$data.currentMinorCategory.forEach((elem) => {
            bloc[elem] = null;
          });
          raw.push(bloc);
        }
        data = json2csv.parse(raw, {
          fields: ['month'].concat(this.$data.currentMinorCategory),
        });
      } else if (this.$data.currentGrain === '日') {
        const from = this.$data.dateRange[0];
        const to = this.$data.dateRange[1];

        for (let day = from; day <= to; day.setDate(day.getDate() + 1)) {
          const bloc = {
            day: day.format('yyyy-MM-dd'),
          };
          this.$data.currentMinorCategory.forEach((elem) => {
            bloc[elem] = null;
          });
          raw.push(bloc);
        }
        data = json2csv.parse(raw, {
          fields: ['day'].concat(this.$data.currentMinorCategory),
        });
      } else if (this.$data.currentGrain === '时') {
        const from = this.$data.timeRange[0];
        const to = this.$data.timeRange[1];

        for (let day = from; day <= to; day.setDate(day.getDate() + 1)) {
          for (let hour = 0; hour < 24; hour += 1) {
            const bloc = {
              time: `${day.format('yyyy-MM-dd')} ${hour}:00`,
            };
            this.$data.currentMinorCategory.forEach((elem) => {
              bloc[elem] = null;
            });
            raw.push(bloc);
          }
        }
        data = json2csv.parse(raw, {
          fields: ['time'].concat(this.$data.currentMinorCategory),
        });
      }
      const blob = new Blob([`\ufeff${data}`], { type: 'text/csv;charset=utf-8' });
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
      if (this.$data.currentGrain === '年') {
        if (this.$data.beginYear === null || this.$data.endYear === null) {
          return false;
        }
      } else if (this.$data.currentGrain === '月') {
        if (this.$data.monthRange.length === 0) {
          return false;
        }
      } else if (this.$data.currentGrain === '日') {
        if (this.$data.dateRange.length === 0) {
          return false;
        }
      } else if (this.$data.currentGrain === '时') {
        if (this.$data.timeRange.length === 0) {
          return false;
        }
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

<template>
  <el-row type="flex" justify="left" :style="mainStyle">
    <el-col>
      <el-date-picker
        v-model="beginYearInternal"
        type="year"
        placeholder="起始年份"
        @change="beginChange"/>
    </el-col>
    <el-col style="margin: auto; text-align: center; color: lightgray; font-size: 12px">
      至
    </el-col>
    <el-col>
      <el-date-picker
        v-model="endYearInternal"
        type="year"
        placeholder="终止年份"
        @change="endChange"/>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'YearRangeSelector',
  props: ['beginYear', 'endYear', 'expand'],
  data() {
    return {
      beginYearInternal: this.beginYear,
      endYearInternal: this.endYear,
    };
  },
  methods: {
    beginChange(value) {
      if (value === null) {
        this.$emit('update:beginYear', null);
      } else {
        this.$emit('update:beginYear', value.getFullYear());
      }
    },
    endChange(value) {
      if (value === null) {
        this.$emit('update:endYear', null);
      } else {
        this.$emit('update:endYear', value.getFullYear());
      }
    },
  },
  watch: {
    beginYearInternal(value) {
      if (value === null) {
        this.$emit('update:beginYear', null);
        return;
      }
      this.$emit('update:beginYear', value.getFullYear());
      if (this.$data.endYearInternal === null
        || this.$data.endYearInternal < value) {
        this.$data.endYearInternal = value;
        this.$emit('update:endYear', value.getFullYear());
      }
    },
    endYearInternal(value) {
      if (value === null) {
        this.$emit('update:endYear', null);
        return;
      }
      this.$emit('update:endYear', value.getFullYear());
      if (this.$data.beginYearInternal === null
        || this.$data.beginYearInternal > value) {
        this.$data.beginYearInternal = value;
        this.$emit('update:beginYear', value.getFullYear());
      }
    },
    beginYear(value) {
      if (value !== null) {
        this.beginYearInternal = new Date(value, 1, 1);
      } else {
        this.beginYearInternal = null;
      }
    },
    endYear(value) {
      if (value !== null) {
        this.endYearInternal = new Date(value, 1, 1);
      } else {
        this.endYearInternal = null;
      }
    },
  },
  computed: {
    mainStyle() {
      if (this.expand) {
        return '';
      }
      return 'width: 55%';
    },
  },
};
</script>

<style scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 120px;
}
</style>

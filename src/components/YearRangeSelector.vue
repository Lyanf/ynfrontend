<template>
  <el-row type="flex" justify="left" style="width: 55%">
    <el-col>
      <el-date-picker
        v-model="beginYearInternal"
        type="year"
        placeholder="起始年份"/>
    </el-col>
    <el-col style="margin: auto; text-align: center">
      至
    </el-col>
    <el-col>
      <el-date-picker
        v-model="endYearInternal"
        type="year"
        placeholder="终止年份"/>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'YearRangeSelector',
  props: ['beginYear', 'endYear'],
  data() {
    return {
      beginYearInternal: this.beginYear,
      endYearInternal: this.endYear,
    };
  },
  watch: {
    beginYearInternal(value) {
      this.$emit('update:beginYear', value.getFullYear());
      if (this.$data.endYearInternal < value) {
        this.$data.endYearInternal = value;
        this.$emit('update:endYear', value.getFullYear());
      }
    },
    endYearInternal(value) {
      this.$emit('update:endYear', value.getFullYear());
      if (this.$data.beginYearInternal > value) {
        this.$data.beginYearInternal = value;
        this.$emit('update:beginYear', value.getFullYear());
      }
    },
  },
};
</script>

<style scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 120px;
}
</style>

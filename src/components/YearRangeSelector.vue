<template>
  <div :style="getStyle"
    class="el-date-editor el-range-editor el-input__inner el-date-editor--year"
    ref="reference">
    <i :class="['el-input__icon', 'el-range__icon']"></i>
    <input
      v-model="beginYearInternal"
      autocomplete="off"
      placeholder="起始年份"
      clearable
      class="el-range-input">
    <slot name="range-separator">
      <span class="el-range-separator">至</span>
    </slot>
    <input
      v-model="endYearInternal"
      autocomplete="off"
      placeholder="终止年份"
      clearable
      class="el-range-input">
    <i
      class="el-input__icon el-range__close-icon">
    </i>
  </div>
</template>

<script>
export default {
  name: 'YearRangeSelector',
  props: ['beginYear', 'endYear', 'expand'],
  data() {
    return {
      beginYearInternal: this.beginYear,
      endYearInternal: this.endYear,
      yearStuff: [],
    };
  },
  watch: {
    beginYearInternal(value) {
      if (value === null) {
        this.$emit('update:beginYear', null);
        return;
      }
      this.$emit('update:beginYear', parseInt(value, 10));
      // if (this.$data.endYearInternal === null
      //   || this.$data.endYearInternal < value) {
      //   this.$data.endYearInternal = value;
      //   this.$emit('update:endYear', value.getFullYear());
      // }
    },
    endYearInternal(value) {
      if (value === null) {
        this.$emit('update:endYear', null);
        return;
      }
      this.$emit('update:endYear', parseInt(value, 10));
    },
    beginYear(value) {
      if (value !== null) {
        this.beginYearInternal = value;
      } else {
        this.beginYearInternal = null;
      }
    },
    endYear(value) {
      if (value !== null) {
        this.endYearInternal = value;
      } else {
        this.endYearInternal = null;
      }
    },
  },
  computed: {
    getStyle() {
      if (this.expand) {
        return 'width: 100%';
      }
      return 'width: 60%';
    },
  },
};
</script>

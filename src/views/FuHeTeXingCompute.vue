<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="日负荷特性指标计算">
      <!--      日负荷特性指标计算-->
      <el-row>
        <el-col :span="8">
          <el-date-picker type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          v-model="selectedDate"
          ></el-date-picker>
        </el-col>
        <el-button>计算</el-button>
      </el-row>
      <el-row>
        <el-table title='日负荷特性指标表'>
          <el-table-column label="日期"></el-table-column>
          <el-table-column label="日最大负荷"></el-table-column>
          <el-table-column label="日平均负荷"></el-table-column>
          <el-table-column label="日负荷率"></el-table-column>
          <el-table-column label="日最小负荷率"></el-table-column>
          <el-table-column label="日峰谷差"></el-table-column>
          <el-table-column label="日峰谷差率"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-button @click="dialog1Visible=true">日负荷曲线</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialog2Visible=true">典型日负荷曲线</el-button>
        </el-col>
        <el-col :span="4">
          <el-button v-print>打印</el-button>
        </el-col>
      </el-row>
      <el-dialog
        :visible.sync="dialog1Visible"
        width="50%">
        <ResultChart></ResultChart>
      </el-dialog>
      <el-dialog
        :visible.sync="dialog2Visible"
        width="50%">
        <ResultChart></ResultChart>
      </el-dialog>
    </el-tab-pane>

    <el-tab-pane label="月负荷特性指标计算">
      <el-row>
        <el-col :span="8">
          <el-date-picker type="monthrange"
                          range-separator="至"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          v-model="selectedDate"
          ></el-date-picker>
        </el-col>
        <el-button>计算</el-button>
      </el-row>
      <el-row>
        <el-table title='月负荷特性指标表'>
          <el-table-column label="年份"></el-table-column>
          <el-table-column label="月份"></el-table-column>
          <el-table-column label="月平均负荷"></el-table-column>
          <el-table-column label="月最大峰谷差"></el-table-column>
          <el-table-column label="月平均日负荷率"></el-table-column>
          <el-table-column label="月不均衡率系数"></el-table-column>
          <el-table-column label="月最小负荷率"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-button>负荷特性曲线</el-button>
        </el-col>
        <el-col :span="4">
          <el-button v-print>打印</el-button>
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="年负荷特性指标计算">
      <el-row>
        <el-col :span="10">
          <year-range-selector>
          </year-range-selector>
        </el-col>
        <el-button>计算</el-button>
      </el-row>
      <el-row>
        <el-table title='年负荷特性指标表'>
          <el-table-column label="年份"></el-table-column>
          <el-table-column label="年最大负荷"></el-table-column>
          <el-table-column label="年平均日负荷率"></el-table-column>
          <el-table-column label="季不均衡系数"></el-table-column>
          <el-table-column label="年最大峰谷差"></el-table-column>
          <el-table-column label="年最大峰谷差率"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-button>负荷曲线</el-button>
        </el-col>
        <el-col :span="4">
          <el-button v-print>打印</el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ResultChart from '@/components/ResultChart.vue';
import YearRangeSelector from '../components/YearRangeSelector.vue';

export default {
  name: 'FuHeTeXingCompute',
  components: { ResultChart, YearRangeSelector },
  data() {
    return {
      selectedDate: '',
      dialog1Visible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      dialog4Visible: false,
      dialog5Visible: false,
    };
  },
  methods: {
    button1Clicked() {

    },
  },
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 3em;
  }
</style>

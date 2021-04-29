<template>
  <div>
    <el-row>
      <el-col :span="7" :offset="1">
        <ProvMuniPredictSelectForm
        :table-three-data.sync="tableThreeData"
        :table-four-data.sync="tableFourData">
        </ProvMuniPredictSelectForm>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-form>
          <el-form-item v-show="currentChart !== undefined">
            <el-row>
              <div id="pieChart" style="width: 680px;height: 300px"></div>
            </el-row>
          </el-form-item>
          <el-form-item v-show="currentChart !== undefined">
            <el-button v-on:click="exportImage">导出图像</el-button>
            <el-button @click="exportResultSheet"
                       :disabled="displayTableData.length === 0">导出预测结果表</el-button>
          </el-form-item>
          <el-form-item label="预测年份的协调预测结果：">
            <el-table :data="displayTableData">
              <el-table-column label="年份" prop="year"></el-table-column>
              <el-table-column label="地区" prop="region"></el-table-column>
              <el-table-column label="预测值（单位：MW）" prop="payload"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>

          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProvMuniPredictSelectForm from '@/components/SelectForm/ProvMuniPredictSelectForm.vue';
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';
import * as echarts from 'echarts';

function base64ToBlob(code) {
  const parts = code.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export default {
  name: 'ProvMuniCoordPredict',
  data() {
    return {
      currentChart: undefined,
      tableThreeData: [],
      tableFourData: [],
      displayTableData: [],
    };
  },
  methods: {
    generateTable() {
      this.$data.displayTableData = [];
      const rawData = this.$data.tableThreeData;
      rawData.values.forEach((list) => {
        let regionIndex = 1;
        const year = list[0];
        rawData.series.slice(1).forEach((region) => {
          this.$data.displayTableData.push({
            year,
            region,
            payload: list[regionIndex],
          });
          regionIndex += 1;
        });
      });
    },
    refreshChart() {
      const data = this.$data.displayTableData;
      if (this.currentChart === undefined) {
        this.currentChart = echarts.init(document.getElementById('pieChart'));
      }
      const pieData = [];
      data.forEach((elem) => {
        pieData.push({
          name: `${elem.region}, ${elem.year} 年`,
          value: elem.payload,
        });
      });
      this.currentChart.setOption({
        series: [
          {
            name: '协调预测结果',
            type: 'pie',
            radius: '55%',
            data: pieData,
          },
        ],
      }, true);
    },
    exportResultSheet() {
      this.exportTableSheet(this.$data.displayTableData, ['year', 'region', 'payload']);
    },
    exportImage() {
      if (!this.currentChart) {
        return;
      }
      const content = this.currentChart.getDataURL();
      const blob = base64ToBlob(content);
      saveAs(blob, '协调预测结果图像.png');
    },
    exportTableSheet(rawData, fields) {
      const data = json2csv.parse(rawData, {
        fields,
      });
      const blob = new Blob([data], { type: 'text/csv' });
      saveAs(blob, '协调预测结果表格.csv');
    },
  },
  components: { ProvMuniPredictSelectForm },
  watch: {
    tableThreeData: {
      handler() {
        this.generateTable();
        this.refreshChart();
      },
      deep: true,
      immediate: false,
    },
  },
};
</script>

<style scoped>

</style>

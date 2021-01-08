<template>
  <div>
    <el-card>
      <span slot="header">
        <span>数据监测与更正</span>
      </span>
      <el-row>
        <el-col :span="8">
          <el-form label-width="300px">
            <el-form-item label="数据类型选择">
              <el-select placeholder="请选择" v-model="selectedDataType">
                <el-option v-for="item in knownDataTypes" :key="item" :value="item">{{ item }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="历史年份">
              <el-date-picker
                type="year"
                placeholder="请选择"
                v-model="historyYear"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                :disabled="selectedDataType === undefined || historyYear === undefined"
                @click="loadExceptions">
                异常检测
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14" :offset="2">
          <data-patch-table :display-data="tableData">
          </data-patch-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import DataPatchTable from '@/components/DataPatchTable.vue';

export default {
  name: 'dataCheck',
  components: { DataPatchTable },
  data() {
    return {
      knownDataTypes: [],
      tableData: [],
      selectedDataType: undefined,
      historyYear: undefined,
    };
  },
  mounted() {
    this.loadDataTypes();
  },
  methods: {
    loadDataTypes() {
      this.$axios.get('/db/dtypes').then((response) => {
        this.knownDataTypes = response.data.data;
      });
    },
    loadExceptions() {
      this.$axios.get('/db/except/query', {
        params: {
          Category: this.selectedDataType,
          Year: this.historyYear.getFullYear(),
        },
      }).then((response) => {
        this.tableData = response.data.data;
      });
    },
  },
};
</script>

<style scoped>

</style>

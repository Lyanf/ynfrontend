<template>
  <div>
    <el-card>
      <span slot="header">
        <span>电力电量数据</span>
      </span>
      <el-row justify="space-around">
        <MetaDataTree category="ElecPower" :data-result.sync="tableData"></MetaDataTree>
      </el-row>
      <el-row>
        <DataCRUDTable category="ElecPower" :display-data.sync="tableData"></DataCRUDTable>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import MetaDataTree from '@/components/MetaDataTree.vue';
import DataCRUDTable from '@/components/DataCRUDTable.vue';

export default {
  name: 'ElectricityPowerData',
  components: {
    DataCRUDTable,
    MetaDataTree,
  },
  data() {
    return {
      tableData: [],
    };
  },
};
</script>

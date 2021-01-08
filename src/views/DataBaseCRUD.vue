<template>
  <div>
    <el-card>
      <span slot="header">
        <span>全部数据</span>
      </span>
      <el-row justify="center">
        <MetaDataTree category="All" :data-result.sync="tableData"></MetaDataTree>
      </el-row>
      <el-row>
        <DataCRUDTable category="All" :display-data.sync="tableData"></DataCRUDTable>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import MetaDataTree from '@/components/MetaDataTree.vue';
import DataCRUDTable from '@/components/DataCRUDTable.vue';

export default {
  name: 'DataBaseCRUD',
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

<style scoped>

</style>

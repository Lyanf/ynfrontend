<template>
  <div>
    <el-card>
      <span slot="header">
        <span>社会经济数据</span>
      </span>
      <el-row justify="space-around">
        <MetaDataTree category="SocialEco" :data-result.sync="tableData"></MetaDataTree>
      </el-row>
      <el-row>
        <DataCRUDTable category="SocialEco" :display-data.sync="tableData"></DataCRUDTable>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MetaDataTree from '@/components/MetaDataTree.vue';
import DataCRUDTable from '@/components/DataCRUDTable.vue';

export default {
  name: 'SocialEcoData',
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

<template>
  <div>
    <el-card>
      <span slot="header">
        <span>地理气象数据</span>
      </span>
      <el-row justify="space-around">
        <MetaDataTree></MetaDataTree>
      </el-row>
      <el-row>
        <DataCRUDTable></DataCRUDTable>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MetaDataTree from '@/components/MetaDataTree.vue';
import DataCRUDTable from '@/components/DataCRUDTable.vue';

export default {
  name: 'GeoWeatherData',
  components: {
    DataCRUDTable,
    MetaDataTree,
  },
};
</script>

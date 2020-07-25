<template>
  <div>
    <MetaDataTree></MetaDataTree>
    <DataCRUDTable></DataCRUDTable>
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
};
</script>

<style scoped>

</style>

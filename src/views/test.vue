<template>
  <div>
    <DataCRUDTable></DataCRUDTable>
    <ChangeMetaDataTree></ChangeMetaDataTree>
    <MetaDataTree></MetaDataTree>
    <MixPredictSelectForm></MixPredictSelectForm>
  </div>
</template>

<script>
import DataCRUDTable from '@/components/DataCRUDTable.vue';
import ChangeMetaDataTree from '@/components/ChangeMetaDataTree.vue';
import MetaDataTree from '@/components/MetaDataTree.vue';
import MixPredictSelectForm from '@/components/MixPredictSelectForm.vue';

export default {
  name: 'test',
  components: {
    MixPredictSelectForm,
    MetaDataTree,
    ChangeMetaDataTree,
    DataCRUDTable,
  },
};
</script>

<style scoped>

</style>

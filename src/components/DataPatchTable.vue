<template>
  <div>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="displayData"

      @dialog-cancel="handleDialogCancel"

      :rowHandle="rowHandle"
      :edit-template="editTemplate"
      @row-edit="handleRowResolve"
      @row-remove="handleRowAccept"

    ></d2-crud>
    <div style="color: darkgray; font-size: 12px">
      共 {{ dataEntryLength }} 条
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataPatchTable',
  props: ['displayData'],
  computed: {
    dataEntryLength() {
      if (this.displayData === undefined) {
        return 0;
      }
      return this.displayData.length;
    },
  },
  data() {
    return {
      columns: [{
        title: '元数据类型',
        key: 'category',
      }, {
        title: '数据粒度',
        key: 'grain',
      }, {
        title: '地区',
        key: 'region',
      }, {
        title: '时间',
        key: 'key',
      }, {
        title: '当前值',
        key: 'value',
      }, {
        title: '更正建议',
        key: 'suggest',
      }],

      editTemplate: {
        key: {
          title: '键',
        },
        value: {
          title: '值',
        },
      },

      rowHandle: {
        remove: {
          text: '接受',
          size: 'small',
          type: 'primary',
          confirm: false,
        },
        edit: {
          text: '更正',
          size: 'small',
          fixed: 'right',
        },
      },
    };
  },
  methods:
    {
      handleDialogCancel(done) {
        done();
      },
      handleRowResolve({ index, row }, done) {
        this.$axios.post('/db/except/resolve', {
          originData: this.displayData[index],
          modifiedData: row,
        }).then((response) => {
          console.log(response);
          this.$messenger.success('手动更正成功。');
          this.displayData.remove(index);
          done();
        });
      },
      // eslint-disable-next-line no-unused-vars
      handleRowAccept({ index, row }, done) {
        this.$axios.post('/db/except/accept', {
          acceptData: this.displayData[index],
        }).then((response) => {
          console.log(response);
          this.$messenger.success('已接受更正建议。');
          this.displayData.remove(index);
          done();
        });
      },
    },
};
</script>

<style scoped>

</style>

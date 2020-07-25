<template>
  <div>
    <el-button @click="addRow">新增</el-button>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="tableData"
      :add-template="addTemplate"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"

      :rowHandle="rowHandle"
      :edit-template="editTemplate"
      @row-edit="handleRowEdit"

      @row-remove="handleRowRemove"

      :pagination="pagination"
      @pageination-current-change="paginationCurrentChange"

    ></d2-crud>
  </div>
</template>

<script>
export default {
  name: 'DataCRUDTable',
  data() {
    return {
      columns: [{
        title: '日期',
        key: 'date',
      },
      {
        title: '值',
        key: 'value',
      }],
      tableData: [
        {
          date: '2019-10-21',
          value: '11',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
        {
          date: '2018-10-21',
          value: '12',
        },
      ],

      addTemplate: {
        date: {
          title: '日期',
        },
        value: {
          title: '值',
        },
      },

      editTemplate: {
        date: {
          title: '日期',
        },
        value: {
          title: '值',
        },
      },

      rowHandle: {
        edit: {
          icon: 'el-icon-edit',
          text: '点我进行编辑',
          size: 'small',
        },
        remove: {
          icon: 'el-icon-delete',
          size: 'small',
          fixed: 'right',
          confirm: true,
        },
      },

      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 2,
      },
    };
  },
  methods:
      {
        addRow() {
          this.$refs.d2Crud.showDialog({
            mode: 'add',
          });
        },
        handleRowAdd(row, done) {
          console.log(row.date, row.value);
          done();
        },
        handleDialogCancel(done) {
          done();
        },
        handleRowEdit({ index, row }, done) {
          console.log(index, row);
          done();
        },
        handleRowRemove({ index, row }, done) {
          console.log(index, row);
          done();
        },
        paginationCurrentChange(currentPage) {
          this.pagination.currentPage = currentPage;
        },
      },
};
</script>

<style scoped>

</style>

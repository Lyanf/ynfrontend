<template>
  <div>
    <el-button @click="addRow">新增</el-button>
    <el-button @click="exportTableSheet" :disabled="dataEntryLength === 0">表格导出</el-button>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="displayData"
      :add-template="addTemplate"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"

      :rowHandle="rowHandle"
      :edit-template="editTemplate"
      @row-edit="handleRowEdit"

      @row-remove="handleRowRemove"
    ></d2-crud>
    <div style="color: darkgray; font-size: 12px">
      共 {{ dataEntryLength }} 条
    </div>
  </div>
</template>

<script>
import * as json2csv from 'json2csv';
import { saveAs } from 'file-saver';

export default {
  name: 'DataCRUDTable',
  props: ['displayData', 'category', 'context'],
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
        title: '键',
        key: 'key',
      },
      {
        title: '值',
        key: 'value',
      }],
      addTemplate: {
        key: {
          title: '键',
        },
        value: {
          title: '值',
        },
      },

      editTemplate: {
        key: {
          title: '键',
        },
        value: {
          title: '值',
        },
      },

      rowHandle: {
        edit: {
          text: '编辑',
          size: 'small',
        },
        remove: {
          size: 'small',
          fixed: 'right',
          confirm: true,
        },
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
        exportTableSheet() {
          const fields = [];
          this.$data.columns.forEach((item) => {
            fields.push(item.key);
          });
          console.log(fields);
          const data = json2csv.parse(this.displayData, {
            fields,
          });
          const blob = new Blob([data], { type: 'text/csv' });
          saveAs(blob, '数据库表格.csv');
        },
        handleRowAdd(row, done) {
          this.$axios.post('/db/create', {
            context: this.context,
            newData: {
              key: row.key,
              value: row.value,
            },
          }).then((response) => {
            console.log(response);
            this.$messenger.success('添加成功。');
            this.displayData.push(row);
            done();
          });
        },
        handleDialogCancel(done) {
          done();
        },
        handleRowEdit({ index, row }, done) {
          this.$axios.post('/db/update', {
            category: this.category,
            originData: this.displayData[index],
            modifiedData: row,
          }).then((response) => {
            console.log(response);
            this.$messenger.success('编辑成功。');
            this.displayData[index] = row;
            done();
          });
        },
        // eslint-disable-next-line no-unused-vars
        handleRowRemove({ index, row }, done) {
          this.$axios.post('/db/delete', {
            category: this.category,
            originData: this.displayData[index],
          }).then((response) => {
            console.log(response);
            this.$messenger.success('删除成功。');
            this.displayData.remove(index);
            done();
          });
        },
      },
};
</script>

<style scoped>

</style>

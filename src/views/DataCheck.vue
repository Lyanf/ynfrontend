<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form label-width="300px">
          <row><label>数据监测与更正</label></row>
          <el-form-item label="数据类型选择">
            <el-select></el-select>
          </el-form-item>
          <el-form-item label="历史年份">
            <el-date-picker></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button>异常检测</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-table
          :data="tableData"
          style="width: 90%">
          <el-table-column label="时间"></el-table-column>
          <el-table-column label="数据类型"></el-table-column>
          <el-table-column label="值"></el-table-column>
        </el-table>
        <el-row style="margin-top: 22px">
          <el-button>接受更改</el-button>
          <el-button>不接受</el-button>
          <el-button>手动更改</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'dataCheck',
};
</script>

<style scoped>

</style>

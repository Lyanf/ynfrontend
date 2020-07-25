<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-row>
          省级负荷预测方案选择:
          <el-select value=""></el-select>
        </el-row>
        <el-row>
          <el-form>
            <el-form-item>
              地市级负荷预测方案选择：
              <el-button type="primary">批量导入</el-button>
            </el-form-item>
            <el-form-item>
              昆明市：<el-select value=""></el-select>
              保山市：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              楚雄州：<el-select value=""></el-select>
              迪庆州：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              玉溪市：<el-select value=""></el-select>
              怒江州：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              曲靖市：<el-select value=""></el-select>
              丽江市：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              昭通市：<el-select value=""></el-select>
              德宏州：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              红河州：<el-select value=""></el-select>
              普洱州：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              文山州：<el-select value=""></el-select>
              临沧市：<el-select value=""></el-select>
            </el-form-item>
            <el-form-item>
              大理州：<el-select value=""></el-select>
              西双版纳州：<el-select value=""></el-select>
            </el-form-item>
            <el-button type="primary">预测</el-button>
          </el-form>
        </el-row>
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Coordinate',
};
</script>

<style scoped>

</style>

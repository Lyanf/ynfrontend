<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
             style="display: flex;justify-content: space-between"
             @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">开始</template>
        <el-menu-item index="1-1">登录</el-menu-item>
        <el-menu-item index="1-2">最近保存文件</el-menu-item>
        <el-menu-item index="1-3">退出</el-menu-item>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">数据库</template>
        <el-menu-item index="2-1">社会经济数据</el-menu-item>
        <el-menu-item index="2-2">电力电量数据</el-menu-item>
        <el-menu-item index="2-3">地理气象数据</el-menu-item>
        <el-menu-item index="2-4">全部数据</el-menu-item>
        <el-menu-item index="2-5">数据监测与更正</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">方案设置</template>
        <el-menu-item index="3-1">新建方案</el-menu-item>
        <el-menu-item index="3-2">查看方案</el-menu-item>
        <el-menu-item index="3-3">修改方案名称</el-menu-item>
        <el-menu-item index="3-4">删除方案</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">关联因素挖掘</template>
        <el-menu-item index="4-1">数据挖掘</el-menu-item>
        <el-menu-item index="4-2">结果展示</el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">电力电量预测</template>
        <el-submenu index="5-1">
          <template slot="title">近中期预测</template>
          <el-submenu index="5-1-1">
            <template slot="title">地区预测</template>
            <el-menu-item index="5-1-1-1">单预测模型</el-menu-item>
            <el-menu-item index="5-1-1-2">组合预测模型</el-menu-item>
          </el-submenu>
          <el-submenu index="5-1-2">
            <template slot="title">行业预测</template>
            <el-menu-item index="5-1-2-1">单预测模型</el-menu-item>
            <el-menu-item index="5-1-2-2">组合预测模型</el-menu-item>
          </el-submenu>
          <el-menu-item index="5-1-3">省市总分协调预测</el-menu-item>
        </el-submenu>
        <el-submenu index="5-2">
          <template slot="title">远期预测</template>
          <el-menu-item index="5-2-1">饱和曲线预测</el-menu-item>
          <el-menu-item index="5-2-3">负荷密度预测</el-menu-item>
        </el-submenu>
        <el-menu-item index="5-3">大用户预测</el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">负荷特性预测</template>
        <el-menu-item index="6-1">负荷特性指标计算</el-menu-item>
        <el-menu-item index="6-2">负荷特性指标预测</el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">预测结果</template>
        <el-menu-item index="7-1">预测结果查询</el-menu-item>
        <el-menu-item index="7-2">预测结果展示</el-menu-item>
      </el-submenu>

      <el-submenu index="8">
        <template slot="title">帮助</template>
        <el-menu-item index="8-1">用户手册</el-menu-item>
        <el-menu-item index="8-2">技术支持</el-menu-item>
        <el-menu-item index="8-3">关于</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-dialog title="方案设置" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="新建方案" name="3-1">
          <CreateNewSchema/>
        </el-tab-pane>
        <el-tab-pane label="查看方案" name="3-2">
          <ReadSchema/>
        </el-tab-pane>
        <el-tab-pane label="修改方案名称" name="3-3">
          <UpdateSchema/>
        </el-tab-pane>
        <el-tab-pane label="删除方案" name="3-4">
          <DeleteSchema/>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>

</template>

<script>
import CreateNewSchema from '@/components/SchemaCRUD/CreateNewSchema.vue';
import ReadSchema from '@/components/SchemaCRUD/ReadSchema.vue';
import UpdateSchema from '@/components/SchemaCRUD/UpdateSchema.vue';
import DeleteSchema from '@/components/SchemaCRUD/DeleteSchema.vue';

export default {
  name: 'TopMenu',
  components: {
    DeleteSchema,
    UpdateSchema,
    ReadSchema,
    CreateNewSchema,
  },
  data() {
    return {
      activeIndex: '1',
      activeName: '',
      dialogFormVisible: false,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if (keyPath[0] === '1') {
        if (keyPath[1] === '1-1') {
          window.location = '/#/logIn';
        }
      }
      if (keyPath[0] === '2') {
        if (keyPath[1] === '2-4') {
          window.location = '/#/dataBaseCRUD';
        } else if (keyPath[1] === '2-5') {
          window.location = '/#/dataCheck';
        } else {
          window.location = '/#/tempData';
        }
      }
      if (keyPath[0] === '3') {
        // eslint-disable-next-line prefer-destructuring
        this.activeName = keyPath[1];
        this.dialogFormVisible = true;
      }
      if (keyPath[0] === '4') {
        if (keyPath[1] === '4-1') {
          window.location = '/#/dataMining';
        }
        if (keyPath[1] === '4-2') {
          window.location = '/#/miningResult';
        }
      }
      if (keyPath[0] === '5') {
        if (key === '5-1-1-1') {
          window.location = '/#/PlaceSinglePrediction';
        }
        if (key === '5-1-2-1') {
          window.location = '/#/IndustrySinglePrediction';
        }
        if (key === '5-1-1-2') {
          window.location = '/#/PlaceMixPrediction';
        }
        if (key === '5-1-2-2') {
          window.location = '/#/IndustryMixPrediction';
        }
        if (key === '5-2-1') {
          window.location = '/#/LongTermBaohePredict';
        }
        if (key === '5-2-2') {
          window.location = '/#/LongTermMiduPredict';
        }
        if (key === '5-3') {
          window.location = '/#/BigUserPredict';
        }
      }
      if (keyPath[0] === '6') {
        if (key === '6-1') {
          window.location = '/#/FuHeTeXingCompute';
        }
        if (key === '6-2') {
          window.location = '/#/FuHeTeXingPredict';
        }
      }
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>

</style>

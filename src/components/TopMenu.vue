<template>
  <div>
    <div class="top-warning" :hidden="bannerHidden" align="center">未登录
      <a style="color: lightgray" href="/#/logIn">立即登录</a>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
             style="display: flex; justify-content: space-between; margin-bottom: 3em"
             @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">开始</template>
        <el-menu-item index="1-1">登录</el-menu-item>
        <el-menu-item index="1-2" :disabled="menuDisabled">最近保存文件</el-menu-item>
        <el-menu-item index="1-3">退出</el-menu-item>
      </el-submenu>

      <el-submenu index="2" :disabled="menuDisabled">
        <template slot="title">数据库</template>
        <el-menu-item index="2-1">社会经济数据</el-menu-item>
        <el-menu-item index="2-2">电力电量数据</el-menu-item>
        <el-menu-item index="2-3">地理气象数据</el-menu-item>
        <el-menu-item index="2-4">全部数据</el-menu-item>
        <el-menu-item index="2-5">数据监测与更正</el-menu-item>
      </el-submenu>

      <el-submenu index="3" :disabled="menuDisabled">
        <template slot="title">方案设置</template>
        <el-menu-item index="3-1">新建方案</el-menu-item>
        <el-menu-item index="3-2">查看方案</el-menu-item>
        <el-menu-item index="3-3">修改方案名称</el-menu-item>
        <el-menu-item index="3-4">删除方案</el-menu-item>
      </el-submenu>

      <el-submenu index="4" :disabled="menuDisabled">
        <template slot="title">关联因素挖掘</template>
        <el-menu-item index="4-1">数据挖掘</el-menu-item>
        <el-menu-item index="4-2">结果展示</el-menu-item>
      </el-submenu>

      <el-submenu index="5" :disabled="menuDisabled">
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
          <el-menu-item index="5-2-2">负荷密度预测</el-menu-item>
        </el-submenu>
        <el-menu-item index="5-3">大用户预测</el-menu-item>
      </el-submenu>

      <el-submenu index="6" :disabled="menuDisabled">
        <template slot="title">负荷特性预测</template>
        <el-menu-item index="6-1">负荷特性指标计算</el-menu-item>
        <el-menu-item index="6-2">负荷特性指标预测</el-menu-item>
      </el-submenu>

      <el-submenu index="7" :disabled="menuDisabled">
        <template slot="title">预测结果</template>
        <el-menu-item index="7-1">预测结果查询</el-menu-item>
        <el-menu-item index="7-2">预测结果展示</el-menu-item>
      </el-submenu>

      <el-submenu index="8" :disabled="menuDisabled">
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
  computed: {
    menuDisabled() {
      return !this.$store.state.isLogin;
    },
    bannerHidden() {
      return this.$store.state.isLogin;
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      if (keyPath[0] === '1') {
        // 开始
        if (keyPath[1] === '1-1') {
          // 登录
          window.location = '/#/logIn';
        } else if (keyPath[1] === '1-2') {
          // 最近保存文件
          window.location = '/#/';
        } else if (keyPath[1] === '1-3') {
          // 退出
          window.location = '/#/logIn';
          this.$store.commit('logout');
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '2') {
        // 数据库
        if (keyPath[1] === '2-1') {
          // 社会经济数据
          window.location = '/#/SocialEcoData';
        } else if (keyPath[1] === '2-2') {
          // 电力电量数据
          window.location = '/#/ElectricityPowerData';
        } else if (keyPath[1] === '2-3') {
          // 地理气象数据
          window.location = '/#/GeoWeatherData';
        } else if (keyPath[1] === '2-4') {
          // 全部数据
          window.location = '/#/dataBaseCRUD';
        } else if (keyPath[1] === '2-5') {
          // 数据监测与更正
          window.location = '/#/dataCheck';
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '3') {
        // 方案设置，共用一个 View
        // eslint-disable-next-line prefer-destructuring
        this.activeName = keyPath[1];
        this.dialogFormVisible = true;
      } else if (keyPath[0] === '4') {
        // 关联因素挖掘
        if (keyPath[1] === '4-1') {
          // 数据挖掘
          window.location = '/#/dataMining';
        } else if (keyPath[1] === '4-2') {
          // 结果展示
          window.location = '/#/miningResult';
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '5') {
        // 电力电量预测
        if (key === '5-1-1-1') {
          // 近中期预测、地区预测、单预测模型
          window.location = '/#/PlaceSinglePrediction';
        } else if (key === '5-1-2-1') {
          // 近中期预测、行业预测、单预测模型
          window.location = '/#/IndustrySinglePrediction';
        } else if (key === '5-1-1-2') {
          // 近中期预测、地区预测、组合预测模型
          window.location = '/#/PlaceMixPrediction';
        } else if (key === '5-1-2-2') {
          // 近中期预测、行业预测、组合预测模型
          window.location = '/#/IndustryMixPrediction';
        } else if (key === '5-1-3') {
          // 省、市总分协调预测
          window.location = '/#/ProvMuniCoordPredict';
        } else if (key === '5-2-1') {
          // 远期预测，饱和曲线预测
          window.location = '/#/LongTermBaohePredict';
        } else if (key === '5-2-2') {
          // 远期预测，负荷密度预测
          window.location = '/#/LongTermMiduPredict';
        } else if (key === '5-3') {
          // 大用户预测
          window.location = '/#/BigUserPredict';
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '6') {
        // 负荷特性预测
        if (key === '6-1') {
          // 负荷特性指标计算
          window.location = '/#/FuHeTeXingCompute';
        } else if (key === '6-2') {
          // 负荷特性指标预测
          window.location = '/#/FuHeTeXingPredict';
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '7') {
        // 预测结果
        if (keyPath[1] === '7-1') {
          // 预测结果查询
          window.location = '/#/PredictResultQuery';
        } else if (keyPath[1] === '7-2') {
          // 预测结果展示
          window.location = '/#/PredictResultDisplay';
        } else {
          console.assert(false);
        }
      } else if (keyPath[0] === '8') {
        // 帮助
        if (keyPath[1] === '8-1') {
          // 用户手册
          window.location = '/#/Manual';
        } else if (keyPath[1] === '8-2') {
          // 技术支持
          window.location = '/#/TechSupport';
        } else if (keyPath[1] === '8-3') {
          // 关于
          window.location = '/#/About';
        } else {
          console.assert(false);
        }
      } else {
        console.assert(false);
      }
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>
.top-warning {
  padding: 5px;
  color: white;
  background-color: darkred;
}
</style>

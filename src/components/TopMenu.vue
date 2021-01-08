<template>
  <div>
    <div class="top-warning" :hidden="bannerHidden" align="center">未登录
      <a style="color: lightgray" href="/#/logIn">立即登录</a>
    </div>
    <el-dialog @close="clearInput"
               title="确认版本名称"
               :visible.sync="saveDialogVisible"
               width="30%">
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="versionName" @keyup.enter.native="submitVersion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitVersion"
                   :disabled="versionName.length === 0">确定</el-button>
      </span>
    </el-dialog>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
             style="display: flex; justify-content: space-between; margin-bottom: 3em"
             @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">开始</template>
        <el-menu-item index="1-1">登录</el-menu-item>
        <el-submenu :disabled="menuDisabled" index="1-loadVersion">
          <template slot="title" @click="refreshVersion">加载版本…</template>
          <el-menu-item index="1-placeholder"
                        v-if="knownVersions.length === 0"
                        :disabled=true>无可用版本</el-menu-item>
          <div index="placeholder" v-if="knownVersions.length !== 0">
            <el-menu-item v-for="item in knownVersions"
                          :key="item" :index="item"
                          :is-active="item === $store.state.currentVersion">
              {{ item }}
            </el-menu-item>
          </div>
          <el-divider index="1-split"></el-divider>
          <el-menu-item index="1-2-1">刷新</el-menu-item>
        </el-submenu>
        <el-menu-item index="1-2-2" :disabled="menuDisabled">储存版本</el-menu-item>
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
      knownVersions: [],
      versionName: '',
      saveDialogVisible: false,
      isLogin: this.$store.state.isLogin,
    };
  },
  computed: {
    menuDisabled() {
      return !this.$store.state.isLogin;
    },
    bannerHidden() {
      const login = this.$store.state.isLogin;
      if (login) {
        this.refreshVersion();
      }
      return login;
    },
  },
  methods: {
    clearInput() {
      this.$data.versionName = '';
    },
    refreshVersion() {
      this.$axios.get('/vcs/get').then((response) => {
        console.log(response);
        this.$data.knownVersions = response.data.data;
      });
    },
    submitVersion() {
      const VersionName = this.$data.versionName;
      this.$axios.post('/vcs/put', {
        VersionName,
      }).then((response) => {
        console.log(response);
        this.$messenger.success(`成功创建了名为 ${VersionName} 的版本。`);
        this.saveDialogVisible = false;
        this.refreshVersion();
      });
    },
    logOut() {
      this.$store.commit('switchVersion', undefined);
      this.$store.commit('logout');
      this.$axios.post('/logout').then((response) => {
        console.log(response);
        this.$messenger.success('注销成功。');
      });
    },
    handleSelect(key, keyPath) {
      if (keyPath[0] === '1') {
        // 开始
        if (keyPath[1] === '1-1') {
          // 登录
          window.location = '/#/logIn';
        } else if (keyPath[1] === '1-3') {
          // 退出
          window.location = '/#/logIn';
          this.logOut();
        } else if (keyPath[2] === '1-2-1') {
          // 加载
          this.refreshVersion();
        } else if (keyPath[1] === '1-2-2') {
          // 储存版本
          this.$data.saveDialogVisible = true;
        } else {
          // 加载特定版本
          const versionName = keyPath[2];
          this.$store.commit('switchVersion', versionName);
          this.$messenger.success(`已经成功切换到 ${versionName} 版本。`);
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

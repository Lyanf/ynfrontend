<template>
  <div>
    <input hidden="true" type="file" value="" id="file">
    <div class="top-warning" :hidden="bannerHidden" align="center" style="font-size: 14px">未登录
      <el-button type="text" style="color: white" @click="switchToLogin">立即登录</el-button>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
             style="display: flex;
             justify-content: space-between;
             margin-bottom: 3em;
             color: #ffffff;
             background-color: #ddddff"
             @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">开始</template>
        <el-menu-item index="1-1">登录</el-menu-item>
        <el-submenu index="1-2" :disabled="menuDisabled">
          <template slot="title">最近保存文件</template>
          <el-menu-item v-for="item in recentFiles"
          :key="item.url" :index="item.url">
            {{item.name}}
          </el-menu-item>
          <el-menu-item v-if="recentFiles.length === 0" :disabled="true">无最近文件</el-menu-item>
          <el-divider index="1-2-2"></el-divider>
          <el-menu-item index="1-2-3">刷新</el-menu-item>
        </el-submenu>
        <el-menu-item index="1-3">退出</el-menu-item>
      </el-submenu>

      <el-submenu index="2" :disabled="menuDisabled">
        <template slot="title">数据库</template>
         <el-menu-item index="2-1">增加元数据节点</el-menu-item>
        <el-menu-item index="2-2">重命名元数据节点</el-menu-item>
        <el-menu-item index="2-3">删除元数据节点</el-menu-item>
         <el-menu-item index="2-6">生成数据模板</el-menu-item>
        <el-divider></el-divider>
        <el-menu-item index="2-4">全部数据</el-menu-item>
        <el-menu-item index="2-5">数据监测与更正</el-menu-item>
        <el-menu-item index="2-7">导入数据…</el-menu-item>
      </el-submenu>

      <el-submenu index="3" :disabled="menuDisabled">
        <template slot="title">方案标签</template>
        <el-menu-item index="3-3">修改方案标签</el-menu-item>
        <el-menu-item index="3-4">删除方案标签</el-menu-item>
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
            <el-menu-item index="5-DQZHYC">组合预测模型</el-menu-item>
          </el-submenu>
          <el-submenu index="5-1-2">
            <template slot="title">行业预测</template>
            <el-menu-item index="5-1-2-1">单预测模型</el-menu-item>
            <el-menu-item index="5-HYZHYC">组合预测模型</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="5-2">
          <template slot="title">远期预测</template>
          <el-menu-item index="5-2-1">饱和曲线预测</el-menu-item>
          <el-menu-item index="5-2-2">负荷密度预测</el-menu-item>
        </el-submenu>
        <el-menu-item index="5-SSZF">省市总分协调预测</el-menu-item>
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
        <el-menu-item index="7-2">预测结果对比</el-menu-item>
      </el-submenu>

      <el-submenu index="8" :disabled="menuDisabled">
        <template slot="title">帮助</template>
        <el-menu-item index="8-1">用户手册</el-menu-item>
        <el-menu-item index="8-2">技术支持</el-menu-item>
        <el-menu-item index="8-3">关于</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-dialog title="方案标签" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card" @tab-click="triggerReloadSchemas">
        <el-tab-pane label="修改标签名称" name="3-3">
          <UpdateSchema ref="renameSchemaView"></UpdateSchema>
        </el-tab-pane>
        <el-tab-pane label="删除标签" name="3-4">
          <DeleteSchema ref="deleteSchemaView"></DeleteSchema>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="元数据管理" :visible.sync="metaDataDialogFormVisible">
      <el-tabs v-model="activeMetadataName" type="card" @tab-click="triggerReloadMetas">
        <el-tab-pane label="新建节点" name="2-1">
          <CreateNewNode ref="newMetaView"></CreateNewNode>
        </el-tab-pane>
        <el-tab-pane label="修改节点名称" name="2-2">
          <RenameNode ref="renameMetaView"></RenameNode>
        </el-tab-pane>
        <el-tab-pane label="删除节点" name="2-3">
          <DeleteNode ref="deleteMetaView"></DeleteNode>
        </el-tab-pane>
        <el-tab-pane label="生成数据模板" name="2-6">
          <UploadData ref="uploadMetaView"></UploadData>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="导入数据" :visible.sync="uploadDialogFormVisible">
      <UploadDataBase ref="uploadDataBase"></UploadDataBase>
    </el-dialog>
  </div>

</template>

<script>
import CreateNewNode from '@/components/MetadataCRUD/CreateNewNode.vue';
import RenameNode from '@/components/MetadataCRUD/RenameNode.vue';
import DeleteNode from '@/components/MetadataCRUD/DeleteNode.vue';
import UploadData from '@/components/MetadataCRUD/UploadData.vue';
import UpdateSchema from '@/components/SchemaCRUD/UpdateSchema.vue';
import DeleteSchema from '@/components/SchemaCRUD/DeleteSchema.vue';
import UploadDataBase from '@/components/UploadDataBase.vue';

import { saveAs } from 'file-saver';

export default {
  name: 'TopMenu',
  components: {
    CreateNewNode,
    RenameNode,
    DeleteNode,
    UploadData,
    DeleteSchema,
    UpdateSchema,
    UploadDataBase,
  },
  data() {
    return {
      recentFiles: [],
      activeIndex: '1',
      activeName: '',
      activeMetadataName: '',
      dialogFormVisible: false,
      metaDataDialogFormVisible: false,
      uploadDialogFormVisible: false,
      saveDialogVisible: false,
      knownVersions: [],
      versionName: '',
      isLogin: this.$store.state.isLogin,
    };
  },
  computed: {
    menuDisabled() {
      return !this.$store.state.isLogin;
    },
    bannerHidden() {
      const { isLogin } = this.$store.state;
      if (isLogin) {
        this.loadRecentFiles();
      }
      return isLogin;
    },
  },
  mounted() {
    this.updateBaseUrl();
    window.location = '/#/logIn';
  },
  methods: {
    updateBaseUrl() {
      // ... and give up unfinished loadings
      this.$store.commit('finishLoad');
    },
    loadRecentFiles() {
      this.$axios.get('/recent').then((response) => {
        this.$data.recentFiles = response.data.data;
      });
    },
    switchToLogin() {
      window.location = '/#/logIn';
    },
    triggerReloadSchemas() {
      const schemaViews = [
        this.$refs.renameSchemaView,
        this.$refs.deleteSchemaView];
      schemaViews.forEach((item) => {
        if (item !== undefined) {
          item.loadSchema();
        }
      });
    },
    triggerReloadMetas() {
      const metaViews = [
        this.$refs.createMetaView,
        this.$refs.renameMetaView,
        this.$refs.deleteMetaView,
        this.$refs.uploadMetaView,
      ];
      metaViews.forEach((item) => {
        if (item !== undefined) {
          item.loadMetadata();
        }
      });
    },
    logOut() {
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
        } else if (keyPath[2] === '1-2') {
          // 加载
          // this.refreshVersion();
        } else if (keyPath[2] === '1-2-2') {
          // 分割线
        } else if (keyPath[2] === '1-2-3') {
          // 重新加载
          this.loadRecentFiles();
        } else if (keyPath[2] !== undefined) {
          saveAs(keyPath[2]);
        }
      } else if (keyPath[0] === '2') {
        // 数据库
        if (keyPath[1] === '2-4') {
          // 全部数据
          window.location = '/#/dataBaseCRUD';
        } else if (keyPath[1] === '2-5') {
          // 数据监测与更正
          window.location = '/#/dataCheck';
        } else if (keyPath[1] === '2-7') {
          // 数据导入
          this.$data.uploadDialogFormVisible = true;
        } else {
          // 元数据管理，共用一个页面
          this.triggerReloadMetas();
          // eslint-disable-next-line prefer-destructuring
          this.$data.activeMetadataName = keyPath[1];
          this.$data.metaDataDialogFormVisible = true;
        }
      } else if (keyPath[0] === '3') {
        // 方案设置，共用一个 View
        // eslint-disable-next-line prefer-destructuring
        this.activeName = keyPath[1];
        this.triggerReloadSchemas();
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
        } else if (key === '5-DQZHYC') {
          // 近中期预测、地区预测、组合预测模型
          window.location = '/#/PlaceMixPrediction';
        } else if (key === '5-HYZHYC') {
          // 近中期预测、地区预测、组合预测模型
          window.location = '/#/IndustryMixPrediction';
        } else if (key === '5-SSZF') {
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

<style>
.top-warning {
  margin: 2px;
  color: white;
  background-color: darkred;
}

.top-info {
  margin: 2px;
  color: white;
  background-color: darkblue;
}

.el-submenu__title {
  font-size: 20px !important;
  font-weight: bold !important;
}
</style>

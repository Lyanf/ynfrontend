<template>
  <div id="app">
    <LoadingView v-if="$store.state.isLoading"></LoadingView>
    <TopMenu></TopMenu>
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
<!--    <RouteLinker></RouteLinker>-->
      <router-view></router-view>
    <div style="text-align: center; margin: 20px">
      <el-radio-group v-model="serverType">
        <el-radio-button label="online">在线版</el-radio-button>
        <el-radio-button label="offline">离线版</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
// import RouteLinker from '@/components/RouteLinker.vue';
import TopMenu from '@/components/TopMenu.vue';

export default {
  name: 'App',
  components: {
    TopMenu,
    // RouteLinker,
  },
  data() {
    return {
      isOnline: this.$store.state.isOnline,
      serverType: '',
    };
  },
  mounted() {
    if (this.$store.state.isOnline) {
      this.$data.serverType = 'online';
    } else {
      this.$data.serverType = 'offline';
    }
  },
  watch: {
    serverType(value) {
      if (value === 'offline') {
        this.$axios.defaults.baseURL = 'http://localhost:18000/api';
        this.$store.commit('switchOffline');
      } else {
        this.$axios.defaults.baseURL = 'http://dclab.club:18000/api';
        this.$store.commit('switchOnline');
      }
    },
  },
};

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  outline-color: #ffffff;
  background-color: #4f58db;
}

.el-checkbox__label {
  color: #cccccc;
  font-size: 11px;
}

.el-form-item__label {
  color: #cccccc;
  font-size: 16px;
  font-weight: bold;
}

.el-submenu__title {
  color: #ffffff;
}

.el-tabs__item {
  color: #aaaaaa;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-date-editor--yearrange {
  width: 100%;
}

#app {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/*#nav {*/
/*  padding: 30px;*/
/*}*/

/*#nav a {*/
/*  font-weight: bold;*/
/*  color: #2c3e50;*/
/*}*/

/*#nav a.router-link-exact-active {*/
/*  color: #42b983;*/
/*}*/
</style>

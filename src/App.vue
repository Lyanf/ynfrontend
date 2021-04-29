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

.el-form-item__label {
  color: #cccccc;
}

.el-submenu__title {
  color: #ffffff;
}

.el-tabs__item {
  color: #aaaaaa;
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

<template>
  <div>
    <div  v-for="item in links" v-bind:key="item.path">
    <router-link :to="item.path" >{{item.name}}</router-link>
    </div>
  </div>
</template>
<script>
import router from '../router/index';

export default {
  name: 'RouteLinker',
  data() {
    return {
      links: [],
    };
  },
  mounted() {
    console.log(router);
    this.links = router.options.routes;
    console.log(this.links);
    // Object.values(router.options.routes).forEach((i) => {
    //   const { name } = i;
    //   const { path } = i;
    // });
  },
};
</script>

<style scoped>

</style>

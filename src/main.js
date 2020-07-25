import Vue from 'vue';
import ElementUI from 'element-ui';
import D2Crud from '@d2-projects/d2-crud';

// import RouteLinker from '@/components/RouteLinker.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(D2Crud);

// Vue.use(RouterLink);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

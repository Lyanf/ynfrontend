import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import D2Crud from '@d2-projects/d2-crud';
import GlobalVariables from '@/globals';
// import RouteLinker from '@/components/RouteLinker.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(D2Crud);
Vue.use(Vuex);
Vue.prototype.Global = GlobalVariables;

const store = new Vuex.Store({
  state: {
    isLogin: false,
  },
  mutations: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
  },
});

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount('#app');

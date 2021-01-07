import Vue from 'vue';
import Vuex from 'vuex';
import axiosApi from 'axios';
import Print from 'vue-print-nb';
import ElementUI from 'element-ui';
import D2Crud from '@d2-projects/d2-crud';
import LoadingView from '@/components/LoadingView.vue';
// import RouteLinker from '@/components/RouteLinker.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(D2Crud);
Vue.use(Vuex);
Vue.use(Print);

Vue.component('LoadingView', LoadingView);

const store = new Vuex.Store({
  state: {
    isLogin: false,
    isLoading: false,
  },
  mutations: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
    beginLoad(state) {
      state.isLoading = true;
    },
    finishLoad(state) {
      state.isLoading = false;
    },
  },
});

const messenger = {
  success(msg) {
    ElementUI.Message({
      message: msg,
      type: 'success',
      showClose: true,
    });
  },
  warning(msg) {
    ElementUI.Message({
      message: msg,
      type: 'warning',
      showClose: true,
    });
  },
  error(msg) {
    ElementUI.Message({
      message: msg,
      type: 'error',
      showClose: true,
    });
  },
};

const axios = axiosApi.create({
  baseURL: 'http://localhost:5000/api/',
});

axios.interceptors.request.use(
  (config) => {
    store.commit('beginLoad');
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => {
    store.commit('finishLoad');
    if (response.data.code === 200) {
      return response;
    }
    this.$messenger.error(`请求失败！服务器报告了一个 ${response.data.msg} 错误。`);
    return Promise.reject(response);
  },
  (error) => {
    store.commit('finishLoad');
    this.$messenger.error('请求失败！无法连接到服务器。');
    return Promise.reject(error);
  },
);

Vue.prototype.$axios = axios;
Vue.prototype.$messenger = messenger;

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount('#app');

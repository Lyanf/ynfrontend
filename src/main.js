import Vue from 'vue';
import Vuex from 'vuex';
import axiosApi from 'axios';
import Print from 'vue-print-nb';
import ElementUI from 'element-ui';
import D2Crud from '@d2-projects/d2-crud';
import VuexPersistence from 'vuex-persist';
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

const axios = axiosApi.create({
  baseURL: 'http://localhost:18000/api',
});

axios.defaults.timeout = 142857;

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

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
  plugins: [vuexLocal.plugin],
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
    messenger.error(`请求失败！服务器报告了一个 ${response.data.msg} 错误。`);
    return Promise.reject(response);
  },
  (error) => {
    store.commit('finishLoad');
    messenger.error(`请求失败！${error}`);
    return Promise.reject(error);
  },
);

// Array Remove - By John Resig (MIT Licensed)
// eslint-disable-next-line no-extend-native,func-names
Array.prototype.remove = function (from, to) {
  const rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  // eslint-disable-next-line prefer-spread
  return this.push.apply(this, rest);
};

// eslint-disable-next-line no-extend-native,func-names
Date.prototype.format = function (inFmt) {
  let fmt = inFmt;
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
};

Vue.prototype.$axios = axios;
Vue.prototype.$messenger = messenger;

new Vue({
  router,
  render: (h) => h(App),
  store,
}).$mount('#app');

// if (process.env.NODE_ENV === 'development') {
//   devtools.connect('localhost', 8098);
// }

import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/logIn',
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/PlaceSinglePrediction',
    name: 'PlaceSinglePrediction',
    component: () => import('../views/PlaceSinglePrediction'),
  },
  {
    path: '/IndustrySinglePrediction',
    name: 'IndustrySinglePrediction',
    component: () => import('../views/IndustrySinglePrediction'),
  },
  {
    path: '/IndustryMixPrediction',
    name: 'IndustryMixPrediction',
    component: () => import('../views/IndustryMixPrediction'),
  },
  {
    path: '/PlaceMixPrediction',
    name: 'PlaceMixPrediction',
    component: () => import('../views/PlaceMixPrediction'),
  },
  {
    path: '/LongTermBaohePredict',
    name: 'LongTermBaohePredict',
    component: () => import('../views/LongTermBaohePredict'),
  },
  {
    path: '/LongTermMiduPredict',
    name: 'LongTermMiduPredict',
    component: () => import('../views/LongTermMiduPredict'),
  },
  {
    path: '/dataMining',
    name: 'dataMining',
    component: () => import('../views/DataMining'),
  },
  {
    path: '/Pierxun',
    name: 'Pierxun',
    component: () => import('../views/Pierxun'),
  },
  {
    path: '/Kjunzhi',
    name: 'Kjunzhi',
    component: () => import('../views/Kjunzhi'),
  },
  {
    path: '/Zhuchengfen',
    name: 'Zhuchengfen',
    component: () => import('../views/Zhuchengfen'),
  },
  {
    path: '/Guanlianguize',
    name: 'Guanlianguize',
    component: () => import('../views/Guanlianguize'),
  },
  {
    path: '/miningResult',
    name: 'miningResult',
    component: () => import('../views/MiningResult'),
  },
  {
    path: '/Coordinate',
    name: 'Coordinate',
    component: () => import('../views/Coordinate'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LogIn'),
  },
  {
    path: '/tempData',
    name: 'tempData',
    component: () => import('../views/test.vue'),
  },
  {
    path: '/dataBaseCRUD',
    name: 'dataBaseCRUD',
    component: () => import('../views/DataBaseCRUD.vue'),
  },
  {
    path: '/FuHeTeXingCompute',
    name: 'FuHeTeXingCompute',
    component: () => import('../views/FuHeTeXingCompute.vue'),
  },
  {
    path: '/FuHeTeXingPredict',
    name: 'FuHeTeXingPredict',
    component: () => import('../views/FuHeTeXingPredict.vue'),
  },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   hidden: true
  // },

];

const router = new VueRouter({
  routes,
});

export default router;

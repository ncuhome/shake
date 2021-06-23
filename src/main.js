// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'lib-flexible'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from './vuex/store'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
 
// // require styles
// import 'swiper/dist/css/swiper.css'
 
// Vue.use(VueAwesomeSwiper, /* { default global options } */
import FastClick from 'fastclick'

FastClick.attach(document.body)
axios.interceptors.request.use(
    config => {
        if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `passport ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
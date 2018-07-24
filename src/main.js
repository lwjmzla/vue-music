// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'common/stylus/index.styl'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

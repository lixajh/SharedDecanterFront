import 'babel-polyfill'
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css
import '@/styles/main-table.css' // global css
import App from './App'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie'
import '@/icons' // icon
import '@/permission' // permission control
import Validate from './utils/validate'
// Tell Vue to use the plugin
Vue.use(VueCookie);

Vue.use(ElementUI, { locale });
Vue.use(Validate);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

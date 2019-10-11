import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { Button } from 'vant'

Vue.config.productionTip = false
// 组件库注册使用
// Vue
//   .use(Button)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

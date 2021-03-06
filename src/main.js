import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'
import fastClick from 'fastclick'
import 'amfe-flexible/index.js'

import {
  NavBar,
  Field,
  Icon,
  Button,
  Toast,
  Cell,
  CellGroup,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Grid,
  GridItem,
  ImagePreview,
  Image,
  Lazyload,
  Popup,
  Search,
  Loading,
  Dialog,
  ActionSheet,
  DatetimePicker
} from 'vant' // 登录导航栏

Vue.config.productionTip = false
// 组件库注册使用

Vue
  .use(NavBar)
  .use(Field)
  .use(Icon)
  .use(Button)
  .use(Toast)
  .use(Cell)
  .use(CellGroup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Grid)
  .use(GridItem)
  .use(ImagePreview)
  .use(Image)
  .use(Lazyload)
  .use(Popup)
  .use(Search)
  .use(Loading)
  .use(Dialog)
  .use(ActionSheet)
  .use(DatetimePicker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 解决移动端点击 300ms 延迟
fastClick.attach(document.body)

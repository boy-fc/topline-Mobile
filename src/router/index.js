import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    // 登录页面
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/login')
    },
    // 首页
    {
      path: '/',
      component: () => import('../views/tabbar'),
      children: [
        {
          name: 'home',
          path: '/',
          component: () => import('../views/home')
        }
      ]
    }
  ]
})

export default router

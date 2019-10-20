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
        },
        // 我的
        {
          name: 'my',
          path: '/my',
          component: () => import('../views/my')
        },
        // 编辑个人信息
        {
          name: 'user',
          path: '/user',
          component: () => import('../views/user')
        }
      ]
    },
    // 搜索
    {
      name: 'search',
      path: '/search',
      component: () => import('../views/search')
    },
    // 搜索结果
    {
      name: 'search-result',
      path: '/search/:q',
      component: () => import('../views/search-result')
    },
    // 文章详情
    {
      name: 'article',
      path: '/article/:articleId',
      component: () => import('../views/article')
    },
    // 聊天机器人
    {
      name: 'chat',
      path: '/chat',
      component: () => import('../views/chat')
    }
  ]
})

export default router

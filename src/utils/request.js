// axios 请求相关操作封装到这里
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'
// import VueRouter from 'vue-router'
import router from '@/router'

// 配置请求基础路径
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 处理后端返回数据超出 JS 安全整数范围问题
request.defaults.transformResponse = [function (data) {
  return data ? JSONbig.parse(data) : {}
}]

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 在发起请求请做一些业务处理
  // config是要发送请求的配置信息
  const user = store.state.user
  if (user) {
    // Authorization 是后端要求的名字，不能瞎写
    // 数据值 "Bearer空格token" 也是后端要求的数据格式，不能瞎写
    // 千万!千万!千万!注意，Bearer 和 token 之间的空格不能少
    // 什么意义？这是后端要求的，我们决定不了。
    config.headers['Authorization'] = `Bearer ${user.token}` // 统一注入token 到headers属性 因为所有接口要求的token格式是一样的
  }
  return config
}, function (error) {
  // 对请求失败做处理
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // <400的状态码进这里
  return response
}, async function (error) { // >=400的状态码进入这里
  console.dir(error)
  // 如果状态码是401
  if (error.response && error.response.status === 401) {
    const { user } = store.state
    if (!user) {
      // 直接跳转到登录页面
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
          // foo: 'bar'
        }
      })
    } else {
      try {
        // 请求获取新的token
        const { data } = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 将最新的token替换原有的token
        store.commit('setUser', {
          token: data.data.token, // 最新获取的
          refresh_token: user.refresh_token // 还是原来的
        })
        // 将原来失败的请求发送出去
        return request(error.config)
      } catch (err) {
        console.log(err)
        // 刷新token获取新的token也失败了，直接跳转到登录页面
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
            // foo: 'bar'
          }
        })
      }
    }
  }
  // 如果有 refresh_token，则请求刷新 token
  return Promise.reject(error)
})

export default request
